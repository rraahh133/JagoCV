import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginView() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed', err);
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
            <Link to="/" className="hidden sm:flex items-center gap-2 text-white/80 hover:text-white transition-all hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5 hover:border-white/20 text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Kembali
            </Link>
            <Link to="/" className="sm:hidden flex items-center justify-center text-white/80 hover:text-white transition-all hover:bg-white/10 w-10 h-10 rounded-xl backdrop-blur-md border border-white/5 hover:border-white/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
          </div>

          {/* Content Message */}
          <div className="relative z-10 max-w-lg my-12 lg:mt-auto lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Selamat Datang Kembali
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-[1.2] tracking-tight">Terus Raih <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Karier Impianmu</span>.</h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">Masuk ke akunmu untuk memoles CV, mengelola portofolio, dan temukan kesempatan emas selanjutnya bersama jagoCV.</p>
          </div>

          {/* Footer Text */}
          <div className="hidden lg:flex relative z-10 text-slate-500 text-sm items-center gap-4">
            &copy; 2026 jagoCV AI
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <a href="#" className="hover:text-slate-300 transition-colors">Bantuan</a>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 w-full lg:w-1/2 flex-1 bg-white dark:bg-[#070B19] relative z-10">
          <div className="w-full max-w-md mx-auto animate-[slideUp_0.5s_ease_forwards]">
            <div className="mb-8 text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Masuk ke Akun</h2>
              <p className="text-slate-500 dark:text-slate-400">Senang melihat Anda kembali!</p>
            </div>

            {/* Login Wrapper */}
            <div className="space-y-6">
              {/* Google login — hidden for now */}
              {/* <button id="btn-login-google" ... >Lanjutkan dengan Google</button> */}

              {/* Divider — hidden while Google login is disabled */}
              {/* <div className="relative flex items-center py-2">...</div> */}

              <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">{error}</div>}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" placeholder="nama@email.com" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                    {/* Forgot password — hidden for now */}
                    {/* <Link to="/forgot-password" ...>Lupa?</Link> */}
                  </div>
                  <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" placeholder="••••••••" />
                </div>
                
                <div className="pt-2">
                  <button disabled={isLoading} type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-[1px] disabled:opacity-50">
                    {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                Belum punya akun? <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors ml-1">Daftar sekarang</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
