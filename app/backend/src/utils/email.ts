import nodemailer from 'nodemailer';

/**
 * Email service for sending password reset emails.
 * 
 * SETUP REQUIRED:
 * Add these environment variables to your .env file:
 * 
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your-email@gmail.com
 * SMTP_PASS=your-app-password
 * FRONTEND_URL=http://localhost:5173
 * 
 * For Gmail, you need to create an "App Password":
 * 1. Go to Google Account settings
 * 2. Security > 2-Step Verification
 * 3. App passwords > Generate new app password
 */

// Create reusable transporter
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // Check if email is configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  Email service not configured. Set SMTP_USER and SMTP_PASS in .env');
    return null;
  }

  return nodemailer.createTransporter(config);
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  userName: string
): Promise<boolean> => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('Email service not configured');
    return false;
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"jagoCV" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Password Anda - jagoCV',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .button { display: inline-block; padding: 14px 28px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🔐 Reset Password</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${userName}</strong>,</p>
            <p>Kami menerima permintaan untuk mereset password akun jagoCV Anda. Klik tombol di bawah untuk membuat password baru:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password Saya</a>
            </div>
            
            <p>Atau salin dan tempel link berikut ke browser Anda:</p>
            <p style="background: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 14px;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>⚠️ Penting:</strong> Link ini hanya berlaku selama <strong>1 jam</strong> dan hanya dapat digunakan sekali.
            </div>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tidak akan berubah.
            </p>
          </div>
          <div class="footer">
            <p>© 2026 jagoCV AI. All rights reserved.</p>
            <p>Email ini dikirim secara otomatis, mohon tidak membalas.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return false;
  }
};

/**
 * Send password changed confirmation email
 */
export const sendPasswordChangedEmail = async (
  email: string,
  userName: string
): Promise<boolean> => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('Email service not configured');
    return false;
  }

  const mailOptions = {
    from: `"jagoCV" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Anda Telah Diubah - jagoCV',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">✅ Password Berhasil Diubah</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${userName}</strong>,</p>
            <p>Password akun jagoCV Anda telah berhasil diubah pada <strong>${new Date().toLocaleString('id-ID')}</strong>.</p>
            <p>Jika Anda tidak melakukan perubahan ini, segera hubungi tim support kami.</p>
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Terima kasih telah menggunakan jagoCV! 🚀
            </p>
          </div>
          <div class="footer">
            <p>© 2026 jagoCV AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password changed confirmation sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password changed email:', error);
    return false;
  }
};
