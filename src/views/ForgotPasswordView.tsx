import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      await api.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
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
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          
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
            <Link to="/login" className="sm:hidden flex items-center justify-center text-white/80 hover:text-white transition-all hover:bg-white/10 w-10 h-10 rounded-xl backdrop-blur-md border border-white/5 hover:border-white/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
          </div>

          {/* Content Message */}
          <div className="relative z-10 max-w-lg my-12 lg:mt-auto lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Reset Password
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-[1.2] tracking-tight">Lupa Password? <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Tidak Masalah</span>.</h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">Masukkan email Anda dan kami akan mengirimkan link untuk mereset password. Proses ini aman dan cepat.</p>
          </div>

          {/* Footer Text */}
          <div className="hidden lg:flex relative z-10 text-slate-500 text-sm items-center gap-4">
            &copy; 2026 jagoCV AI
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <a href="#" className="hover:text-slate-300 transition-colors">Bantuan</a>
          </div>
        </div>

        {/* Right Side: Forgot Password Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 w-full lg:w-1/2 flex-1 bg-white dark:bg-[#070B19] relative z-10">
          <div className="w-full max-w-md mx-auto animate-[slideUp_0.5s_ease_forwards]">
            
            {success ? (
              /* Success State */
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">Email Terkirim! 📧</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Kami telah mengirimkan link reset password ke <strong className="text-slate-900 dark:text-white">{email}</strong>. 
                  Silakan cek inbox atau folder spam Anda.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>💡 Tips:</strong> Link hanya berlaku selama 1 jam. Jika tidak menerima email dalam 5 menit, coba kirim ulang.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => { setSuccess(false); setEmail(''); }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg"
                  >
                    Kirim Ulang Email
                  </button>
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Lupa Password?</h2>
                  <p className="text-slate-500 dark:text-slate-400">Masukkan email Anda untuk menerima link reset password</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 flex items-start gap-2">
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      type="email" 
                      className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="nama@email.com" 
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      disabled={isLoading} 
                      type="submit" 
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim Link Reset Password
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
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
