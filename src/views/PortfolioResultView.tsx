import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { exportPortfolioToZip } from '../utils/export';
import PortfolioViewer from '../components/PortfolioViewer';

const WA_NUMBER = '62895412194060';
const WA_NAME   = 'Salman Ridwan';

export default function PortfolioResultView() {
  const { idOrSlug } = useParams();
  const [doc, setDoc]         = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // UI state
  const [isZipping, setIsZipping]         = useState(false);
  const [showHostingModal, setShowHostingModal] = useState(false);

  useEffect(() => {
    if (!idOrSlug) return;
    const fetchDoc = async () => {
      try {
        const data = await api.getDocument(idOrSlug);
        setDoc(data);
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [idOrSlug]);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const title = doc?.title || doc?.content?.fullName || 'Portfolio';
      const templateId = doc?.templateId || 'BentoGelap';
      await exportPortfolioToZip(
        'portfolio-document-container',
        `Portfolio_${title.replace(/\s+/g, '_')}`,
        title,
        templateId
      );
      // Success feedback (optional - download will start automatically)
    } catch (err: any) {
      console.error('Export failed:', err);
      alert('Gagal mengekspor portfolio. Silakan coba lagi.');
    } finally {
      setIsZipping(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Memuat dokumen...</div>;
  if (error || !doc) return (
    <div className="p-20 text-center text-red-500">{error || 'Dokumen tidak ditemukan'}</div>
  );

  return (
    <div className="animate-[fadeIn_0.5s_ease_forwards]">

      {/* Dashboard Link */}
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white transition-colors font-medium text-sm px-3 py-2 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Dashboard
        </Link>
      </div>

      {/* Premium Switch Navigation */}
      <div className="flex justify-center mb-8 relative z-50">
        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl flex items-center gap-1 border border-slate-300 dark:border-slate-700 shadow-xl backdrop-blur-md">
          <Link
            to={`/portfolio/build?id=${doc?.id || idOrSlug}`}
            className="px-8 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-white/5"
          >
            Editor Portofolio
          </Link>
          <div className="px-8 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-cyan-600 text-cyan-600 dark:text-white shadow-lg border border-slate-200 dark:border-cyan-500/30 transition-all">
            Hasil Akhir
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
        {/* Download ZIP */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold border border-slate-300 dark:border-slate-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {isZipping ? (
            <svg className="w-4 h-4 animate-spin text-cyan-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          {isZipping ? 'Menyiapkan ZIP...' : 'Download ZIP'}
        </button>

        {/* Hosting */}
        <button
          onClick={() => setShowHostingModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/30 transition-all group"
        >
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          Hosting Portofolio
        </button>
      </div>

      {/* Portfolio Preview */}
      <div
        id="portfolio-document-container"
        className="w-full min-h-[80vh] relative shadow-lg rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-500 ease-in-out bg-slate-900"
      >
        <PortfolioViewer templateId={doc?.templateId || 'BentoGelap'} data={doc?.content} />
      </div>

      {/* ── Hosting Modal ── */}
      {showHostingModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease_forwards]"
          onClick={(e) => { if (e.target === e.currentTarget) setShowHostingModal(false); }}
        >
          <div className="relative w-full max-w-md bg-white dark:bg-[#0F1729] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-[fadeIn_0.25s_ease_forwards]">

            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-500" />

            {/* Close button */}
            <button
              onClick={() => setShowHostingModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Hosting Portofolio Anda
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Untuk mempublikasikan portofolio Anda ke internet dengan domain dan hosting profesional, hubungi Admin JagoAI kami. Kami siap membantu proses deployment Anda.
              </p>

              {/* Contact card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white font-black text-lg">S</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{WA_NAME}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Admin JagoAI</p>
                  <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">+{WA_NUMBER}</p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo Kak ${WA_NAME}, saya ingin hosting portofolio saya dari JagoCV. Bisa dibantu?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm transition-all shadow-lg shadow-green-500/25 active:scale-[0.98]"
                >
                  {/* WhatsApp icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat WhatsApp Sekarang
                </a>

                <button
                  onClick={() => setShowHostingModal(false)}
                  className="w-full py-3 rounded-2xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
