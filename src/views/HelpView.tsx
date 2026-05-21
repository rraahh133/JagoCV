import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ_DATA = [
  {
    question: 'Bagaimana cara mengunduh CV sebagai PDF?',
    answer: 'Setelah Anda selesai mengisi form atau membuat CV secara otomatis dengan AI, Anda akan diarahkan ke halaman pratinjau. Di bagian atas kanan profil pratinjau Anda, klik tombol "Unduh PDF" untuk menyimpannya ke perangkat Anda.',
    keywords: ['unduh', 'download', 'pdf', 'simpan', 'ekspor', 'export'],
  },
  {
    question: 'Apakah data saya aman jika menggunakan fitur AI?',
    answer: 'Ya. Data yang Anda masukkan diproses oleh AI solely untuk membangun struktur profil dan paragraf deskripsi Anda. Kami tidak menyimpan atau melatih model data dari file cv/resume pribadi yang Anda kirim ke sistem.',
    keywords: ['aman', 'privasi', 'data', 'ai', 'keamanan', 'rahasia'],
  },
  {
    question: 'Perbedaan Layout ATS dan Kreatif?',
    answer: 'Layout ATS dirancang khusus minimalis agar mudah dibaca oleh software perekrutan bot, sangat cocok untuk melamar di perusahaan korporat besar. Layout kreatif menonjolkan estetika desain (seperti foto dan icon), lebih cocok untuk profil presentasi atau melamar kerja industri kreatif/startup.',
    keywords: ['ats', 'kreatif', 'layout', 'template', 'perbedaan', 'beda'],
  },
  {
    question: 'Bagaimana cara membuat portofolio web?',
    answer: 'Klik "Buat Portofolio" di dashboard, isi data profil, tautan, proyek, dan pengalaman Anda di setiap step, lalu klik "Selesaikan & Lihat Hasil" untuk mempublikasikan portofolio Anda.',
    keywords: ['portofolio', 'portfolio', 'web', 'buat', 'cara'],
  },
  {
    question: 'Bagaimana cara mengubah template atau desain resume?',
    answer: 'Di halaman Resume Designer, klik tombol "Pilih Layout & Kustomisasi Gaya" di bagian kiri. Anda bisa memilih template, mengubah font, warna sidebar, dan gaya teks perusahaan secara real-time.',
    keywords: ['template', 'desain', 'ganti', 'ubah', 'layout', 'warna', 'font'],
  },
  {
    question: 'Apakah bisa mengedit CV yang sudah dibuat?',
    answer: 'Ya. Buka Dashboard, temukan dokumen yang ingin diedit, klik ikon pensil (edit) di pojok kanan bawah kartu dokumen. Anda akan diarahkan kembali ke editor dengan data yang sudah tersimpan.',
    keywords: ['edit', 'ubah', 'revisi', 'update', 'perbarui'],
  },
  {
    question: 'Bagaimana cara upgrade ke paket berbayar?',
    answer: 'Kunjungi halaman Pricing melalui menu profil atau klik "Lihat Harga". Pilih paket Go atau Ultra sesuai kebutuhan Anda, lalu ikuti proses pembayaran.',
    keywords: ['upgrade', 'bayar', 'paket', 'go', 'ultra', 'premium', 'harga', 'pricing'],
  },
];

export default function HelpView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = searchQuery.trim()
    ? FAQ_DATA.filter((faq) => {
        const q = searchQuery.toLowerCase();
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          faq.keywords.some((k) => k.includes(q))
        );
      })
    : FAQ_DATA;

  return (
    <div className="animate-[fadeIn_0.5s_ease_forwards]">
      <div className="max-w-3xl mx-auto mt-10">
          <Link to="/profile" className="mb-6 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white px-3 py-2 rounded-xl transition-colors font-semibold w-fit">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Kembali
          </Link>
          
          <div className="bg-white dark:bg-[#0B1221] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
             
             {/* Header */}
             <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-900/50">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pusat Bantuan</h2>
                <p className="text-sm text-slate-500 mt-1">FAQ dan panduan cepat jagoCV.</p>
                
                <div className="mt-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-[#0B1221] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
                      placeholder="Cari masalah (misal, cara unduh pdf)..."
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    )}
                </div>
             </div>
             
             {/* Body */}
             <div className="p-8 space-y-8">
                
                {/* FAQ List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {searchQuery ? `Hasil Pencarian "${searchQuery}" (${filteredFaqs.length} ditemukan)` : 'FAQ Populer'}
                    </h3>
                    
                    {filteredFaqs.length > 0 ? (
                      <div className="space-y-3">
                        {filteredFaqs.map((faq, index) => (
                          <details key={index} className="group border border-slate-200 dark:border-slate-700/50 rounded-xl bg-slate-50 dark:bg-slate-800/30 open:bg-white dark:open:bg-[#0B1221] transition-colors">
                              <summary className="flex cursor-pointer items-center justify-between p-4 font-semibold text-slate-900 dark:text-white text-sm">
                                  <span>{faq.question}</span>
                                  <span className="transition group-open:rotate-180 shrink-0 ml-3">
                                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" className="w-5 h-5 text-slate-400"><path d="M6 9l6 6 6-6"></path></svg>
                                  </span>
                              </summary>
                              <div className="p-4 pt-0 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 mt-2">
                                  {faq.answer}
                              </div>
                          </details>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <svg className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <p className="font-medium">Tidak ada hasil untuk "{searchQuery}"</p>
                        <p className="text-sm mt-1">Coba kata kunci lain atau hubungi tim kami.</p>
                      </div>
                    )}
                </div>
                
                {/* Contact Sub */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800/50 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center shrink-0">
                        <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div className="text-center sm:text-left">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">Masih Butuh Bantuan?</h4>
                        <p className="text-sm text-slate-600 dark:text-indigo-200/80 mt-1 mb-3">Tim dukungan kami siap membalas dalam waktu kurang dari 24 jam di hari kerja.</p>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/30">Hubungi Kami via Email</button>
                    </div>
                </div>

             </div>
          </div>
        </div>
    </div>
  );
}
