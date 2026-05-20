import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_SALT_ROUNDS } from '../config';
import { sendPasswordResetEmail, sendPasswordChangedEmail } from '../utils/email';

const router = Router();

/** Relasi user yang selalu disertakan dalam response auth */
const USER_INCLUDE = {
  socialLinks: true,
  phones: true,
  experience: true,
  education: true,
} as const;

/** Shape user yang aman dikirim ke client (tanpa password) */
function sanitizeUser(user: any) {
  const { password: _, ...safe } = user;
  return safe;
}

// POST /api/auth/register
router.post('/register', async (req, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      include: USER_INCLUDE,
    });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(201).json({ message: 'User berhasil didaftarkan', token, user: sanitizeUser(user) });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email }, include: USER_INCLUDE });
    if (!user) return res.status(400).json({ error: 'Email atau password salah' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Email atau password salah' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.json({ token, user: sanitizeUser(user) });
  } catch {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: USER_INCLUDE,
    });
    if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    res.json(sanitizeUser(user));
  } catch {
    res.status(500).json({ error: 'Gagal memverifikasi sesi' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { name, headline, bio, profileImageUrl, location, socialLinks, phones } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name,
        headline,
        bio,
        profileImageUrl,
        location,
        socialLinks: {
          deleteMany: {},
          create: socialLinks?.map((s: any) => ({ platform: s.platform, url: s.url })) ?? [],
        },
        phones: {
          deleteMany: {},
          create: phones?.map((p: any) => ({ number: p.number, label: p.label ?? 'Utama' })) ?? [],
        },
      },
      include: USER_INCLUDE,
    });
    res.json(sanitizeUser(updated));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ error: 'Gagal memperbarui profil' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res: Response) => {
  const { email } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'Jika email terdaftar, link reset password telah dikirim' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
      },
    });

    // Send email
    const emailSent = await sendPasswordResetEmail(email, resetToken, user.name);
    
    if (!emailSent) {
      console.error('Failed to send password reset email');
      // Still return success to user for security
    }

    res.json({ message: 'Jika email terdaftar, link reset password telah dikirim' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token dan password baru diperlukan' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter' });
  }

  try {
    // Hash the token to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token tidak valid atau sudah kadaluarsa' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Send confirmation email
    await sendPasswordChangedEmail(user.email, user.name);

    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// GET /api/auth/verify-reset-token
router.get('/verify-reset-token', async (req, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token diperlukan' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token tidak valid atau sudah kadaluarsa' });
    }

    res.json({ valid: true, email: user.email });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

export default router;
