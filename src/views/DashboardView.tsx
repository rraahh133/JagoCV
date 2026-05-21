import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { RecentDocument, DOC_TYPE_LABELS } from '../types/enums';

export default function DashboardView() {
  const [documents, setDocuments] = useState<RecentDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ATS_CV' | 'VISUAL_RESUME' | 'WEB_PORTFOLIO'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await api.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;

    try {
      await api.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      alert('Gagal menghapus dokumen');
    }
  };

  const filteredDocs = activeFilter === 'ALL' 
    ? documents 
    : documents.filter(doc => doc.type === activeFilter);

  const getDocLink = (doc: RecentDocument) => {
    const identifier = doc.slug || doc.id;
    switch (doc.type) {
      case 'ATS_CV': return `/cv/result/${identifier}`;
      case 'VISUAL_RESUME': return `/resume/result/${identifier}`;
      case 'WEB_PORTFOLIO': return `/portfolio/result/${identifier}`;
      default: return '/dashboard';
    }
  };

  const getEditLink = (doc: RecentDocument) => {
    switch (doc.type) {
      case 'ATS_CV': return `/cv/build?id=${doc.id}`;
      case 'VISUAL_RESUME': return `/resume/design?id=${doc.id}`;
      case 'WEB_PORTFOLIO': return `/portfolio/build?id=${doc.id}`;
      default: return '/dashboard';
    }
  };
  return (
    <div className="animate-[fadeIn_0.5s_ease_forwards]">
      
      {/* Generator Hero */}
      <header className="mb-14 flex flex-col items-center text-center max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          jagoCV AI Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">Apa yang ingin Anda buat?</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed">Pilih format dokumen di bawah untuk mulai membuat. Masukkan detail Anda sekali, dan biarkan sistem menghasilkan materi berformat sempurna untuk lamaran Anda.</p>
      </header>
      
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. ATS CV Template Card */}
        <article className="bg-white/5 dark:bg-[#0a0f1c]/40 rounded-3xl p-7 flex flex-col group cursor-pointer relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 dark:hover:border-blue-500/50">
          {/* Hover Glow */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="w-14 h-14 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-200/50 dark:border-blue-500/30 mb-6 text-blue-600 dark:text-blue-500 relative z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">CV Optimal ATS</h3>
          <p className="text-[15px] text-slate-600 dark:text-slate-400 mb-8 flex-1 leading-relaxed relative z-10">Dokumen berbasis teks yang semantik dan bersih, dirancang khusus untuk melewati Sistem Pelacakan Pelamar (ATS) di perusahaan teknologi top.</p>
          <div className="flex items-center mt-auto relative z-10 w-full">
            <Link to="/cv/build" className="w-full bg-[#1E5EFF] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all text-sm block text-center">Buat CV ATS</Link>
          </div>
        </article>

        {/* 2. Visual Resume Template Card */}
        <article className="bg-white/5 dark:bg-[#0a0f1c]/40 rounded-3xl p-7 flex flex-col group cursor-pointer relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 dark:hover:border-indigo-500/50">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="w-14 h-14 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-200/50 dark:border-indigo-500/30 mb-6 text-indigo-600 dark:text-indigo-400 relative z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">Resume Visual Modern</h3>
          <p className="text-[15px] text-slate-600 dark:text-slate-400 mb-8 flex-1 leading-relaxed relative z-10">Resume PDF yang diformat indah dengan tata letak modern, tipografi, dan hierarki visual yang jelas untuk perekrut.</p>
          <div className="flex items-center mt-auto relative z-10 w-full">
            <Link to="/resume/design" className="w-full bg-[#1E5EFF] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all text-sm block text-center">Desain Resume</Link>
          </div>
        </article>

        {/* 3. Web Portfolio Card (The Linktree we just made) */}
        <article className="bg-white/5 dark:bg-[#0a0f1c]/40 rounded-3xl p-7 flex flex-col group cursor-pointer relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 dark:hover:border-cyan-500/50">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="w-14 h-14 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-200/50 dark:border-cyan-500/30 mb-6 text-cyan-600 dark:text-cyan-400 relative z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">Portofolio Interaktif</h3>
          <p className="text-[15px] text-slate-600 dark:text-slate-400 mb-8 flex-1 leading-relaxed relative z-10">Dasbor web Bento-grid interaktif yang ramah seluler untuk memamerkan proyek dan bio Anda secara online.</p>
          <div className="flex items-center mt-auto relative z-10 w-full">
            <Link to="/portfolio/build" className="w-full bg-[#1E5EFF] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all text-sm block text-center">Buat Portofolio</Link>
          </div>
        </article>

      </section>

      {/* Recent Dokumens List */}
      {/* Recent Dokumens List */}
      <div className="mt-16 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 relative z-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          Desain Terakhir Anda
        </h2>
        
        {/* Controls: Filters & Toggle */}
        <div className="flex items-center gap-4 hidden sm:flex">
          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-[calc(100vw-48px)] md:w-auto">
            <button 
              onClick={() => setActiveFilter('ALL')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'ALL' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/60 dark:bg-[#0B1221]/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >Semua</button>
            <button 
              onClick={() => setActiveFilter('ATS_CV')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'ATS_CV' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/60 dark:bg-[#0B1221]/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >CV ATS</button>
            <button 
              onClick={() => setActiveFilter('VISUAL_RESUME')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'VISUAL_RESUME' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/60 dark:bg-[#0B1221]/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >Visual Resume</button>
            <button 
              onClick={() => setActiveFilter('WEB_PORTFOLIO')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'WEB_PORTFOLIO' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/60 dark:bg-[#0B1221]/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >Web Portfolio</button>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center bg-white/60 dark:bg-[#0B1221]/60 border border-slate-200 dark:border-slate-800 rounded-full p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Filters */}
        <div className="flex sm:hidden items-center gap-2 overflow-x-auto pb-2 hide-scrollbar w-[calc(100vw-48px)]">
          <button 
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'ALL' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/60 dark:bg-[#0B1221]/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
          >Semua</button>
          <button 
            onClick={() => setActiveFilter('ATS_CV')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'ATS_CV' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/60 dark:bg-[#0B1221]/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
          >CV ATS</button>
          <button 
            onClick={() => setActiveFilter('VISUAL_RESUME')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'VISUAL_RESUME' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/60 dark:bg-[#0B1221]/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
          >Visual Resume</button>
          <button 
            onClick={() => setActiveFilter('WEB_PORTFOLIO')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'WEB_PORTFOLIO' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/60 dark:bg-[#0B1221]/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
          >Web Portfolio</button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-2xl aspect-[3/4]"></div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 relative z-10">
          {/* Create Blank Card */}
          <div 
            onClick={() => navigate('/cv/build')}
            className="group relative bg-[#F8FAFC]/80 dark:bg-[#0a0f1c]/50 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl overflow-hidden aspect-[3/4] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Buat Baru</span>
          </div>

          {filteredDocs.map(doc => (
            <div 
              key={doc.id}
              onClick={() => navigate(getDocLink(doc))}
              className="group relative bg-white dark:bg-[#0a0f1c]/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden aspect-[3/4] flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-blue-500/10 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(getDocLink(doc))}
            >
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-6">
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {doc.type === 'ATS_CV' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                  {doc.type === 'VISUAL_RESUME' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>}
                  {doc.type === 'WEB_PORTFOLIO' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>}
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-[#0a0f1c] border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-1">{doc.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{DOC_TYPE_LABELS[doc.type]}</span>
                  <div className="flex items-center gap-1">
                    <Link 
                      to={getEditLink(doc)}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                      title="Edit Dokumen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </Link>
                    <button 
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Hapus Dokumen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-[#0B1221]/80 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/40 dark:shadow-none relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-800/60">
                <tr>
                  <th className="px-8 py-5 text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Nama Dokumen</th>
                  <th className="px-8 py-5 text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Tipe</th>
                  <th className="px-8 py-5 text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-8 py-5 text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Terakhir Diubah</th>
                  <th className="px-8 py-5 text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredDocs.map(doc => (
                  <tr 
                    key={doc.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer"
                    onClick={() => navigate(getDocLink(doc))}
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          {doc.type === 'ATS_CV' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                          {doc.type === 'VISUAL_RESUME' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>}
                          {doc.type === 'WEB_PORTFOLIO' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-500 dark:text-slate-400">{DOC_TYPE_LABELS[doc.type]}</td>
                    <td className="px-8 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider">{doc.status}</span>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={getEditLink(doc)}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </Link>
                        <button 
                          onClick={(e) => handleDelete(doc.id, e)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Hapus"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && filteredDocs.length === 0 && activeFilter !== 'ALL' && (
        <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Belum ada dokumen {DOC_TYPE_LABELS[activeFilter]}</h3>
          <p className="text-slate-500 dark:text-slate-400">Mulai buat dokumen pertama Anda sekarang.</p>
        </div>
      )}
    </div>
  );
}
