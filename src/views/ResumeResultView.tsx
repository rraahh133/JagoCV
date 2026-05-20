import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { exportToPdf, exportToPng } from '../utils/export';
import ResumeViewer from '../components/ResumeViewer';

export default function ResumeResultView() {
  const { idOrSlug } = useParams();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="p-20 text-center">Memuat dokumen...</div>;
  if (error || !doc) return <div className="p-20 text-center text-red-500">{error || 'Dokumen tidak ditemukan'}</div>;

  return (
    <div className="animate-[fadeIn_0.5s_ease_forwards]">
      
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
          <Link to={`/resume/design?id=${doc?.id || idOrSlug}`} className="px-8 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-white/5">
            Editor Resume
          </Link>
          <div className="px-8 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-lg border border-slate-200 dark:border-indigo-500/30 transition-all">
            Hasil Akhir
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">
          
          <div className="flex items-center gap-3">
             <button 
                onClick={() => exportToPng('resume-document-container', `Resume_${doc?.title || 'Document'}`)}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2 group"
             >
                <svg className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0V20a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10l4 4v10z"></path></svg>
                Download PNG
             </button>
             <button 
                onClick={() => exportToPdf('resume-document-container', `Resume_${doc?.title || 'Document'}`)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 group"
             >
                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download PDF
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
          {/* Left Col: Document */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-center overflow-x-auto py-2 hide-scrollbar">
              <div 
                id="resume-document-container"
                className="bg-white shadow-2xl relative w-[794px] rounded-xl shrink-0"
                style={{ 
                  width: '794px', 
                  minWidth: '794px', 
                  height: 'auto',
                  minHeight: '1123px',
                  fontFamily: doc.fontFamily || 'Inter' 
                }}
              >
                <ResumeViewer templateId={doc.templateId || 'a4-react-resume'} data={doc.content} fontFamily={doc.fontFamily || 'Inter'} />
              </div>
            </div>
          </div>
        </div>

    </div>
  );
}
