import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { ResumeData } from '../../types/resume.types';

export const metadata = {
  name: 'Layout Modern Standar (A4)',
  desc: 'Bersih, minimalis, dan sangat profesional untuk semua industri.'
};

interface Props {
  data: ResumeData;
}

export default function ModernMinimalis({ data }: Props) {
  // Determine if sections are empty to show placeholders
  const isWebsitePlaceholder = !data.profile.contact.website;
  const isEmailPlaceholder = !data.profile.contact.email;
  const isPhonePlaceholder = !data.profile.contact.phone;
  const isLocationPlaceholder = !data.profile.contact.location;
  const isSummaryPlaceholder = !data.profile.summary;

  const isSkillsPlaceholder = !data.profile.skills || Object.keys(data.profile.skills).length === 0;
  const skillsData = !isSkillsPlaceholder 
    ? data.profile.skills 
    : { "Keahlian": ["[Keahlian Teknis 1]", "[Keahlian Teknis 2]", "[Keahlian Teknis 3]"] };

  const isLangPlaceholder = !data.profile.languages || data.profile.languages.length === 0;
  const languagesData = !isLangPlaceholder 
    ? data.profile.languages 
    : ["[Bahasa 1]", "[Bahasa 2]"];

  const isInterestPlaceholder = !data.profile.interests || data.profile.interests.length === 0;
  const interestsData = !isInterestPlaceholder 
    ? data.profile.interests 
    : ["[Minat / Hobi 1]", "[Minat / Hobi 2]"];

  const isExpPlaceholder = !data.experience || data.experience.length === 0;
  const experiences = !isExpPlaceholder 
    ? data.experience 
    : [
        {
          title: "[Jabatan Pekerjaan]",
          company: "[Nama Perusahaan]",
          period: "[Periode Kerja]",
          tasks: [
            "[Deskripsikan tugas dan tanggung jawab utama Anda di sini]",
            "[Tuliskan pencapaian terbaik atau metrik yang berhasil Anda raih]"
          ]
        }
      ];

  const isEduPlaceholder = !data.education || data.education.length === 0;
  const educations = !isEduPlaceholder 
    ? data.education 
    : [
        {
          degree: "[Gelar / Program Studi]",
          campus: "[Nama Kampus / Institusi]",
          year: "[Tahun Mulai - Lulus]",
          gpa: "[IPK]"
        }
      ];

  const isProjPlaceholder = !data.projects || data.projects.length === 0;
  const projects = !isProjPlaceholder 
    ? data.projects 
    : [
        {
          name: "[Nama Proyek Unggulan]",
          url: "[tautan-proyek.com]",
          description: "[Jelaskan secara singkat mengenai proyek yang pernah Anda kerjakan, solusi yang Anda tawarkan, dan kontribusi Anda...]",
          techStack: ["[Teknologi 1]", "[Teknologi 2]"]
        }
      ];

  const entityStyle = data.design?.entityStyle || { isBold: true, color: '', hasBadge: false };
  const entityStyleCSS = {
    fontWeight: entityStyle.isBold ? 'bold' : 'normal',
    color: entityStyle.hasBadge ? (entityStyle.badgeTextColor || entityStyle.color || 'inherit') : (entityStyle.color || 'inherit'),
    backgroundColor: entityStyle.hasBadge ? (entityStyle.badgeBgColor || `${entityStyle.color}1A`) : 'transparent',
    padding: entityStyle.hasBadge ? '2px 6px' : '0',
    borderRadius: entityStyle.hasBadge ? (entityStyle.badgeBorderRadius || '4px') : '0',
  };

  const theme = data.design?.theme || { 
    sidebarBg: '#1e3a8a', 
    sidebarText: '#f8fafc', 
    accent: '#4f46e5',
    hrColor: '#E5E7EB',
    sectionOutline: '#E0E7FF',
    contentText: '#1E293B',
    contentBg: '#FFFFFF'
  };
  const themeStyle = {
    '--color-sidebar': theme.sidebarBg,
    '--color-sidebar-text': theme.sidebarText,
    '--color-accent': theme.accent,
    '--color-hr': theme.hrColor || '#E5E7EB',
    '--color-section-outline': theme.sectionOutline || '#E0E7FF',
    '--color-content-text': theme.contentText || '#1E293B',
    '--color-content-bg': theme.contentBg || '#FFFFFF',
    '--color-badge-bg': entityStyle.badgeBgColor || '#E0E7FF', 
    '--color-badge-text': entityStyle.badgeTextColor || '#4F46E5', 
    '--badge-radius': entityStyle.badgeBorderRadius || '4px',
  } as React.CSSProperties;

  return (
    <div style={themeStyle} className="w-full">
      {/* A4 Canvas — no overflow-hidden so content can flow to page 2+ */}
      <div
        style={{
          '--color-primary': theme.sidebarBg,
          '--color-primary-text': theme.sidebarText,
          '--color-accent': theme.accent,
          '--color-hr': theme.hrColor || '#E5E7EB',
          '--color-section-outline': theme.sectionOutline || '#E0E7FF',
          '--color-content-text': theme.contentText || '#1E293B',
          '--color-content-bg': theme.contentBg || '#FFFFFF',
          '--color-badge-bg': entityStyle.badgeBgColor || '#E0E7FF',
          '--color-badge-text': entityStyle.badgeTextColor || '#4F46E5',
          '--badge-radius': entityStyle.badgeBorderRadius || '4px',
        } as React.CSSProperties}
        className="w-[210mm] min-h-[297mm] bg-white shadow-2xl flex shrink-0 print:shadow-none mx-auto relative"
      >
        {/* Left Sidebar — stretches to match right column height */}
        <div className="w-[33%] bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)] p-6 flex flex-col gap-6 shrink-0 self-stretch">
          
          <div className="relative self-center mt-2 flex flex-col items-center">
            <div className="w-28 h-28 bg-slate-300 border-4 border-white rotate-3 shadow-lg flex items-center justify-center overflow-hidden mb-4">
              <img 
                src={data.profile.image || 'https://via.placeholder.com/150'} 
                alt={data.profile.name || "Foto Profil"} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 text-center">
              <h1 className={`font-extrabold tracking-tight leading-none ${
                !data.profile.name ? 'text-2xl' :
                data.profile.name.length <= 15 ? 'text-3xl' :
                data.profile.name.length <= 20 ? 'text-2xl' :
                data.profile.name.length <= 25 ? 'text-xl' :
                data.profile.name.length <= 30 ? 'text-lg' :
                'text-base'
              }`}>
                {data.profile.name || <span className="opacity-50 italic text-2xl font-bold">[Nama Anda]</span>}
              </h1>
              <h2 className="text-[11px] font-semibold text-[var(--color-accent)] uppercase tracking-widest mt-1.5">
                {data.profile.headline || <span className="opacity-60 italic">[Headline Pekerjaan]</span>}
              </h2>
            </div>
          </div>

          <div className="space-y-3 py-4 border-b border-[var(--color-accent)]/50">
            <ul className="flex flex-col gap-2.5 text-[11px] font-medium text-[var(--color-primary-text)]/90">
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 shrink-0" />
                <span className={isWebsitePlaceholder ? "opacity-50 italic" : ""}>
                  {data.profile.contact.website || "[Website / Portofolio]"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0" />
                <span className={isEmailPlaceholder ? "opacity-50 italic" : ""}>
                  {data.profile.contact.email || "[Email Anda]"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0" />
                <span className={isPhonePlaceholder ? "opacity-50 italic" : ""}>
                  {data.profile.contact.phone || "[Nomor Telepon]"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className={isLocationPlaceholder ? "opacity-50 italic" : ""}>
                  {data.profile.contact.location || "[Lokasi / Domisili]"}
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[13px] font-bold uppercase border-l-2 border-[var(--color-accent)] pl-2">Ringkasan Profil</h3>
            <p className={`text-[11px] leading-relaxed ${isSummaryPlaceholder ? "opacity-50 italic" : "text-indigo-100/80"}`}>
              {data.profile.summary || "[Tulis ringkasan profil profesional singkat Anda di sini untuk menjelaskan keahlian utama, pengalaman terbaik, dan apa yang bisa Anda tawarkan kepada perusahaan...]"}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[13px] font-bold uppercase border-l-2 border-[var(--color-accent)] pl-2">Keterampilan Teknis</h3>
            <div className={`space-y-3 ${isSkillsPlaceholder ? "opacity-50 italic" : ""}`}>
              {Object.entries(skillsData || {}).map(([category, skills]) => (
                <div key={category} className="space-y-1.5">
                  <h4 className="text-[11px] font-semibold text-indigo-300">{category}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(skill => (
                      <span key={skill} className="px-1.5 py-0.5 bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-[10px] rounded-[var(--badge-radius)] font-normal">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pb-2">
            <h3 className="text-[13px] font-bold uppercase border-l-2 border-[var(--color-accent)] pl-2">Bahasa</h3>
            <ul className={`text-[11px] space-y-1.5 flex flex-col mt-2 ${isLangPlaceholder ? "opacity-50 italic" : ""}`}>
              {languagesData.map(val => (
                <li key={val} className="flex items-center gap-2 flex-wrap">
                  <span className="w-1 h-1 shrink-0 bg-[var(--color-primary)] rounded-full"></span>
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5 pb-2">
            <h3 className="text-[13px] font-bold uppercase border-l-2 border-[var(--color-accent)] pl-2">Hobi</h3>
            <ul className={`text-[11px] space-y-1.5 flex flex-col mt-2 ${isInterestPlaceholder ? "opacity-50 italic" : ""}`}>
              {interestsData.map(val => (
                <li key={val} className="flex items-center gap-2 flex-wrap">
                  <span className="w-1 h-1 shrink-0 bg-[var(--color-primary)] rounded-full"></span>
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-[67%] p-8 flex flex-col gap-6 shrink-0" style={{ backgroundColor: 'var(--color-content-bg)', color: 'var(--color-content-text)' }}>
          
          {/* Experience */}
          <div className="space-y-4 page-break-avoid">
            <h2 className="text-[15px] font-black text-indigo-950 uppercase tracking-tighter flex items-center gap-2">
              <span className="w-5 h-1 bg-[var(--color-primary)]"></span> Pengalaman
            </h2>
            <div className={`space-y-5 ${isExpPlaceholder ? "opacity-50 italic" : ""}`}>
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-5 space-y-1 page-break-avoid" style={{ borderLeft: `1px solid var(--color-hr)` }}>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {exp.title} &mdash; <span className="inline-block text-slate-600" style={entityStyleCSS}>{exp.company}</span>
                    </h4>
                    <span className="px-2 py-0.5 mt-0.5 bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-[9px] font-bold rounded-[var(--badge-radius)] uppercase shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="text-[11px] list-disc list-outside ml-3 text-slate-600 flex flex-col gap-1.5 mt-2 marker:text-[var(--color-accent)]">
                    {exp.tasks.map((task, i) => <li key={i}>{task}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="space-y-4 page-break-avoid">
            <h2 className="text-[15px] font-black text-indigo-950 uppercase tracking-tighter flex items-center gap-2">
              <span className="w-5 h-1 bg-[var(--color-primary)]"></span> Proyek Unggulan
            </h2>
            <div className={`grid grid-cols-2 gap-4 ${isProjPlaceholder ? "opacity-50 italic" : ""}`}>
              {projects.map((proj, idx) => {
                const isAmber = idx % 2 !== 0;
                const borderClass = "border-[var(--color-section-outline)]";
                const bgClass = "bg-[var(--color-section-outline)]/20";
                const textTitle = "text-[var(--color-accent)]";

                return (
                  <div key={idx} className={`p-4 border border-dashed rounded-sm space-y-2 flex flex-col ${borderClass} ${bgClass}`}>
                    <div className="space-y-0.5">
                      <h4 className={`text-[13px] font-bold leading-tight ${textTitle}`}>{proj.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <Globe className="w-3 h-3 shrink-0" /> {proj.url}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed flex-1">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map(ts => (
                        <span key={ts} className={`px-1.5 py-0.5 text-[10px] font-medium bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] rounded-[var(--badge-radius)]`}>
                          {ts}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4 page-break-avoid">
            <h2 className="text-[15px] font-black text-indigo-950 uppercase tracking-tighter flex items-center gap-2">
              <span className="w-5 h-1 bg-[var(--color-primary)]"></span> Pendidikan
            </h2>
            <div className={`space-y-3 ${isEduPlaceholder ? "opacity-50 italic" : ""}`}>
              {educations.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 page-break-avoid" style={{ backgroundColor: 'var(--color-section-outline)', borderRight: `2px solid var(--color-hr)` }}>
                  <div className="space-y-0.5">
                    <h3 className="text-[13px] font-bold text-slate-900">{edu.degree}</h3>
                    <p className="text-[11px] text-slate-500 inline-block" style={entityStyleCSS}>{edu.campus}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                    <span className="px-2 py-0.5 bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-[9px] rounded-[var(--badge-radius)] uppercase">{edu.year}</span>
                    {edu.gpa && (
                      <span className="px-2 py-0.5 bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-[9px] font-bold rounded-[var(--badge-radius)]">
                        IPK: {edu.gpa}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
