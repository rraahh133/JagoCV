import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOKEN_KEY } from '../config';

export default function PricingView() {
  const navigate = useNavigate();

  const handleUpgrade = (plan: 'go' | 'ultra') => {
    // Arahkan ke halaman register jika belum login, atau tampilkan info
    // Untuk saat ini arahkan ke register/dashboard sebagai placeholder payment flow
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // User sudah login — tampilkan notifikasi (payment gateway belum terintegrasi)
      alert(`Fitur pembayaran untuk paket ${plan === 'go' ? 'Go' : 'Ultra'} sedang dalam pengembangan. Silakan hubungi tim kami untuk informasi lebih lanjut.`);
    } else {
      navigate('/register');
    }
  };
  return (
    <div className="animate-[fadeIn_0.5s_ease_forwards]">
      <div className="max-w-6xl mx-auto mt-6">
          {/* Back button */}
          <Link to="/profile" className="mb-10 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white px-3 py-2 rounded-xl transition-colors font-semibold w-fit">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Kembali ke Profil
          </Link>
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Langkah Tepat Menuju<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Karier Impian</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Pilih paket yang paling pas untukmu. Bebaskan potensi AI dan bersiaplah memikat hati rekruter di mana saja.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto md:items-center items-start">
            {/* Plan 1: Starter / Free */}
            <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all flex flex-col h-full transform hover:-translate-y-1">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Biasa</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Gratis selamanya, cocok bagi yang baru memulai.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">Rp 0</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">/bulan</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Buat hingga 2 CV</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm text-slate-700 dark:text-slate-300">1 Web Portfolio (Tema Standar)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Akses AI Teks (Terbatas)</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <svg className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Ekspor Multi-Format PDF/DOCX</span>
                </li>
              </ul>
              <button className="w-full py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/50 cursor-default mt-auto">Paket Anda Saat Ini</button>
            </div>

            {/* Plan 2: Go */}
            <div className="relative z-10 md:scale-[1.12] transform transition-all h-full group py-4 md:py-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-[2.8rem] blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="bg-gradient-to-b from-slate-900 to-[#0f172a] dark:from-[#0f172a] dark:to-[#1e293b] rounded-[2.5rem] p-10 py-12 border border-blue-500/50 shadow-2xl relative flex flex-col h-full">
                <div className="absolute top-0 inset-x-0 flex justify-center -mt-3.5">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wider border border-blue-400 shadow-lg shadow-blue-500/50">Paling Populer</div>
                </div>
                <div className="mb-6 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-md shadow-blue-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Go</h3>
                <p className="text-sm text-slate-300">Buka potensi penuh untuk memaksimalkan peluang.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">Rp 49K</span>
                <span className="text-blue-200 font-medium">/bulan</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-sm text-slate-200">Buat CV Tak Terbatas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-sm text-slate-200">Semua Tema Web Portfolio (Termasuk Premium Animasi)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-sm text-slate-200">Akses Penuh Fitur AI (Cover Letter, Perbaikan Teks, Analisis CV)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-sm text-slate-200">Unduh PDF Kualitas Tinggi tanpa Watermark</span>
                </li>
              </ul>
              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all mt-auto transform hover:-translate-y-0.5" onClick={() => handleUpgrade('go')}>Pilih Go</button>
            </div>
            </div>

            {/* Plan 3: Lifetime / Enterprise */}
            <div className="bg-gradient-to-br from-slate-900 via-[#1e293b] to-slate-900 dark:from-[#0f1115] dark:via-[#1a1c23] dark:to-[#0f1115] rounded-[2.5rem] p-8 border border-amber-500/40 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col h-full transform hover:-translate-y-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ultra</h3>
                <p className="text-sm text-slate-300">Bayar sekali, nikmati semua fitur unggulan selamanya.</p>
              </div>
              <div className="mb-8 relative z-10">
                <span className="text-4xl font-extrabold text-white">Rp 299K</span>
                <span className="text-amber-500/80 font-medium">/sekali bayar</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 relative z-10">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm text-slate-200">Semua Fitur Go Tanpa Batas Waktu</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm text-slate-200">Akses Terdahulu ke Tema & Template Baru</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm text-slate-200">Dukungan Prioritas 24/7 (WhatsApp & Email)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm text-slate-200">Custom Subdomain (opsi link personalisasi)</span>
                </li>
              </ul>
              <button className="relative z-10 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg hover:shadow-amber-500/40 transition-all mt-auto transform hover:-translate-y-0.5 border-none" onClick={() => handleUpgrade('ultra')}>Pilih Ultra</button>
            </div>
            
          </div>
        </div>
    </div>
  );
}
