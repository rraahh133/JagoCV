import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { CvFormData } from '../types/document';
import { exportToPdf, exportToPng } from '../utils/export';
import ResumeViewer from '../components/ResumeViewer';
import { mapCvToResumeData } from '../utils/mapCvToResumeData';

export default function CvResultView() {
  const { idOrSlug } = useParams();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) {
      setError('ID Dokumen tidak ditemukan');
      setLoading(false);
      return;
    }

    const fetchDoc = async () => {
      try {
        const data = await api.getDocument(idOrSlug);
        setDoc(data);
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil data dokumen');
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [idOrSlug]);

  if (!loading && (error || !doc)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{error || 'Dokumen tidak ditemukan'}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Pastikan link yang Anda gunakan benar atau dokumen tidak dihapus.</p>
          <Link to="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const content = (doc?.content as CvFormData) || { 
    fullName: '', 
    email: '', 
    phone: '', 
    linkedin: '', 
    targetRole: '',
    location: '',
    portfolio: '',
    summary: '', 
    experiences: [], 
    educations: [], 
    skills: '' 
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease_forwards] max-w-6xl mx-auto px-4 py-8">
      {/* Dashboard Link */}
      <div className="mb-4">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white transition-colors font-medium text-sm px-3 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Dashboard
        </Link>
      </div>

      {/* Premium Switch Navigation */}
      <div className="flex justify-center mb-12 relative z-50">
        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl flex items-center gap-1 border border-slate-300 dark:border-slate-700 shadow-xl backdrop-blur-md">
          <Link to={`/cv/build?id=${doc?.id || idOrSlug}`} className="px-8 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-white/5">
            Editor CV
          </Link>
          <div className="px-8 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-lg border border-slate-200 dark:border-blue-500/30 transition-all">
            Hasil Akhir
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Hasil Final CV Anda</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Dokumen telah dioptimalkan untuk sistem ATS. Silakan tinjau sebelum mengunduh.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => {
              exportToPng('cv-document-container', `CV_${content.fullName.replace(/\s+/g, '_')}`);
            }}
            className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0V20a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10l4 4v10z"></path></svg>
            Unduh PNG
          </button>
          <button 
            onClick={() => {
              exportToPdf('cv-document-container', `CV_${content.fullName.replace(/\s+/g, '_')}`);
            }}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Unduh PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full relative">
        {/* Left Col: Document Area */}
        <div className="w-full flex flex-col items-center relative min-h-[800px]">
          <div className="w-full overflow-x-auto py-2 hide-scrollbar flex justify-center">
            <div 
              id="cv-document-container"
              className="bg-white shadow-2xl relative w-[794px] rounded-xl shrink-0"
              style={{ 
                width: '794px', 
                minWidth: '794px', 
                height: 'auto',
                minHeight: '1123px',
                fontFamily: doc?.fontFamily || 'Inter' 
              }}
            >
              {/* Live CV Viewer */}
              <ResumeViewer 
                templateId={doc?.templateId || 'AtsCompact'} 
                data={mapCvToResumeData(content, false)} 
                fontFamily={doc?.fontFamily || 'Inter'} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
