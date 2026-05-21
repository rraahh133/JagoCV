import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutSelection } from './LayoutSelection';
import { useWizard } from '../hooks/useWizard';
import PortfolioViewer from '../components/PortfolioViewer';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { PortfolioData, defaultPortfolioData, createEmptyPortfolioLink, createEmptyPortfolioProject, createEmptyPortfolioExperience } from '../types/portfolio';
import { compressImage } from '../utils/imageCompressor';

export default function BuildPortfolioView() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PortfolioData>(defaultPortfolioData);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        role: prev.role || user.headline || '',
        location: prev.location || user.location || '',
        shortBio: prev.shortBio || user.bio || '',
        profileImageUrl: prev.profileImageUrl || user.profileImageUrl || '',
        username: prev.username || user.email?.split('@')[0] || '',
      }));
    }
  }, [user]);

  const updateField = (field: keyof PortfolioData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImageUrl' | 'bannerImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Batas: 5MB. Jika lebih kecil dari 500KB langsung pakai, jika lebih → auto compress
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ show: true, type: 'error', message: 'File terlalu besar. Maksimal 5MB.' });
        e.target.value = '';
        return;
      }

      const result = await compressImage(file, {
        maxWidth: field === 'bannerImageUrl' ? 1920 : 800,
        maxHeight: field === 'bannerImageUrl' ? 600 : 800,
        targetSizeKB: field === 'bannerImageUrl' ? 400 : 200,
      });

      if (result.wasCompressed) {
        const saved = Math.round(result.originalSizeKB - result.compressedSizeKB);
        setAlert({ show: true, type: 'success', message: `Gambar dikompresi (hemat ${saved}KB)` });
      }

      updateField(field, result.dataUrl);
    } catch {
      setAlert({ show: true, type: 'error', message: 'Gagal memproses gambar. Coba lagi.' });
      e.target.value = '';
    }
  };

  const handleLinkUpdate = (index: number, field: string, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateField('links', newLinks);
  };

  const addLink = () => {
    updateField('links', [...formData.links, createEmptyPortfolioLink()]);
  };

  const removeLink = (index: number) => {
    const newLinks = [...formData.links];
    newLinks.splice(index, 1);
    updateField('links', newLinks);
  };

  const handleProjectUpdate = (index: number, field: string, value: string) => {
    const newProjects = [...formData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    updateField('projects', newProjects);
  };

  const addProject = () => {
    updateField('projects', [...formData.projects, createEmptyPortfolioProject()]);
  };

  const removeProject = (index: number) => {
    const newProjects = [...formData.projects];
    newProjects.splice(index, 1);
    updateField('projects', newProjects);
  };

  const handleExperienceUpdate = (index: number, field: string, value: string) => {
    const newExp = [...formData.experiences];
    newExp[index] = { ...newExp[index], [field]: value };
    updateField('experiences', newExp);
  };

  const addExperience = () => {
    updateField('experiences', [...formData.experiences, createEmptyPortfolioExperience()]);
  };

  const removeExperience = (index: number) => {
    const newExp = [...formData.experiences];
    newExp.splice(index, 1);
    updateField('experiences', newExp);
  };
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiStep, setAiStep] = useState(1);
  const { currentStep, nextStep, prevStep } = useWizard(1, 4);
  const [showLayoutSelection, setShowLayoutSelection] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('BentoGelap');
  const [isSaving, setIsSaving] = useState(false);
  const [doc, setDoc] = useState<any>(null);

  const [notification, setNotification] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });

  const handleSaveProgress = async () => {
    try {
      const payload = {
        title: `${formData.fullName || 'Untitled'} - ${formData.role || 'Untitled'}`,
        type: 'WEB_PORTFOLIO',
        content: formData as any,
        status: doc?.status || 'DRAF',
        templateId: selectedLayout,
        isAiGenerated: isAiMode
      };

      let res;
      if (id) {
        res = await api.updateDocument(id, payload as any);
      } else {
        res = await api.saveDocument(payload as any);
        if (res?.id) {
          setSearchParams({ id: res.id });
        }
      }
      if (res) {
        setDoc(res);
      }
      setNotification({ show: true, type: 'success', message: 'Progress berhasil disimpan!' });
    } catch (err: any) {
      console.error(err);
      setNotification({ show: true, type: 'error', message: err.message || 'Gagal menyimpan progress' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveProgress();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, formData, selectedLayout, isAiMode, doc]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    if (id) {
      const fetchDoc = async () => {
        try {
          const fetchedDoc = await api.getDocument(id);
          if (fetchedDoc) {
            setDoc(fetchedDoc);
            if (fetchedDoc.content) {
              setFormData(fetchedDoc.content);
              if (fetchedDoc.templateId) {
                setSelectedLayout(fetchedDoc.templateId);
              }
            }
          }
        } catch (err) {
          console.error("Gagal memuat dokumen", err);
        }
      };
      fetchDoc();
    }
  }, [id]);

  // Load portfolio templates dynamically from folder names
  const portfolioTemplates = (import.meta as any).glob('../templates/portfolio/*/*.tsx', { eager: true });
  const LAYOUTS = Object.keys(portfolioTemplates).map((path) => {
    // path e.g. "../templates/portfolio/BentoGelap/BentoGelap.tsx"
    const segments = path.split('/');
    const folderName = segments[segments.length - 2]; // Get folder name (e.g. "BentoGelap")
    const id = segments[segments.length - 1].replace('.tsx', ''); // File name without ext
    // Format folderName to label: "BentoGelap" -> "Bento Gelap"
    const label = folderName.replace(/([A-Z])/g, ' $1').trim();
    return {
      value: id,
      label: label,
      desc: `Desain template ${label.toLowerCase()}`
    };
  });

  // Preview scaling
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 24; // padding
      const baseWidth = 1200; // portfolio templates are full-width pages
      setScale(Math.min(containerWidth / baseWidth, 0.5));
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  const handleGeneratePortfolio = async () => {
    setIsSaving(true);
    try {
      const payload = {
        title: `${formData.fullName || 'Portfolio'} - ${formData.role || 'Portfolio'}`,
        type: 'WEB_PORTFOLIO',
        content: formData as any,
        status: 'SELESAI',
        templateId: selectedLayout,
        isAiGenerated: isAiMode
      };

      const res = await api.saveDocument(payload as any);
      if (res?.id) {
        navigate(`/portfolio/result/${res.slug || res.id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setNotification({ show: true, type: 'error', message: err.message || 'Gagal menyimpan portofolio' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease_forwards]">

      {/* Premium Switch Navigation */}
      <div className="flex justify-center mb-12 relative z-50">
        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl flex items-center gap-1 border border-slate-300 dark:border-slate-700 shadow-xl backdrop-blur-md">
          <div className="px-8 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-cyan-600 text-cyan-600 dark:text-white shadow-lg border border-slate-200 dark:border-cyan-500/30 transition-all">
            Editor Portofolio
          </div>
          <button 
            onClick={() => {
              const identifier = doc?.slug || id;
              if (identifier) navigate(`/portfolio/result/${identifier}`);
              else handleGeneratePortfolio();
            }}
            className="px-8 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-white/5"
          >
            Hasil Akhir
          </button>
        </div>
      </div>

      <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white mb-6 transition-colors font-medium text-sm w-fit">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Kembali ke Dasbor
      </Link>

        {/* Builder Header */}
        <header className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-3">Live Web Page</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Buat Web Portofolio Anda</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">Buat landing page portofolio yang indah dan responsif untuk menampilkan proyek, resume, dan media sosial Anda. Deploi langsung ke tautan singkat.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {notification.show && (
              <div className="animate-[fadeIn_0.3s_ease_forwards]">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-md backdrop-blur-md transition-all ${
                  notification.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {notification.type === 'success' ? (
                    <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="text-xs font-bold">{notification.message}</span>
                </div>
              </div>
            )}
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl font-medium text-sm transition-all shadow-sm shrink-0">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              Impor Repositori GitHub
            </button>
          </div>
        </header>

        {/* Stacked Layout on mobile, Two columns on desktop */}
        <div className="flex flex-col lg:flex-row gap-10 items-start w-full">
          
          {/* Left Col: Form Inputs */}
          <div className="w-full lg:w-1/2 space-y-6 flex flex-col">
            
            {/* Kustomisasi Layout & Desain Toggle Button */}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setShowLayoutSelection(!showLayoutSelection)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] cursor-pointer border ${
                  showLayoutSelection 
                    ? 'bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-500/20 active:scale-95' 
                    : 'bg-white dark:bg-[#1A2133] hover:bg-slate-100 dark:hover:bg-[#2A3143] text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50 shadow-sm'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                {showLayoutSelection ? '← Kembali ke Form Input' : 'Pilih Layout & Kustomisasi Gaya'}
              </button>
            </div>

            {showLayoutSelection ? (
              /* PANEL KUSTOMISASI DESAIN LAYOUT (LEFT SIDE) */
              <div className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-[#2A3143] rounded-[24px] p-6 md:p-8 flex flex-col gap-6 shadow-xl dark:shadow-none animate-[fadeIn_0.3s_ease_forwards]">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2A3143] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                      Pilih Template Desain Layout
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pilih desain template portofolio terbaik dan sesuaikan gaya visual Anda</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LAYOUTS.map((layout: any) => {
                    const isSelected = selectedLayout === layout.value;
                    return (
                      <label 
                        key={layout.value}
                        onClick={() => setSelectedLayout(layout.value)} 
                        className={`relative flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${isSelected ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] filter hover:brightness-110' : 'border-slate-300 dark:border-slate-700 hover:border-slate-500 bg-white dark:bg-[#1A2133]'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-14 rounded border flex flex-col gap-1 p-1.5 shrink-0 overflow-hidden ${isSelected ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1221]'}`}>
                            <div className={`w-full h-1/3 rounded-sm ${isSelected ? 'bg-cyan-400' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                            <div className="flex flex-row gap-1 flex-1">
                                <div className={`w-1/2 rounded-sm ${isSelected ? 'bg-cyan-400/50' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                <div className={`w-1/2 rounded-sm ${isSelected ? 'bg-cyan-400/50' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1" title={layout.label}>{layout.label}</p>
                            <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-500'}`}>{layout.desc}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-cyan-500' : 'border-slate-400 dark:border-slate-600'}`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>}
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="border-t border-slate-200 dark:border-[#2A3143] pt-6 mt-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                    Warna Aksen & Keluarga Font
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Warna Aksen Halaman</label>
                      <div className="flex items-center gap-3">
                        <button className="w-8 h-8 rounded-full bg-blue-500 ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-[#0B1221] shadow-sm"></button>
                        <button className="w-8 h-8 rounded-full bg-indigo-500 hover:scale-110 transition-transform shadow-sm"></button>
                        <button className="w-8 h-8 rounded-full bg-rose-500 hover:scale-110 transition-transform shadow-sm"></button>
                        <button className="w-8 h-8 rounded-full bg-emerald-500 hover:scale-110 transition-transform shadow-sm"></button>
                        <button className="w-8 h-8 rounded-full bg-amber-500 hover:scale-110 transition-transform shadow-sm"></button>
                        <button className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-300 border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform shadow-sm"></button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Keluarga Font Tema</label>
                      <div className="relative">
                        <select className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 pr-10 text-sm text-slate-800 dark:text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all appearance-none cursor-pointer">
                          <option value="modern">Modern (Inter, Roboto)</option>
                          <option value="elegant">Elegan (Playfair, Serif)</option>
                          <option value="tech">Teknologi (Mono, Code)</option>
                          <option value="playful">Ceria (Rounded, Pop)</option>
                        </select>
                        <svg className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-[#2A3143]">
                  <button 
                    type="button"
                    onClick={() => setShowLayoutSelection(false)} 
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    Terapkan & Kembali Isi Data
                  </button>
                </div>
              </div>
            ) : (
              <>
            {/* Input Mode Toggle (Portfolio) */}
            <div className="rounded-[16px] p-1.5 border border-slate-200 dark:border-[#2A3143] bg-transparent flex items-center mb-2 bg-white/80 dark:bg-[#0B1221]/80">
              <button onClick={() => setIsAiMode(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${!isAiMode ? 'bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.4)] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white'}`}>Form Manual</button>
              <button onClick={() => setIsAiMode(true)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group ${isAiMode ? 'bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.4)] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white'}`}>
                <svg className={`w-4 h-4 group-hover:animate-pulse ${isAiMode ? 'text-white' : 'text-cyan-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                Arsitek Portofolio AI
              </button>
            </div>

            {/* CONTAINER: MANUAL FORMS (PORTFOLIO) */}
            {!isAiMode && (
              <div className="space-y-6 block animate-[fadeIn_0.3s_ease_forwards]">
            
                                      {/* Wizard Progress Animation */}
            <div id="portfolio-wizard-progress" className="w-full mb-8 pt-4">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full z-0"></div>
                <div id="portfolio-progress-bar" className="absolute left-0 top-5 -translate-y-1/2 h-1.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full z-0 transition-all duration-700 ease-out" style={{width: `${(currentStep - 1) * 33.33}%`}}></div>
                
                <div className={`relative z-10 flex flex-col items-center gap-2 group portfolio-step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${currentStep >= 1 ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-110' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>1</div>
                  <span className={`text-[11px] font-bold mt-1 transition-colors uppercase tracking-wider ${currentStep >= 1 ? 'text-cyan-500' : 'text-slate-400 hidden sm:block'}`}>Profil</span>
                </div>
                <div className={`relative z-10 flex flex-col items-center gap-2 group portfolio-step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${currentStep >= 2 ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-110' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>2</div>
                  <span className={`text-[11px] font-bold mt-1 transition-colors uppercase tracking-wider ${currentStep >= 2 ? 'text-cyan-500' : 'text-slate-400 hidden sm:block'}`}>Tautan</span>
                </div>
                <div className={`relative z-10 flex flex-col items-center gap-2 group portfolio-step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${currentStep >= 3 ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-110' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>3</div>
                  <span className={`text-[11px] font-bold mt-1 transition-colors uppercase tracking-wider ${currentStep >= 3 ? 'text-cyan-500' : 'text-slate-400 hidden sm:block'}`}>Proyek</span>
                </div>
                <div className={`relative z-10 flex flex-col items-center gap-2 group portfolio-step-indicator ${currentStep >= 4 ? 'active' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${currentStep >= 4 ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-110' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>4</div>
                  <span className={`text-[11px] font-bold mt-1 transition-colors uppercase tracking-wider ${currentStep >= 4 ? 'text-cyan-500' : 'text-slate-400 hidden sm:block'}`}>Riwayat</span>
                </div>
              </div>
            </div>
              {/* Profile & Subdomain */}
              {currentStep === 1 && (
              <div className="portfolio-step rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-xs">1</span>
                  Atur Tautan & Identitas
                </h2>
                
                <div className="flex flex-col gap-6 mb-6">
                  {/* Image Uploads */}
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    {/* Photo Upload */}
                    <label className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-[#0B1221]/30 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-cyan-500 cursor-pointer transition-all group shrink-0 relative overflow-hidden">
                      {formData.profileImageUrl ? (
                        <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-slate-400 group-hover:text-cyan-500 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Foto Profil</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" title="Unggah Foto Profil" onChange={(e) => handlePhotoUpload(e, 'profileImageUrl')} />
                    </label>
                    {/* Banner Upload */}
                    <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-[#0B1221]/30 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-cyan-500 cursor-pointer transition-all group relative overflow-hidden">
                      {formData.bannerImageUrl ? (
                        <img src={formData.bannerImageUrl} alt="Banner" className="w-full h-full object-cover opacity-60" />
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-slate-400 group-hover:text-cyan-500 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0V20a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10l4 4v10z"></path></svg>
                          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Gambar Banner (Opsional)</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" title="Unggah Sampul/Banner" onChange={(e) => handlePhotoUpload(e, 'bannerImageUrl')} />
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tautan Kustom Anda *</label>
                      <div className="flex items-center">
                         <span className="bg-white/80 dark:bg-[#0B1221]/80 border border-slate-300 dark:border-slate-700/80 border-r-0 rounded-l-xl px-3 py-3 text-sm text-slate-500 font-medium whitespace-nowrap">jagocv.link/</span>
                         <input type="text" value={formData.username} onChange={e => updateField('username', e.target.value)} placeholder="johndoe" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-slate-700/80 rounded-r-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Lengkap *</label>
                       <input type="text" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="John Doe" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Judul Profil / Peran</label>
                      <input type="text" value={formData.role} onChange={e => updateField('role', e.target.value)} placeholder="John Doe | Developer" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lokasi</label>
                      <input type="text" value={formData.location} onChange={e => updateField('location', e.target.value)} placeholder="Jakarta, Indonesia" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Emoji Aksen</label>
                      <input type="text" value={formData.accentEmoji} onChange={e => updateField('accentEmoji', e.target.value)} placeholder="🚀" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bio Singkat (Slogan)</label>
                    <textarea rows={2} value={formData.shortBio} onChange={e => updateField('shortBio', e.target.value)} placeholder="Membangun aplikasi web keren dan mempelajari AI..." className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"></textarea>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tentang Saya (Lengkap)</label>
                    <textarea rows={4} value={formData.aboutMe} onChange={e => updateField('aboutMe', e.target.value)} placeholder="Ceritakan lebih detail tentang perjalanan karir Anda, passion, dan apa yang sedang Anda cari..." className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>
                <div className="flex justify-end mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50"><button type="button" onClick={nextStep} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 active:scale-95">Selanjutnya <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button></div>
              </div>
              )}

              {/* Links & Digital Real Estate */}
              {currentStep === 2 && (
              <div className="portfolio-step rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent mt-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-xs">2</span>
                    Tautan Penting
                  </h2>
                  <button onClick={addLink} className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 bg-cyan-100 dark:bg-cyan-900/20 hover:bg-cyan-200 dark:hover:bg-cyan-900/40 px-2.5 py-1.5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Tautan
                  </button>
                </div>
                
                <div className="space-y-3">
                   {formData.links.map((link, index) => (
                     <div key={link.id} className="flex items-center gap-3 bg-white dark:bg-transparent border border-slate-300/50 dark:border-slate-700/50 rounded-xl p-3 relative group">
                        <div className="cursor-move text-slate-500 hover:text-slate-300 px-1 shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg></div>
                        <input type="text" value={link.title} onChange={e => handleLinkUpdate(index, 'title', e.target.value)} placeholder="Judul (contoh: GitHub)" className="w-1/3 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none" />
                        <input type="url" value={link.url} onChange={e => handleLinkUpdate(index, 'url', e.target.value)} placeholder="URL (https://...)" className="flex-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-600 outline-none" />
                        <button onClick={() => removeLink(index)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors" title="Hapus Tautan"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                     </div>
                   ))}
                   {formData.links.length === 0 && (
                     <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-sm">
                       Belum ada tautan. Tambahkan tautan ke profil GitHub, LinkedIn, atau sosmed Anda.
                     </div>
                   )}
                </div>
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50"><button type="button" onClick={prevStep} className="bg-white dark:bg-[#1A2133] hover:bg-slate-200 dark:hover:bg-[#1A2133] text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Sebelumnya</button><button type="button" onClick={nextStep} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 active:scale-95">Selanjutnya <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button></div>
              </div>
              )}

              {/* Proyek Unggulan */}
              {currentStep === 3 && (
              <div className="portfolio-step rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent mt-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-xs">3</span>
                    Proyek Unggulan
                  </h2>
                  <button onClick={addProject} className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 bg-cyan-100 dark:bg-cyan-900/20 hover:bg-cyan-200 dark:hover:bg-cyan-900/40 px-2.5 py-1.5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Proyek
                  </button>
                </div>
                
                <div className="space-y-4">
                   {formData.projects.map((project, index) => (
                     <div key={project.id} className="bg-slate-50 dark:bg-[#0B1221]/40 border border-slate-300/50 dark:border-slate-700/50 rounded-2xl p-4 relative group">
                        <button onClick={() => removeProject(index)} className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        <div className="flex flex-col gap-4">
                           <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-500 cursor-pointer transition-colors shrink-0 overflow-hidden relative">
                                 {project.imageUrl ? (
                                   <img src={project.imageUrl} alt="Project" className="w-full h-full object-cover" />
                                 ) : (
                                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                 )}
                                 <input type="file" accept="image/*" onChange={async (e) => {
                                   const file = e.target.files?.[0];
                                   if (!file) return;
                                   try {
                                     const result = await compressImage(file, { maxWidth: 800, maxHeight: 600, targetSizeKB: 300 });
                                     handleProjectUpdate(index, 'imageUrl', result.dataUrl);
                                   } catch {
                                     setAlert({ show: true, type: 'error', message: 'Gagal memproses gambar proyek.' });
                                   }
                                 }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" title="Unggah Gambar Proyek" />
                              </div>
                              <div className="flex-1 space-y-3">
                                 <input type="text" value={project.title} onChange={e => handleProjectUpdate(index, 'title', e.target.value)} placeholder="Nama Proyek (misal: Taskify App)" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none" />
                                 <input type="url" value={project.url} onChange={e => handleProjectUpdate(index, 'url', e.target.value)} placeholder="Tautan Proyek (opsional)" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none" />
                              </div>
                           </div>
                           <textarea rows={2} value={project.description} onChange={e => handleProjectUpdate(index, 'description', e.target.value)} placeholder="Deskripsi singkat proyek Anda..." className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none resize-none"></textarea>
                         </div>
                      </div>
                   ))}
                   {formData.projects.length === 0 && (
                     <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-sm">
                       Belum ada proyek. Tambahkan proyek unggulan Anda untuk menarik perhatian.
                     </div>
                   )}
                 </div>
                 <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50"><button type="button" onClick={prevStep} className="bg-white dark:bg-[#1A2133] hover:bg-slate-200 dark:hover:bg-[#1A2133] text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Sebelumnya</button><button type="button" onClick={nextStep} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 active:scale-95">Selanjutnya <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button></div>
              </div>
              )}

              {/* Pengalaman & Edukasi Terperinci */}
              {currentStep === 4 && (
              <div className="portfolio-step rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent mt-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-xs">4</span>
                    Pengalaman & Edukasi Terperinci
                  </h2>
                  <button onClick={addExperience} className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 bg-cyan-100 dark:bg-cyan-900/20 hover:bg-cyan-200 dark:hover:bg-cyan-900/40 px-2.5 py-1.5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Riwayat
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                   {formData.experiences.map((exp, index) => (
                     <div key={exp.id} className="bg-slate-50 dark:bg-[#0B1221]/40 border border-slate-300/50 dark:border-slate-700/50 rounded-2xl p-4 relative group">
                        <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pt-2">
                           <input type="text" value={exp.role} onChange={e => handleExperienceUpdate(index, 'role', e.target.value)} placeholder="Posisi / Gelar" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none" />
                           <input type="text" value={exp.company} onChange={e => handleExperienceUpdate(index, 'company', e.target.value)} placeholder="Perusahaan / Institusi" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none" />
                           <input type="text" value={exp.years} onChange={e => handleExperienceUpdate(index, 'years', e.target.value)} placeholder="Tahun (misal: 2022 - Sekarang)" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none sm:col-span-2" />
                        </div>
                        <textarea rows={2} value={exp.description} onChange={e => handleExperienceUpdate(index, 'description', e.target.value)} placeholder="Deskripsi peran atau pencapaian..." className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none resize-none"></textarea>
                     </div>
                   ))}
                   {formData.experiences.length === 0 && (
                     <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-sm">
                       Belum ada riwayat. Tambahkan pengalaman kerja atau edukasi Anda.
                     </div>
                   )}
                </div>

                <div className="space-y-1.5 border-t border-slate-200 dark:border-slate-700/50 pt-5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Keterampilan Utama (Pisahkan dengan koma)</label>
                  <input type="text" value={formData.skills} onChange={e => updateField('skills', e.target.value)} placeholder="React, Node.js, Problem Solving, Public Speaking" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                </div>
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50">
                  <button type="button" onClick={prevStep} className="bg-white dark:bg-[#1A2133] hover:bg-slate-200 dark:hover:bg-[#1A2133] text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Sebelumnya
                  </button>
                  <button onClick={handleGeneratePortfolio} disabled={isSaving} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSaving ? 'Menyimpan...' : (
                      <>
                        <svg className="w-5 h-5 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        Selesaikan & Lihat Hasil
                      </>
                    )}
                  </button>
                </div>
              </div>
              )}

            </div>
            )} {/* END CONTAINER: MANUAL FORMS (PORTFOLIO) */}

            {/* CONTAINER: AI MAGIC STORY (PORTFOLIO) */}
            {isAiMode && (
            <div className="animate-[fadeIn_0.3s_ease_forwards]">
              <div className="rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent border border-cyan-500/30 relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-[40px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 mb-6 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0 shadow-inner">
                      <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">
                        Kisah Ajaib AI: Buat Showcase Anda 🚀
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Tuliskan tautan proyek terbaik Anda, username GitHub, hobi, dan deskripsi singkat. Biar AI yang menyusun strukturnya menjadi halaman portofolio interaktif yang memukau.</p>
                   </div>
                </div>
                
                {aiStep === 1 && (
                <div className="animate-[fadeIn_0.3s_ease_forwards]">
                  <textarea rows={14} placeholder="Misal: Saya ingin username @johndoe. Saya seorang fullstack dev. Sertakan tombol ke github saya: github.com/johndoe. Saya ingin menyoroti dua side-project: 1) 'Taskify' react todo app di taskify.app dan 2) 'API Fetcher' tool cli nodejs. Buat bio saya terdengar seru dan ramah." className="w-full bg-white/80 dark:bg-[#0B1221]/80 border border-cyan-500/50 rounded-2xl p-5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none resize-none transition-all relative z-10 shadow-inner"></textarea>
                  
                  <div className="mt-5 flex flex-wrap justify-between items-center gap-3 relative z-10">
                     <div className="flex flex-wrap gap-2 items-center">
                       <span className="text-xs text-slate-500 font-medium py-2">Coba contoh:</span>
                       <button className="px-3.5 py-1.5 rounded-xl bg-cyan-900/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-900/50 border border-cyan-700/30 transition-colors">Indie Hacker</button>
                       <button className="px-3.5 py-1.5 rounded-xl bg-cyan-900/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-900/50 border border-cyan-700/30 transition-colors">Creative Coder</button>
                     </div>
                     <button onClick={() => setAiStep(2)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95">
                        Selanjutnya
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                     </button>
                  </div>
                </div>
                )}
                
                {aiStep === 2 && (
                  <div className="animate-[fadeIn_0.3s_ease_forwards] flex flex-col gap-6">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/50 pb-4">
                      <button onClick={() => setAiStep(1)} className="bg-slate-100 dark:bg-[#1A2133] hover:bg-slate-200 dark:hover:bg-[#2A3143] text-slate-700 dark:text-slate-300 px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95 text-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Kembali</button>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Layout Options</h3>
                    </div>
                    <LayoutSelection theme="cyan" stepNumber={5} />
                    <div className="flex items-center gap-3 justify-end mt-2">
                       <button onClick={handleGeneratePortfolio} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 group">
                          Buat AI Portfolio
                          <svg className="w-5 h-5 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )} {/* END CONTAINER: AI MAGIC STORY (PORTFOLIO) */}
            </>
            )}


          </div> {/* END Left Col */}
          
          {/* Right Col: Live Preview */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-6 flex flex-col gap-4 pb-10">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   Pratinjau Live
                </h3>
                <div className="flex items-center gap-2">
                   <span className="px-2.5 py-1.5 bg-green-150 text-green-700 dark:bg-green-500/20 dark:text-green-400 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                     Auto-Sync
                   </span>
                </div>
             </div>
             
             {/* Document Container */}
             <div 
               ref={containerRef}
               className="bg-slate-100 dark:bg-[#070B19]/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2 md:p-3 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col items-center w-full overflow-hidden"
             >
               {/* Live Preview Wrapper - height auto-scales based on content */}
               <div 
                 className="w-full flex justify-center items-start overflow-hidden relative"
               >
                 <div 
                   ref={(el) => {
                     if (el) {
                       // Use ResizeObserver to dynamically track content height
                       const observer = new ResizeObserver(() => {
                         const contentHeight = el.scrollHeight;
                         const parent = el.parentElement;
                         if (parent) {
                           parent.style.height = `${contentHeight * scale}px`;
                         }
                       });
                       observer.observe(el);
                       // Cleanup on unmount handled by React
                       (el as any).__resizeObserver = observer;
                     }
                   }}
                   className="origin-top transition-transform duration-200 ease-out absolute"
                   style={{ 
                     transform: `scale(${scale})`,
                     width: '1200px',
                     minWidth: '1200px',
                   }}
                 >
                   <PortfolioViewer templateId={selectedLayout} data={formData} />
                 </div>
               </div>
             </div>
          </div>

        </div>

      </div>
  );
}

