import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterView() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName) return;
    
    try {
      await register({ name: `${firstName} ${lastName}`.trim(), email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Register failed', err);
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
          <div className="relative z-10 max-w-lg my-12 lg:mt-auto lg:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Buat Akun Gratis
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-[1.2] tracking-tight">Satu akun me-roket-kan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">peluang karir.</span></h3>
            
            <div className="grid gap-3 sm:gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex items-center gap-4 transition-transform hover:-translate-y-1 hover:bg-white/10">
                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 items-center justify-center shrink-0 border border-blue-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base mb-0.5">Maksimal Score ATS</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Template CV ramah mesin ATS perekrut.</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex items-center gap-4 transition-transform hover:-translate-y-1 hover:bg-white/10">
                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 items-center justify-center shrink-0 border border-indigo-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base mb-0.5">Penulisan AI</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Asisten penyusun profil sekejap.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="hidden lg:flex relative z-10 text-slate-500 text-sm items-center gap-4 mt-8">
            &copy; 2026 jagoCV AI
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <a href="#" className="hover:text-slate-300 transition-colors">Syarat Pemakaian</a>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 w-full lg:w-1/2 flex-1 bg-white dark:bg-[#070B19] relative z-10">
          <div className="w-full max-w-md mx-auto animate-[slideUp_0.5s_ease_forwards]">
            <div className="mb-8 text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Buat Akun Anda</h2>
              <p className="text-slate-500 dark:text-slate-400">Mulai bangun masa depan sekarang.</p>
            </div>

            {/* Form Wrapper */}
            <div className="space-y-6">
              {/* Google login removed - using email-only registration */}

              <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">{error}</div>}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Depan</label>
                    <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" placeholder="Budi" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Belakang</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" placeholder="S." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" placeholder="nama@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <input 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-3.5 pr-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="Minimal 8 karakter" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button disabled={isLoading} type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all hover:-translate-y-[1px] shadow-lg shadow-blue-500/25 disabled:opacity-50">
                    {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
                
                <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed">
                  Dengan mendaftar, Anda menyetujui <button type="button" onClick={() => setShowTermsModal(true)} className="underline hover:text-slate-800 dark:hover:text-slate-300 transition-colors font-medium">Syarat & Ketentuan</button>.
                </p>
              </form>

              <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                Sudah punya akun? <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors ml-1">Masuk di sini</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease_out]"
          onClick={() => setShowTermsModal(false)}
        >
          <div 
            className="bg-white dark:bg-[#0B1221] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 animate-[slideUp_0.3s_ease_out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Syarat & Ketentuan</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-slate-700 dark:text-slate-300">
              <div className="space-y-5 text-sm leading-relaxed">
                <p className="text-xs text-slate-500 dark:text-slate-400">Terakhir diperbarui: 21 Mei 2026</p>
                
                <section className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">1. Penerimaan Syarat</h3>
                  <p>Dengan mengakses dan menggunakan layanan jagoCV, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan layanan kami.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">2. Penggunaan Layanan</h3>
                  <p>Layanan jagoCV menyediakan platform untuk membuat CV, resume, dan portofolio profesional. Anda bertanggung jawab atas:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Keakuratan informasi yang Anda berikan</li>
                    <li>Keamanan akun dan kata sandi Anda</li>
                    <li>Semua aktivitas yang terjadi di bawah akun Anda</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">3. Privasi Data</h3>
                  <p>Kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Data yang Anda berikan akan digunakan untuk:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Menyediakan dan meningkatkan layanan kami</li>
                    <li>Berkomunikasi dengan Anda tentang layanan</li>
                    <li>Memproses permintaan dan transaksi Anda</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">4. Hak Kekayaan Intelektual</h3>
                  <p>Konten yang Anda buat menggunakan jagoCV tetap menjadi milik Anda. Namun, template, desain, dan teknologi yang kami sediakan adalah milik jagoCV dan dilindungi oleh hak cipta.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">5. Pembatasan Tanggung Jawab</h3>
                  <p>jagoCV tidak bertanggung jawab atas:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Kerugian yang timbul dari penggunaan layanan</li>
                    <li>Gangguan atau kesalahan teknis</li>
                    <li>Kehilangan data atau konten</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">6. Perubahan Syarat</h3>
                  <p>Kami berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah dipublikasikan di platform kami.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">7. Kontak</h3>
                  <p>Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami melalui email atau formulir kontak yang tersedia di platform.</p>
                </section>
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex items-center justify-end gap-3 p-5 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all text-sm shadow-lg hover:shadow-xl active:scale-95"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
