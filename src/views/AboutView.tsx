import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutView() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1221] animate-[fadeIn_0.5s_ease_forwards]">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Back */}
        <Link
          to="/"
          className="mb-10 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl transition-colors font-semibold w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            Tentang Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
            Kami Membantu Anda{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Tampil Menonjol
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            JagoCV adalah platform AI-powered untuk membuat CV ATS, resume visual, dan portofolio web profesional — semua dalam satu tempat.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Misi Kami',
              desc: 'Memberdayakan setiap pencari kerja Indonesia dengan alat profesional yang sebelumnya hanya tersedia bagi mereka yang mampu membayar desainer mahal.',
              color: 'blue',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Teknologi AI',
              desc: 'Kami menggunakan model bahasa terkini untuk membantu Anda menulis deskripsi yang kuat, mengoptimalkan kata kunci ATS, dan menghasilkan konten yang relevan.',
              color: 'indigo',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              title: 'Tim Kami',
              desc: 'Dibangun oleh tim pengembang dan desainer yang bersemangat tentang karier dan teknologi, dengan pengalaman di industri rekrutmen dan HR.',
              color: 'cyan',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center text-${item.color}-600 dark:text-${item.color}-400 mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white text-center mb-16">
          <h2 className="text-2xl font-bold mb-8">JagoCV dalam Angka</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Pengguna Aktif' },
              { value: '50K+', label: 'CV Dibuat' },
              { value: '95%', label: 'Tingkat Kepuasan' },
              { value: '3 Menit', label: 'Rata-rata Waktu Buat CV' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Siap Memulai?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Bergabunglah dengan ribuan profesional yang sudah menggunakan JagoCV.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30"
            >
              Mulai Gratis
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
            >
              Lihat Harga
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
