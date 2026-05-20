import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

export default function ResetPasswordView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setError('Token tidak ditemukan. Silakan gunakan link dari email Anda.');
      setIsVerifying(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const result = await api.verifyResetToken(token);
        setTokenValid(true);
        setUserEmail(result.email);
      } catch (err: any) {
        setError(err.message || 'Token tidak valid atau sudah kadaluarsa');
        setTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (!token) {
      setError('Token tidak ditemukan');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal mereset password. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#070B19]">
      <div className="flex min-h-screen flex-col lg:flex-row w-full">
        
        {/* Left Side: Brand & Abstract */}
        <div className="flex flex-col justify-between w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#0A0F1F] p-8 sm:p-12 lg:px-16 lg:py-12 lg:min-h-screen flex-shrink-0">
          {/* Ambient Effects */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          
          {/* Logo & Back Button */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <Link to="/" className="flex items-center cursor-pointer group w-fit">
              <img src="/JagoCV.png" alt="jagoCV Logo" className="h-12 w-auto block dark:hidden group-hover:scale-105 transition-transform" />
              <img src="/JagoCV%20BW.png" alt="jagoCV Logo" className="h-12 w-auto hidden dark:block group-hover:scale-105 transition-transform" />
            </Link>
            <Link to="/login" className="hidden sm:flex items-center gap-2 text-white/80 hover:text-white transition-all hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5 hover:border-white/20 text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Kembali ke Login
            </Link>
          </div>

          {/* Content Message */}
          <div className="relative z-10 max-w-lg my-12 lg:mt-auto lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-green-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Buat Password Baru
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-[1.2] tracking-tight">Password Baru, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Awal yang Baru</span>.</h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">Buat password yang kuat dan mudah diingat. Pastikan minimal 6 karakter untuk keamanan akun Anda.</p>
          </div>

          {/* Footer Text */}
          <div className="hidden lg:flex relative z-10 text-slate-500 text-sm items-center gap-4">
            &copy; 2026 jagoCV AI
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <a href="#" className="hover:text-slate-300 transition-colors">Bantuan</a>
          </div>
        </div>

        {/* Right Side: Reset Password Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 w-full lg:w-1/2 flex-1 bg-white dark:bg-[#070B19] relative z-10">
          <div className="w-full max-w-md mx-auto animate-[slideUp_0.5s_ease_forwards]">
            
            {isVerifying ? (
              /* Loading State */
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-slate-600 dark:text-slate-400">Memverifikasi token...</p>
              </div>
            ) : success ? (
              /* Success State */
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">Password Berhasil Diubah! 🎉</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Password Anda telah berhasil diperbarui. Anda akan diarahkan ke halaman login dalam beberapa detik...
                </p>
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg"
                >
                  Login Sekarang
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
            ) : !tokenValid ? (
              /* Invalid Token State */
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">Token Tidak Valid</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {error || 'Link reset password tidak valid atau sudah kadaluarsa. Silakan minta link baru.'}
                </p>
                <div className="flex flex-col gap-3">
                  <Link 
                    to="/forgot-password"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg text-center"
                  >
                    Minta Link Baru
                  </Link>
                  <Link 
                    to="/login"
                    className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all text-center"
                  >
                    Kembali ke Login
                  </Link>
                </div>
              </div>
            ) : (
              /* Form State */
              <>
                <div className="mb-8 text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Buat Password Baru</h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Reset password untuk <strong className="text-slate-900 dark:text-white">{userEmail}</strong>
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 flex items-start gap-2">
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password Baru</label>
                    <div className="relative">
                      <input 
                        required 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        type={showPassword ? "text" : "password"}
                        minLength={6}
                        className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm pr-12" 
                        placeholder="Minimal 6 karakter" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Konfirmasi Password</label>
                    <input 
                      required 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      type={showPassword ? "text" : "password"}
                      minLength={6}
                      className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="Ketik ulang password baru" 
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      disabled={isLoading} 
                      type="submit" 
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memproses...
                        </>
                      ) : (
                        <>
                          Reset Password
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  Ingat password Anda? <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors ml-1">Login sekarang</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
