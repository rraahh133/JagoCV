import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutSelection } from './LayoutSelection';
import { useWizard } from '../hooks/useWizard';
import ResumeViewer from '../components/ResumeViewer';
import { ResumeData } from '../types/resume.types';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

const emptyResumeData: ResumeData = {
  profile: {
    name: "",
    headline: "",
    image: "",
    summary: "",
    contact: {
      email: "",
      phone: "",
      website: "",
      location: ""
    },
    skills: {
      Technical: [],
      Soft: []
    },
    languages: [],
    interests: []
  },
  experience: [],
  education: [],
  projects: [],
  design: {
    entityStyle: {
      isBold: true,
      color: '#4F46E5', // Indigo 600
      hasBadge: false,
      badgeBgColor: '#E0E7FF',
      badgeTextColor: '#4F46E5',
      badgeBorderRadius: '4px'
    }
  }
};

// Dynamically import all templates in the resume-templates folder to scan their metadata
const templates = (import.meta as any).glob('../templates/resume/*.tsx', { eager: true });

const LAYOUTS_LIST = Object.entries(templates).map(([path, module]: any) => {
  const id = path.split('/').pop()?.replace('.tsx', '') || '';
  return {
    id,
    name: module.metadata?.name || id,
    desc: module.metadata?.desc || 'Desain layout resume premium.'
  };
});

const FONTS_LIST = [
  { id: 'Inter', name: 'Inter', desc: 'Modern & Sangat Bersih' },
  { id: 'Georgia', name: 'Georgia', desc: 'Elegan, Klasik & Profesional' },
  { id: 'Roboto', name: 'Roboto', desc: 'Netral, Terstruktur & Rapi' },
  { id: 'Playfair Display', name: 'Playfair', desc: 'Kreatif, Mewah & Berani' }
];

export default function DesignResumeView() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [isSaving, setIsSaving] = useState(false);
  const [doc, setDoc] = useState<any>(null);
  const { user } = useAuth();


  const [isAiMode, setIsAiMode] = useState(false);
  const [aiStep, setAiStep] = useState(1);
  const { currentStep, nextStep, prevStep, goToStep } = useWizard(1, 4);
  const [templateId, setTemplateId] = useState<string>('ModernMinimalis');
  const [fontFamily, setFontFamily] = useState<string>('Inter');
  const [showLayoutSelection, setShowLayoutSelection] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
  const [techSkillInput, setTechSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  // Modal States
  const [showExitModal, setShowExitModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [initialStateStr, setInitialStateStr] = useState('');

  useEffect(() => {
    if (initialStateStr === '') {
      if (id && doc) {
        setInitialStateStr(JSON.stringify({ data: resumeData, templateId, fontFamily }));
      } else if (!id && resumeData.profile.name !== '') {
        setInitialStateStr(JSON.stringify({ data: resumeData, templateId, fontFamily }));
      }
    }
  }, [id, doc, resumeData, templateId, fontFamily, initialStateStr]);

  const handleBack = () => {
    const currentState = JSON.stringify({ data: resumeData, templateId, fontFamily });
    if (currentState === initialStateStr || initialStateStr === '') {
      navigate('/dashboard');
    } else {
      setShowExitModal(true);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        // A4 width is 794px. We leave some padding (e.g. 48px total, 24px each side)
        const calculatedScale = (containerWidth - 48) / 794;
        setScale(Math.max(0.2, Math.min(1.2, calculatedScale)));
      }
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Load existing document data if editing
  useEffect(() => {
    if (id) {
      const fetchDoc = async () => {
        try {
          const data = await api.getDocument(id);
          setDoc(data);
          if (data) {
            if (data.content) {
              setResumeData(data.content as ResumeData);
            }
            if (data.templateId) {
              setTemplateId(data.templateId);
            }
            if (data.fontFamily) {
              setFontFamily(data.fontFamily);
            }
          }
        } catch (err) {
          console.error("Gagal memuat dokumen:", err);
        }
      };
      fetchDoc();
    }
  }, [id]);

  useEffect(() => {
    if (user && !id) {
      setResumeData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          name: user.name || "",
          headline: user.headline || "",
          image: user.profileImageUrl || "",
          summary: user.bio || "",
          contact: {
            ...prev.profile.contact,
            email: user.email || "",
            phone: user.phones?.[0]?.number || "",
            website: user.socialLinks?.[0]?.url || "",
            location: user.location || ""
          }
        },
        experience: user.experience?.map(e => ({
          title: e.position,
          company: e.company,
          period: `${new Date(e.startDate).getFullYear()} - ${e.endDate ? new Date(e.endDate).getFullYear() : 'Sekarang'}`,
          tasks: e.description ? [e.description] : []
        })) || [],
        education: user.education?.map(e => ({
          degree: e.degree,
          campus: e.institution,
          year: `${new Date(e.startDate).getFullYear()} - ${e.endDate ? new Date(e.endDate).getFullYear() : 'Sekarang'}`,
          gpa: ""
        })) || [],
      }));
    }
  }, [user, id]);

  const handleProfileChange = (field: keyof ResumeData['profile'], value: string) => {
    setResumeData(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };

  const handleEntityStyleChange = (field: keyof NonNullable<ResumeData['design']>['entityStyle'], value: boolean | string) => {
    setResumeData(prev => ({
      ...prev,
      design: {
        ...prev.design,
        entityStyle: {
          ...(prev.design?.entityStyle || { isBold: true, color: '#4F46E5', hasBadge: false }),
          [field]: value
        }
      }
    }));
  };

  const handleThemeChange = (field: keyof NonNullable<ResumeData['design']>['theme'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      design: {
        ...prev.design,
        theme: {
          ...(prev.design?.theme || { sidebarBg: '#2563EB', sidebarText: '#FFFFFF', accent: '#4F46E5' }),
          [field]: value
        }
      }
    }));
  };

  const handleContactChange = (field: keyof ResumeData['profile']['contact'], value: string) => {
    setResumeData(prev => ({ ...prev, profile: { ...prev.profile, contact: { ...prev.profile.contact, [field]: value } } }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfileChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({ ...prev, experience: [...(prev.experience || []), { title: '', company: '', period: '', tasks: [] }] }));
  };
  const handleUpdateExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => {
      const newExp = [...(prev.experience || [])];
      newExp[index] = { ...newExp[index], [field]: field === 'tasks' ? value.split('\n') : value };
      return { ...prev, experience: newExp };
    });
  };
  const handleRemoveExperience = (index: number) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience?.filter((_, i) => i !== index) }));
  };

  const handleAddEducation = () => {
    setResumeData(prev => ({ ...prev, education: [...(prev.education || []), { degree: '', campus: '', year: '', gpa: '' }] }));
  };
  const handleUpdateEducation = (index: number, field: string, value: string) => {
    setResumeData(prev => {
      const newEdu = [...(prev.education || [])];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };
  const handleRemoveEducation = (index: number) => {
    setResumeData(prev => ({ ...prev, education: prev.education?.filter((_, i) => i !== index) }));
  };

  const handleAddProject = () => {
    setResumeData(prev => ({ ...prev, projects: [...(prev.projects || []), { name: '', url: '', description: '', techStack: [] }] }));
  };
  const handleUpdateProject = (index: number, field: string, value: string) => {
    setResumeData(prev => {
      const newProj = [...(prev.projects || [])];
      newProj[index] = { ...newProj[index], [field]: field === 'techStack' ? value.split(',').map(s => s.trim()) : value };
      return { ...prev, projects: newProj };
    });
  };
  const handleRemoveProject = (index: number) => {
    setResumeData(prev => ({ ...prev, projects: prev.projects?.filter((_, i) => i !== index) }));
  };

  const handleAddTechSkill = () => {
    if (techSkillInput.trim()) {
      const trimmed = techSkillInput.trim();
      const currentSkills = resumeData.profile.skills?.Technical || [];
      if (!currentSkills.includes(trimmed)) {
        setResumeData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            skills: {
              ...prev.profile.skills,
              Technical: [...currentSkills, trimmed]
            }
          }
        }));
      }
      setTechSkillInput("");
    }
  };

  const handleRemoveTechSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: {
          ...prev.profile.skills,
          Technical: (prev.profile.skills?.Technical || []).filter(s => s !== skillToRemove)
        }
      }
    }));
  };

  const handleAddSoftSkill = () => {
    if (softSkillInput.trim()) {
      const trimmed = softSkillInput.trim();
      const currentSkills = resumeData.profile.skills?.Soft || [];
      if (!currentSkills.includes(trimmed)) {
        setResumeData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            skills: {
              ...prev.profile.skills,
              Soft: [...currentSkills, trimmed]
            }
          }
        }));
      }
      setSoftSkillInput("");
    }
  };

  const handleRemoveSoftSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: {
          ...prev.profile.skills,
          Soft: (prev.profile.skills?.Soft || []).filter(s => s !== skillToRemove)
        }
      }
    }));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim()) {
      const trimmed = languageInput.trim();
      const currentList = resumeData.profile.languages || [];
      if (!currentList.includes(trimmed)) {
        setResumeData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            languages: [...currentList, trimmed]
          }
        }));
      }
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (valToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        languages: (prev.profile.languages || []).filter(s => s !== valToRemove)
      }
    }));
  };

  const handleAddInterest = () => {
    if (interestInput.trim()) {
      const trimmed = interestInput.trim();
      const currentList = resumeData.profile.interests || [];
      if (!currentList.includes(trimmed)) {
        setResumeData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            interests: [...currentList, trimmed]
          }
        }));
      }
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (valToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        interests: (prev.profile.interests || []).filter(s => s !== valToRemove)
      }
    }));
  };

  const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });

  const handleSaveProgress = async () => {
    try {
      const payload = {
        title: `${resumeData.profile.name || 'Untitled'} - ${resumeData.profile.headline || 'Untitled'}`,
        type: 'VISUAL_RESUME',
        content: resumeData as any,
        status: doc?.status || 'DRAF',
        templateId,
        fontFamily,
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
      setAlert({ show: true, type: 'success', message: 'Progress berhasil disimpan!' });
    } catch (err: any) {
      console.error(err);
      setAlert({ show: true, type: 'error', message: err.message || 'Gagal menyimpan progress' });
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
  }, [id, resumeData, templateId, fontFamily, isAiMode, doc]);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const handleSaveDocument = async (status: 'SELESAI' | 'DRAF' = 'SELESAI') => {
    setIsSaving(true);
    try {
      const payload = {
        title: `${resumeData.profile.name || 'Resume'} - ${resumeData.profile.headline || 'Resume'}`,
        type: 'VISUAL_RESUME',
        content: resumeData as any,
        status,
        templateId,
        fontFamily,
        isAiGenerated: isAiMode
      };

      if (id) {
        const res = await api.updateDocument(id, payload as any);
        if (status === 'SELESAI') {
          navigate(`/resume/result/${res?.slug || id}`);
        } else {
          navigate('/dashboard');
        }
      } else {
        const res = await api.saveDocument(payload as any);
        if (status === 'SELESAI' && res?.id) {
          navigate(`/resume/result/${res?.slug || res.id}`);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal menyimpan resume');
    } finally {
      setIsSaving(false);
    }
  };

  const mockAtsProjects = [
    {
      id: "ats-1",
      title: "CV ATS - Software Engineer",
      date: "12 Mei 2026",
      data: {
        profile: {
          name: "Budi Santoso",
          headline: "Senior Software Engineer",
          summary: "Seorang Software Engineer dengan lebih dari 5 tahun pengalaman dalam membangun aplikasi web skala besar.",
          contact: { email: "budi.s@example.com", phone: "08123456789", location: "Jakarta, Indonesia", website: "github.com/budis" },
          skills: { "Teknis": ["React", "TypeScript", "Node.js"] },
          languages: ["Indonesia", "Inggris"],
          interests: ["Coding", "Membaca"]
        },
        experience: [
          { title: "Frontend Developer", company: "Tech Indo", period: "2021 - Sekarang", tasks: ["Membangun antarmuka modern", "Optimasi performa"] }
        ],
        education: [
          { degree: "S1 Teknik Informatika", campus: "Universitas Indonesia", year: "2017 - 2021", gpa: "3.85" }
        ],
        projects: []
      }
    },
    {
      id: "ats-2",
      title: "CV ATS - Product Manager",
      date: "10 Mei 2026",
      data: {
        profile: {
          name: "Siti Aminah",
          headline: "Product Manager",
          summary: "Berpengalaman mengelola siklus produk dari konsep hingga peluncuran.",
          contact: { email: "siti.a@example.com", phone: "08987654321", location: "Bandung, Indonesia", website: "linkedin.com/in/sitia" },
          skills: { "Manajemen": ["Scrum", "Agile", "Jira"] },
          languages: ["Indonesia", "Inggris"],
          interests: ["Menulis", "Traveling"]
        },
        experience: [
          { title: "Product Owner", company: "Startup Maju", period: "2022 - 2026", tasks: ["Mengelola backlog", "Komunikasi dengan stakeholder"] }
        ],
        education: [
          { degree: "S1 Sistem Informasi", campus: "Institut Teknologi Bandung", year: "2018 - 2022", gpa: "3.90" }
        ],
        projects: []
      }
    }
  ];

  const handleSelectAtsImport = (project: any) => {
    setResumeData((prev) => ({
      ...prev,
      ...project.data,
      profile: {
        ...prev.profile,
        ...project.data.profile,
      }
    }));
    setShowImportModal(false);
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease_forwards]">
      
      {/* Premium Switch Navigation */}
      <div className="flex justify-center mb-12 relative z-50">
        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl flex items-center gap-1 border border-slate-300 dark:border-slate-700 shadow-xl backdrop-blur-md">
          <div className="px-8 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-lg border border-slate-200 dark:border-indigo-500/30 transition-all">
            Editor Resume
          </div>
          <button 
            onClick={() => {
              const identifier = doc?.slug || id;
              if (identifier) navigate(`/resume/result/${identifier}`);
              else handleSaveDocument('SELESAI');
            }}
            className="px-8 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-white/5"
          >
            Hasil Akhir
          </button>
        </div>
      </div>

      <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white mb-6 transition-colors font-medium text-sm w-fit px-3 py-1.5 rounded-lg -ml-3">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Kembali ke Dasbor
      </button>

        {/* Builder Header */}
        <header className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-3">Visual Dokumen</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Desain Resume Visual Anda</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">Buat resume PDF yang memukau dan tertata indah untuk memikat rekruter. Tampil menonjol dengan tipografi, warna, dan tata letak modern.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {alert.show && (
              <div className="animate-[fadeIn_0.3s_ease_forwards]">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-md backdrop-blur-md transition-all ${
                  alert.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {alert.type === 'success' ? (
                    <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="text-xs font-bold">{alert.message}</span>
                </div>
              </div>
            )}
            <button onClick={() => setShowImportModal(true)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl font-medium text-sm transition-all shadow-sm shrink-0">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Impor Data ATS
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
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'bg-white dark:bg-[#1A2133] hover:bg-slate-100 dark:hover:bg-[#2A3143] text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50 shadow-sm'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                {showLayoutSelection ? '← Kembali ke Form Input' : 'Pilih Layout & Kustomisasi Gaya'}
              </button>
            </div>

            {showLayoutSelection ? (
              /* PANEL KUSTOMISASI DESAIN LAYOUT (LEFT SIDE) */
              <div 
                className="w-full bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 overflow-y-auto hide-scrollbar flex flex-col gap-6 shadow-xl shadow-slate-100/50 dark:shadow-none animate-[fadeIn_0.3s_ease_forwards]"
              >
                <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                  <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    Pilih Template Desain Layout
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Pilih dari koleksi layout premium kami. Perubahan layout resume Anda akan ter-render secara instan di pratinjau live sebelah kanan.
                  </p>
                </div>

                {/* Grid Layouts */}
                <div className="grid grid-cols-1 gap-3">
                  {LAYOUTS_LIST.map((layout) => {
                    const isActive = templateId === layout.id;
                    return (
                      <div
                        key={layout.id}
                        onClick={() => setTemplateId(layout.id)}
                        className={`relative flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] ${
                          isActive
                            ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-500/10 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Mini Layout Icon */}
                          <div className={`w-8 h-11 rounded border flex flex-col gap-1 p-1 overflow-hidden shrink-0 transition-colors ${
                            isActive ? 'bg-indigo-500/20 border-indigo-400 text-indigo-400' : 'bg-slate-100 dark:bg-slate-850 border-slate-300 dark:border-slate-850 text-slate-450'
                          }`}>
                            <div className="w-2/3 h-0.5 bg-current opacity-60 rounded-sm mx-auto"></div>
                            <div className="w-1/2 h-[0.5px] bg-current opacity-40 rounded-sm mx-auto"></div>
                            <div className="w-full h-[0.5px] bg-current opacity-25 rounded-sm mt-0.5"></div>
                            <div className="w-4/5 h-[0.5px] bg-current opacity-25 rounded-sm"></div>
                            <div className="w-full h-[0.5px] bg-current opacity-25 rounded-sm"></div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">{layout.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed pr-2">{layout.desc}</p>
                          </div>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isActive ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 dark:border-slate-700'
                        }`}>
                          {isActive && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Font Chooser */}
                <div className="border-t border-slate-150 dark:border-slate-800/60 pt-5 mt-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    Pilih Tipografi Font
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {FONTS_LIST.map((font) => {
                      const isActive = fontFamily === font.id;
                      return (
                        <div
                          key={font.id}
                          onClick={() => setFontFamily(font.id)}
                          className={`flex flex-col items-center p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] ${
                            isActive
                              ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-500/10 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-transparent'
                          }`}
                        >
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white mb-0.5" style={{ fontFamily: font.id }}>
                            Aa
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{font.name}</span>
                          <span className="text-[9px] text-slate-400 mt-0.5">{font.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Entity Style Chooser */}
                <div className="border-t border-slate-150 dark:border-slate-800/60 pt-5 mt-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                    Gaya Teks Perusahaan & Kampus
                  </h4>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="sr-only" checked={resumeData.design?.entityStyle?.isBold ?? true} onChange={(e) => handleEntityStyleChange('isBold', e.target.checked)} />
                        <div className={`w-10 h-5.5 rounded-full transition-colors ${resumeData.design?.entityStyle?.isBold !== false ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        <div className={`absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform ${resumeData.design?.entityStyle?.isBold !== false ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Tebalkan Teks (Bold)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="sr-only" checked={resumeData.design?.entityStyle?.hasBadge ?? false} onChange={(e) => handleEntityStyleChange('hasBadge', e.target.checked)} />
                        <div className={`w-10 h-5.5 rounded-full transition-colors ${resumeData.design?.entityStyle?.hasBadge ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        <div className={`absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform ${resumeData.design?.entityStyle?.hasBadge ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Gaya Lencana (Badge)</span>
                    </label>

                    {(resumeData.design?.entityStyle?.hasBadge) && (
                      <div className="pl-6 border-l-2 border-indigo-500/30 flex flex-col gap-3 py-1.5 animate-[fadeIn_0.2s_ease_forwards]">
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 min-w-[125px]">Latar Lencana:</label>
                          <input type="color" value={resumeData.design?.entityStyle?.badgeBgColor || '#E0E7FF'} onChange={(e) => handleEntityStyleChange('badgeBgColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none shadow-sm" />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 min-w-[125px]">Teks Lencana:</label>
                          <input type="color" value={resumeData.design?.entityStyle?.badgeTextColor || '#4F46E5'} onChange={(e) => handleEntityStyleChange('badgeTextColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none shadow-sm" />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 min-w-[125px]">Kelengkungan Sudut:</label>
                          <select 
                            value={resumeData.design?.entityStyle?.badgeBorderRadius || '4px'} 
                            onChange={(e) => handleEntityStyleChange('badgeBorderRadius', e.target.value)}
                            className="bg-white dark:bg-[#1A2133] border border-slate-350 dark:border-[#2A3143] rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 outline-none transition-all cursor-pointer"
                          >
                            <option value="0px">Siku (None)</option>
                            <option value="4px">Bulat Tipis (Rounded)</option>
                            <option value="8px">Medium (MD)</option>
                            <option value="9999px">Lonjong (Full)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Warna Teks Kampus/Perusahaan:</label>
                      <input type="color" value={resumeData.design?.entityStyle?.color || '#4F46E5'} onChange={(e) => handleEntityStyleChange('color', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Tema Keseluruhan */}
                <div className="border-t border-slate-150 dark:border-slate-800/60 pt-5 mt-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                    Kustomisasi Warna Tema Resume
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 min-w-[120px]">Latar Utama/Sidebar:</label>
                      <input type="color" value={resumeData.design?.theme?.sidebarBg || '#2563EB'} onChange={(e) => handleThemeChange('sidebarBg', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none shadow-sm" />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 min-w-[120px]">Warna Aksen:</label>
                      <input type="color" value={resumeData.design?.theme?.accent || '#4F46E5'} onChange={(e) => handleThemeChange('accent', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none shadow-sm" />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 min-w-[120px]">Teks Utama/Sidebar:</label>
                      <input type="color" value={resumeData.design?.theme?.sidebarText || '#FFFFFF'} onChange={(e) => handleThemeChange('sidebarText', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => setShowLayoutSelection(false)}
                  className="w-full mt-auto py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                >
                  Terapkan & Kembali Isi Data
                </button>
              </div>
            ) : (
              <>
                {/* Input Mode Toggle (Resume) */}
                <div className="rounded-[16px] p-1.5 border border-slate-200 dark:border-[#2A3143] bg-transparent flex items-center mb-2 bg-white/80 dark:bg-[#0B1221]/80">
                  <button onClick={() => setIsAiMode(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${!isAiMode ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white'}`}>Form Manual</button>
                  <button onClick={() => setIsAiMode(true)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group ${isAiMode ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white'}`}>
                    <svg className={`w-4 h-4 group-hover:animate-pulse ${isAiMode ? 'text-white' : 'text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    Arsitek Desain AI
                  </button>
                </div>

            {/* CONTAINER: MANUAL FORMS (RESUME) */}
            {!isAiMode && (
              <div className="space-y-6 block animate-[fadeIn_0.3s_ease_forwards]">
            
                        {/* Wizard Progress Animation */}
            <div id="resume-wizard-progress" className="w-full mb-8 pt-4">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full z-0"></div>
                <div id="resume-progress-bar" className={`absolute left-0 top-5 -translate-y-1/2 h-1.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-full z-0 transition-all duration-700 ease-out`} style={{width: `${(currentStep - 1) * 33.33}%`}}></div>
                
                <div className={`relative z-10 flex flex-col items-center gap-2 group resume-step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${currentStep >= 1 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>1</div>
                  <span className={`text-[11px] font-bold mt-1 transition-colors uppercase tracking-wider ${currentStep >= 1 ? 'text-indigo-500' : 'text-slate-400 hidden sm:block'}`}>Profil</span>
                </div>
                <div className={`relative z-10 flex flex-col items-center gap-2 group resume-step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${currentStep >= 2 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>2</div>
                  <span className={`text-[11px] font-bold mt-1 transition-colors uppercase tracking-wider ${currentStep >= 2 ? 'text-indigo-500' : 'text-slate-400 hidden sm:block'}`}>Keterampilan</span>
                </div>
                <div className={`relative z-10 flex flex-col items-center gap-2 group resume-step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${currentStep >= 3 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>3</div>
                  <span className={`text-[11px] font-bold mt-1 transition-colors uppercase tracking-wider ${currentStep >= 3 ? 'text-indigo-500' : 'text-slate-400 hidden sm:block'}`}>Riwayat</span>
                </div>
                <div className={`relative z-10 flex flex-col items-center gap-2 group resume-step-indicator ${currentStep >= 4 ? 'active' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${currentStep >= 4 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>4</div>
                  <span className={`text-[11px] font-bold mt-1 transition-colors uppercase tracking-wider ${currentStep >= 4 ? 'text-indigo-500' : 'text-slate-400 hidden sm:block'}`}>Selesai</span>
                </div>
              </div>
            </div>
            {/* Personal Info & Photo */}
            {currentStep === 1 && (
            <div className="resume-step block rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs">1</span>
                Info Profil
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Photo Upload */}
                <label className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-slate-400 dark:border-slate-600 bg-white dark:bg-[#1A2133] hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-500 cursor-pointer transition-all group shrink-0 relative overflow-hidden">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" title="Unggah Foto" />
                  {resumeData.profile.image ? (
                    <img src={resumeData.profile.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Unggah Foto</span>
                    </>
                  )}
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Tampilan *</label>
                    <input type="text" value={resumeData.profile.name} onChange={e => handleProfileChange('name', e.target.value)} placeholder="John Doe" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Headline / Peran *</label>
                    <input type="text" value={resumeData.profile.headline} onChange={e => handleProfileChange('headline', e.target.value)} placeholder="Creative Frontend Engineer" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Website Portofolio / Linktree</label>
                    <input type="url" value={resumeData.profile.contact.website} onChange={e => handleContactChange('website', e.target.value)} placeholder="https://johndoe.com" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alamat Email</label>
                  <input type="email" value={resumeData.profile.contact.email} onChange={e => handleContactChange('email', e.target.value)} placeholder="john@example.com" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nomor Telepon</label>
                  <input type="tel" value={resumeData.profile.contact.phone} onChange={e => handleContactChange('phone', e.target.value)} placeholder="+62 812 3456 7890" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lokasi / Remote</label>
                  <input type="text" value={resumeData.profile.contact.location} onChange={e => handleContactChange('location', e.target.value)} placeholder="Jakarta, ID (Remote)" className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tentang Saya (Bio)</label>
                <textarea rows={3} value={resumeData.profile.summary} onChange={e => handleProfileChange('summary', e.target.value)} placeholder="Tulis bio singkat yang menarik sesuai kepribadian karir Anda..." className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"></textarea>
              </div>
              <div className="flex justify-end mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50"><button type="button" onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 active:scale-95">Selanjutnya <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button></div>
            </div>
            )}

            {/* Skills & Visual Elements */}
            {currentStep === 2 && (
            <div className="resume-step rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs">2</span>
                Keterampilan & Kekuatan
              </h2>
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Keahlian Teknis Utama</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={techSkillInput} 
                      onChange={e => setTechSkillInput(e.target.value)} 
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTechSkill();
                        }
                      }}
                      placeholder="Masukkan keahlian (misal: React, TypeScript, Figma, UI/UX) lalu tekan Enter" 
                      className="flex-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                    />
                    <button 
                      type="button" 
                      onClick={handleAddTechSkill} 
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      Tambah
                    </button>
                  </div>
                  
                  {/* Skill Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(resumeData.profile.skills?.Technical || []).map(skill => (
                      <span 
                        key={skill} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 animate-fade-in"
                      >
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTechSkill(skill)} 
                          className="hover:bg-indigo-200 dark:hover:bg-indigo-500/25 p-0.5 rounded-full transition-colors inline-flex items-center justify-center shrink-0 w-4 h-4"
                          title="Hapus Keahlian"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </span>
                    ))}
                    {(resumeData.profile.skills?.Technical || []).length === 0 && (
                      <span className="text-xs text-slate-500 italic mt-1">Belum ada keahlian teknis yang ditambahkan.</span>
                    )}
                  </div>
                </div>
                
                <div className="border border-slate-200 dark:border-[#2A3143] rounded-[16px] p-5 bg-transparent space-y-3">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Soft Skills</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={softSkillInput} 
                      onChange={e => setSoftSkillInput(e.target.value)} 
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSoftSkill();
                        }
                      }}
                      placeholder="Masukkan soft skill (misal: Komunikasi, Kerja Sama, Kepemimpinan) lalu tekan Enter" 
                      className="flex-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                    />
                    <button 
                      type="button" 
                      onClick={handleAddSoftSkill} 
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      Tambah
                    </button>
                  </div>
                  
                  {/* Soft Skill Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(resumeData.profile.skills?.Soft || []).map(skill => (
                      <span 
                        key={skill} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 animate-fade-in"
                      >
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSoftSkill(skill)} 
                          className="hover:bg-indigo-200 dark:hover:bg-indigo-500/25 p-0.5 rounded-full transition-colors inline-flex items-center justify-center shrink-0 w-4 h-4"
                          title="Hapus Soft Skill"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </span>
                    ))}
                    {(resumeData.profile.skills?.Soft || []).length === 0 && (
                      <span className="text-xs text-slate-500 italic mt-1">Belum ada soft skill yang ditambahkan.</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50"><button type="button" onClick={prevStep} className="bg-white dark:bg-[#1A2133] hover:bg-slate-200 dark:hover:bg-[#1A2133] text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Sebelumnya</button><button type="button" onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 active:scale-95">Selanjutnya <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button></div>
            </div>
            )}

            {/* Experience & Pendidikan (Visual Resume) */}
            {currentStep === 3 && (
            <div className="resume-step rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs">3</span>
                Pengalaman & Pendidikan
              </h2>
              
              {/* Pengalaman Kerja */}
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Riwayat Pekerjaan</h3>
                  <button type="button" onClick={handleAddExperience} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/20 hover:bg-indigo-200 dark:hover:bg-indigo-900/40 px-2.5 py-1.5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Pekerjaan
                  </button>
                </div>
                {/* Job Entries */}
                {(resumeData.experience || []).map((exp, idx) => {
                  const [startVal, endVal] = exp.period ? exp.period.split(' - ') : ['', ''];
                  const isPresent = endVal === 'Sekarang';

                  const handleStartChange = (val: string) => {
                    const newPeriod = `${val} - ${endVal || ''}`;
                    handleUpdateExperience(idx, 'period', newPeriod);
                  };
                  const handleEndChange = (val: string) => {
                    const newPeriod = `${startVal || ''} - ${val}`;
                    handleUpdateExperience(idx, 'period', newPeriod);
                  };
                  const handlePresentToggle = () => {
                    const newPeriod = isPresent 
                      ? `${startVal || ''} - ` 
                      : `${startVal || ''} - Sekarang`;
                    handleUpdateExperience(idx, 'period', newPeriod);
                  };

                  return (
                    <div key={idx} className="border border-slate-300/50 dark:border-slate-700/50 rounded-2xl p-4 bg-white dark:bg-[#1A2133] relative group mb-4">
                       <button type="button" onClick={() => handleRemoveExperience(idx)} className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all" title="Hapus">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <input type="text" value={exp.title} onChange={e => handleUpdateExperience(idx, 'title', e.target.value)} placeholder="Jabatan (misal Product Designer)" className="col-span-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                          <input type="text" value={exp.company} onChange={e => handleUpdateExperience(idx, 'company', e.target.value)} placeholder="Nama Perusahaan" className="col-span-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                       </div>
                       <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Mulai (Tahun/Bulan)</label>
                            <input 
                              type="text" 
                              value={startVal} 
                              onChange={e => handleStartChange(e.target.value)} 
                              placeholder="misal: Jan 2022" 
                              className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Hingga</label>
                            <input 
                              type="text" 
                              value={isPresent ? "Sekarang" : endVal} 
                              disabled={isPresent}
                              onChange={e => handleEndChange(e.target.value)} 
                              placeholder="misal: Des 2023" 
                              className={`w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${isPresent ? 'opacity-60 bg-slate-100 dark:bg-slate-800' : ''}`} 
                            />
                          </div>
                       </div>
                       <div className="flex items-center gap-2 mb-3">
                          <button 
                            type="button" 
                            onClick={handlePresentToggle} 
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 active:scale-95 ${
                              isPresent 
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' 
                                : 'bg-white dark:bg-[#1A2133] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-[#2A3143] hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isPresent ? 'bg-indigo-600 dark:bg-indigo-400 animate-pulse' : 'bg-slate-400'}`}></span>
                            Masih Bekerja Di Sini (Hingga Sekarang)
                          </button>
                       </div>
                       <textarea rows={3} 
                          value={exp.tasks && exp.tasks.length > 0 ? exp.tasks.map(t => t.startsWith('•') ? t : `• ${t}`).join('\n') : '• '} 
                          onFocus={e => {
                            if (!e.currentTarget.value || e.currentTarget.value === '• ') {
                              e.currentTarget.value = '• ';
                              handleUpdateExperience(idx, 'tasks', '• ');
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const textarea = e.currentTarget;
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const val = textarea.value;
                              const nextBullet = "• ";
                              
                              const newVal = val.substring(0, start) + "\n" + nextBullet + val.substring(end);
                              handleUpdateExperience(idx, 'tasks', newVal);
                              
                              setTimeout(() => {
                                textarea.selectionStart = textarea.selectionEnd = start + 1 + nextBullet.length;
                              }, 0);
                            }
                          }}
                          onChange={e => {
                            let val = e.target.value;
                            const lines = val.split('\n').map(line => {
                              const trimmed = line.trim();
                              if (trimmed === '') return '• ';
                              if (!line.startsWith('•')) return '• ' + line;
                              return line;
                            });
                            handleUpdateExperience(idx, 'tasks', lines.join('\n'));
                          }}
                          placeholder="Tanggung jawab utama dan pencapaian (tiap baris akan menjadi bullet point)..." 
                          className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        ></textarea>
                    </div>
                  );
                })}
              </div>

              {/* Pendidikan */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Detail Pendidikan</h3>
                  <button type="button" onClick={handleAddEducation} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/20 hover:bg-indigo-200 dark:hover:bg-indigo-900/40 px-2.5 py-1.5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Gelar
                  </button>
                </div>
                {/* Pendidikan Entries */}
                {(resumeData.education || []).map((edu, idx) => {
                  const [eduStart, eduEnd] = edu.year ? edu.year.split(' - ') : ['', ''];
                  const isEduPresent = eduEnd === 'Sekarang';

                  const handleEduStartChange = (val: string) => {
                    const newYear = `${val} - ${eduEnd || ''}`;
                    handleUpdateEducation(idx, 'year', newYear);
                  };
                  const handleEduEndChange = (val: string) => {
                    const newYear = `${eduStart || ''} - ${val}`;
                    handleUpdateEducation(idx, 'year', newYear);
                  };
                  const handleEduPresentToggle = () => {
                    const newYear = isEduPresent 
                      ? `${eduStart || ''} - ` 
                      : `${eduStart || ''} - Sekarang`;
                    handleUpdateEducation(idx, 'year', newYear);
                  };

                  return (
                    <div key={idx} className="border border-slate-300/50 dark:border-slate-700/50 rounded-2xl p-4 bg-white dark:bg-[#1A2133] relative group mb-4">
                       <button type="button" onClick={() => handleRemoveEducation(idx)} className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all" title="Hapus">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <input type="text" value={edu.degree} onChange={e => handleUpdateEducation(idx, 'degree', e.target.value)} placeholder="Gelar (misal Sarjana Komputer)" className="col-span-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                          <input type="text" value={edu.campus} onChange={e => handleUpdateEducation(idx, 'campus', e.target.value)} placeholder="Universitas / Institusi" className="col-span-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                       </div>
                       <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Mulai (Tahun/Bulan)</label>
                            <input 
                              type="text" 
                              value={eduStart} 
                              onChange={e => handleEduStartChange(e.target.value)} 
                              placeholder="misal: 2018" 
                              className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Lulus / Berakhir</label>
                            <input 
                              type="text" 
                              value={isEduPresent ? "Sekarang" : eduEnd} 
                              disabled={isEduPresent}
                              onChange={e => handleEduEndChange(e.target.value)} 
                              placeholder="misal: 2022" 
                              className={`w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${isEduPresent ? 'opacity-60 bg-slate-100 dark:bg-slate-800' : ''}`} 
                            />
                          </div>
                       </div>
                       <div className="flex items-center gap-2 mb-3">
                          <button 
                            type="button" 
                            onClick={handleEduPresentToggle} 
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 active:scale-95 ${
                              isEduPresent 
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' 
                                : 'bg-white dark:bg-[#1A2133] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-[#2A3143] hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isEduPresent ? 'bg-indigo-600 dark:bg-indigo-400 animate-pulse' : 'bg-slate-400'}`}></span>
                            Masih Belajar Di Sini (Hingga Sekarang)
                          </button>
                       </div>
                       <div className="grid grid-cols-1 gap-4">
                         <div className="space-y-1">
                           <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">IPK / Skor (Opsional)</label>
                           <input type="text" value={edu.gpa} onChange={e => handleUpdateEducation(idx, 'gpa', e.target.value)} placeholder="misal: 3.85" className="bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                         </div>
                       </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50"><button type="button" onClick={prevStep} className="bg-white dark:bg-[#1A2133] hover:bg-slate-200 dark:hover:bg-[#1A2133] text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Sebelumnya</button><button type="button" onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 active:scale-95">Selanjutnya <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button></div>
            </div>
            )}

             {/* Projects & Portfolio (Visual) */}
             {currentStep === 4 && (
             <div className="resume-step rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent">
               <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                 <span className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs">4</span>
                 Proyek Unggulan
               </h2>
               
               <div className="flex items-center justify-between mb-3">
                 <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sorotan Proyek</h3>
                 <button type="button" onClick={handleAddProject} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/20 hover:bg-indigo-200 dark:hover:bg-indigo-900/40 px-2.5 py-1.5 rounded-lg transition-colors">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                   Tambah Proyek
                 </button>
               </div>
               
               {/* Project Entries */}
               {(resumeData.projects || []).map((proj, idx) => (
                 <div key={idx} className="border border-slate-200 dark:border-[#2A3143] rounded-[16px] p-5 bg-transparent relative group mb-4">
                    <button type="button" onClick={() => handleRemoveProject(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all" title="Hapus">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <input type="text" value={proj.name} onChange={e => handleUpdateProject(idx, 'name', e.target.value)} placeholder="Nama Proyek (misal: E-Commerce App)" className="col-span-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                       <input type="url" value={proj.url} onChange={e => handleUpdateProject(idx, 'url', e.target.value)} placeholder="Tautan Proyek / URL" className="col-span-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                    </div>
                    <textarea rows={3} value={proj.description} onChange={e => handleUpdateProject(idx, 'description', e.target.value)} placeholder="Jelaskan tujuan proyek, stack teknologi yang digunakan, serta dampak atau hasil dari proyek ini..." className="w-full bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 outline-none resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all mb-4"></textarea>
                    <input type="text" value={proj.techStack?.join(', ')} onChange={e => handleUpdateProject(idx, 'techStack', e.target.value)} placeholder="Tech Stack (Pisahkan dengan koma)" className="w-full mb-4 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                    
                    {/* Add thumbnail */}
                    <div className="flex items-center gap-4">
                       <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#2A3143] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1A2133] hover:border-indigo-400 dark:hover:border-indigo-500 transition-all relative overflow-hidden shrink-0 group/img">
                          <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => handleUpdateProject(idx, 'image', reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" title="Unggah Gambar" />
                          {proj.image ? (
                            <img src={proj.image} alt="Thumbnail" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <svg className="w-5 h-5 text-slate-400 group-hover/img:text-indigo-500 mb-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0V20a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10l4 4v10z"></path></svg>
                              <span className="text-[9px] font-medium text-slate-500 group-hover/img:text-indigo-500 transition-colors">Gambar</span>
                            </>
                          )}
                       </label>
                       <div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Thumbnail / Screenshot Proyek</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">Format JPG/PNG, opsional untuk melengkapi portofolio.</p>
                       </div>
                    </div>
                 </div>
               ))}
               
               <div className="mt-8">
                 <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Hobi & Bahasa</h3>
                 <div className="border border-slate-200 dark:border-[#2A3143] rounded-[16px] p-5 bg-transparent space-y-6">
                   
                   {/* Bahasa */}
                   <div className="space-y-3">
                     <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bahasa</label>
                     <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={languageInput} 
                         onChange={e => setLanguageInput(e.target.value)} 
                         onKeyDown={e => {
                           if (e.key === 'Enter') {
                             e.preventDefault();
                             handleAddLanguage();
                           }
                         }}
                         placeholder="misal: Indonesia, Inggris" 
                         className="flex-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium" 
                       />
                       <button 
                         type="button" 
                         onClick={handleAddLanguage} 
                         className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 shrink-0"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                         Tambah
                       </button>
                     </div>
                     
                     {/* Language Chips */}
                     <div className="flex flex-wrap gap-2 pt-1">
                       {(resumeData.profile.languages || []).map(lang => (
                         <span 
                           key={lang} 
                           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 animate-fade-in"
                         >
                           {lang}
                           <button 
                             type="button" 
                             onClick={() => handleRemoveLanguage(lang)} 
                             className="hover:bg-indigo-200 dark:hover:bg-indigo-500/25 p-0.5 rounded-full transition-colors inline-flex items-center justify-center shrink-0 w-4 h-4"
                             title="Hapus Bahasa"
                           >
                             <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                           </button>
                         </span>
                       ))}
                       {(resumeData.profile.languages || []).length === 0 && (
                         <span className="text-xs text-slate-500 italic mt-1">Belum ada bahasa yang ditambahkan.</span>
                       )}
                     </div>
                   </div>

                   {/* Hobi / Ketertarikan */}
                   <div className="space-y-3 pt-5 border-t border-slate-200 dark:border-[#2A3143]">
                     <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hobi / Ketertarikan</label>
                     <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={interestInput} 
                         onChange={e => setInterestInput(e.target.value)} 
                         onKeyDown={e => {
                           if (e.key === 'Enter') {
                             e.preventDefault();
                             handleAddInterest();
                           }
                         }}
                         placeholder="misal: Fotografi, Coding" 
                         className="flex-1 bg-white dark:bg-[#1A2133] border border-slate-300 dark:border-[#2A3143] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium" 
                       />
                       <button 
                         type="button" 
                         onClick={handleAddInterest} 
                         className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 shrink-0"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                         Tambah
                       </button>
                     </div>
                     
                     {/* Interest Chips */}
                     <div className="flex flex-wrap gap-2 pt-1">
                       {(resumeData.profile.interests || []).map(hobby => (
                         <span 
                           key={hobby} 
                           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 animate-fade-in"
                         >
                           {hobby}
                           <button 
                             type="button" 
                             onClick={() => handleRemoveInterest(hobby)} 
                             className="hover:bg-indigo-200 dark:hover:bg-indigo-500/25 p-0.5 rounded-full transition-colors inline-flex items-center justify-center shrink-0 w-4 h-4"
                             title="Hapus Hobi"
                           >
                             <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                           </button>
                         </span>
                       ))}
                       {(resumeData.profile.interests || []).length === 0 && (
                         <span className="text-xs text-slate-500 italic mt-1">Belum ada hobi yang ditambahkan.</span>
                       )}
                     </div>
                   </div>

                 </div>
               </div>
               
                {/* Aksi Button */}
                <div className="rounded-[24px] p-6 border border-slate-200 dark:border-[#2A3143] bg-transparent mt-8">
                  <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-4">
                     <button type="button" onClick={prevStep} className="shrink-0 bg-white dark:bg-[#1A2133] hover:bg-slate-200 dark:hover:bg-[#1A2133] text-slate-700 dark:text-slate-300 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer" title="Kembali"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                     <button onClick={() => handleSaveDocument('SELESAI')} disabled={isSaving} className="flex-1 bg-[#5A45FF] hover:bg-[#4C3BDE] disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(90,69,255,0.4)] flex items-center justify-center gap-2 active:scale-95 group">
                      <svg className={`w-5 h-5 ${isSaving ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSaving ? "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" : "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"}></path></svg>
                      {isSaving ? 'Memproses...' : 'Selesaikan & Lihat Hasil'}
                    </button>
                  </div>
                  <button onClick={() => handleSaveDocument('DRAF')} disabled={isSaving} className="w-full mt-3 py-3 border border-slate-300 dark:border-[#2A3143] text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-xs">
                    Simpan ke Draf (Lanjutkan Nanti)
                  </button>
                  <p className="text-center text-[10px] text-slate-500 mt-2 px-4 leading-relaxed">
                    Dengan menekan buat, Anda setuju untuk memformat data Anda mengikuti pedoman parser ATS global melalui jagoCV Engine.
                  </p>
                 </div>
               </div>
             </div>
             )}
             </div>
            )} {/* END CONTAINER: MANUAL FORMS (RESUME) */}

            {/* CONTAINER: AI MAGIC STORY (RESUME) */}
            {isAiMode && (
            <div className="animate-[fadeIn_0.3s_ease_forwards]">
              <div className="rounded-[24px] p-6 md:p-8 border border-slate-200 dark:border-[#2A3143] bg-transparent border border-indigo-500/30 relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-[40px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 mb-6 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 shadow-inner">
                      <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">
                        Kisah Ajaib AI: Desain Identitas Anda 🎨
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Bagikan visi, sentuhan warna yang Anda suka, dan karakter profesional yang ingin ditonjolkan. AI akan merancang resume visual yang sangat eye-catching khusus untuk Anda.</p>
                   </div>
                </div>

                {/* Chat Prompt UI */}
                {aiStep === 1 && (
                <div className="relative z-10 bg-white/80 dark:bg-[#0B1221]/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all animate-[fadeIn_0.3s_ease_forwards]">
                  <div className="p-3 bg-slate-50/50 dark:bg-[#070B19]/50 border-b border-slate-200 dark:border-slate-800/50 flex gap-2 overflow-x-auto hide-scrollbar">
                      <button className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700/30 transition-colors whitespace-nowrap">🌟 Buatkan contoh prompt</button>
                      <button className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0B1221] text-slate-600 dark:text-slate-400 text-[11px] font-medium hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors whitespace-nowrap">UX Designer</button>
                      <button className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0B1221] text-slate-600 dark:text-slate-400 text-[11px] font-medium hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors whitespace-nowrap">Creative Director</button>
                  </div>
                  <textarea rows={6} placeholder="Ketik prompt Anda di sini... (misal: Saya seorang Senior UX Designer dengan pengalaman 5 tahun di bidang FinTech. Saya ingin resume ini terlihat modern dan berani untuk melamar di agensi kreatif.)" className="w-full bg-transparent p-5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none resize-none leading-relaxed"></textarea>
                  
                  <div className="px-5 py-3 bg-slate-50/80 dark:bg-[#070B19]/80 border-t border-slate-200 dark:border-slate-800/50 flex justify-between items-center">
                     <div className="flex items-center gap-2">
                         <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 relative group" title="Lampirkan File (PDF/Word)">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                         </button>
                         <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10" title="Impor dari LinkedIn">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                         </button>
                     </div>
                     <button onClick={() => setAiStep(2)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95">
                        Selanjutnya
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
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
                    <LayoutSelection theme="indigo" stepNumber={5} />
                    <div className="flex items-center gap-3 justify-end mt-2">
                       <button onClick={() => handleSaveDocument('SELESAI')} disabled={isSaving} className="bg-[#5A45FF] hover:bg-[#4C3BDE] disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(90,69,255,0.4)] active:scale-95 group">
                          {isSaving ? 'Memproses...' : 'Buat AI Resume'}
                          <svg className={`w-5 h-5 ${isSaving ? 'animate-spin' : 'group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSaving ? "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" : "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"}></path></svg>
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )} {/* END CONTAINER: AI MAGIC STORY (RESUME) */}
            </>
            )}
          </div> {/* End Left Col Container */}
          {/* Right Col: Live Preview */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-6 flex flex-col gap-4 max-h-[calc(100vh-3rem)] overflow-y-auto hide-scrollbar pb-10">
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
               className="bg-slate-100 dark:bg-[#070B19]/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2 md:p-3 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col items-center w-full overflow-hidden hide-scrollbar"
             >
                {/* Live Preview Wrapper */}
                <div 
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full flex justify-center items-start overflow-hidden relative hide-scrollbar cursor-pointer group"
                  style={{ height: `${1123 * scale}px` }}
                >
                  <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-indigo-900/10 dark:group-hover:bg-indigo-400/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <div className="bg-indigo-600 text-white rounded-full p-4 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                     </div>
                  </div>

                  <div 
                    className="origin-top transition-transform duration-200 ease-out absolute hide-scrollbar"
                    style={{ 
                      transform: `scale(${scale})`,
                      width: '794px',
                      height: '1123px',
                      minWidth: '794px',
                      minHeight: '1123px',
                      overflow: 'hidden',
                      fontFamily: fontFamily
                    }}
                  >
                    <ResumeViewer templateId={templateId} data={resumeData} fontFamily={fontFamily} />
                  </div>
                </div>
             </div>
          </div>

        </div>

        {/* --- MODALS --- */}
        
        {/* 1. Exit Warning Modal */}
        {showExitModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div onClick={() => setShowExitModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
            
            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 animate-[scaleIn_0.2s_ease_forwards]">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Simpan Perubahan Anda?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Anda sedang keluar dari editor Resume. Apakah Anda ingin menyimpan draf pekerjaan Anda saat ini agar tidak hilang?
              </p>
              
              <div className="flex flex-col gap-2.5">
                <button 
                  type="button"
                  onClick={async () => {
                    setShowExitModal(false);
                    await handleSaveDocument('DRAF');
                  }} 
                  disabled={isSaving}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan ke Draf & Keluar'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowExitModal(false);
                    navigate('/dashboard');
                  }} 
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Keluar Tanpa Menyimpan
                </button>
                <button 
                  type="button"
                  onClick={() => setShowExitModal(false)} 
                  className="w-full py-3 bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Fullscreen Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 md:p-8 overflow-y-auto hide-scrollbar">
            <button 
              onClick={() => setShowPreviewModal(false)} 
              className="fixed top-6 right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="w-full max-w-[900px] flex justify-center animate-[zoomIn_0.3s_ease_out]">
              <div 
                className="bg-white shadow-2xl relative w-[210mm] min-h-[297mm] transform origin-top md:scale-100 scale-[0.6] sm:scale-75"
                style={{ fontFamily: fontFamily }}
              >
                <ResumeViewer templateId={templateId} data={resumeData} fontFamily={fontFamily} />
              </div>
            </div>
          </div>
        )}

        {/* 3. ATS Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0B1221] rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-[zoomIn_0.2s_ease_out]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pilih Proyek CV ATS</h3>
                <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                Pilih proyek CV ATS Anda untuk mengimpor datanya secara otomatis ke dalam desain resume visual ini.
              </p>
              
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto hide-scrollbar">
                {mockAtsProjects.map((project) => (
                  <button 
                    key={project.id}
                    onClick={() => handleSelectAtsImport(project)}
                    className="flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-[#1A2133] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left group"
                  >
                    <div className="flex justify-between items-center w-full mb-1">
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{project.title}</span>
                      <span className="text-xs font-medium text-slate-400">{project.date}</span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{project.data.profile.headline}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
