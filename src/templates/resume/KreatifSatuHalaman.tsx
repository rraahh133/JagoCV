import { Globe, Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react";
import { ResumeData } from '../../types/resume.types';

export const metadata = {
  name: 'Layout Kreatif Satu Halaman',
  desc: 'Desain dinamis dengan penekanan pada visual keterampilan & hobi.'
};

interface Props {
  data: ResumeData;
}

export default function KreatifSatuHalaman({ data }: Props) {
  const entityStyle = data.design?.entityStyle || { isBold: true, color: '', hasBadge: false };
  const entityStyleCSS = {
    fontWeight: entityStyle.isBold ? 'bold' : 'normal',
    color: entityStyle.hasBadge ? (entityStyle.badgeTextColor || entityStyle.color || 'inherit') : (entityStyle.color || 'inherit'),
    backgroundColor: entityStyle.hasBadge ? (entityStyle.badgeBgColor || `${entityStyle.color}1A`) : 'transparent',
    padding: entityStyle.hasBadge ? '2px 6px' : '0',
    borderRadius: entityStyle.hasBadge ? (entityStyle.badgeBorderRadius || '4px') : '0',
  };

  const theme = data.design?.theme || { sidebarBg: '#1e3a8a', sidebarText: '#f8fafc', accent: '#4f46e5' };
  const themeStyle = {
    '--color-sidebar': theme.sidebarBg,
    '--color-sidebar-text': theme.sidebarText,
    '--color-accent': theme.accent, '--color-badge-bg': entityStyle.badgeBgColor || '#E0E7FF', '--color-badge-text': entityStyle.badgeTextColor || '#4F46E5', '--badge-radius': entityStyle.badgeBorderRadius || '4px',
  } as React.CSSProperties;

  return (
    <div style={themeStyle} className="bg-slate-200 min-h-screen py-10 flex items-center justify-center tracking-normal overflow-auto">
      {/* 
        A4 Size Container 
        w-[210mm] min-h-[297mm] and strict print rules applied. No rounded borders.
      */}
      <div style={{ '--color-primary': theme.sidebarBg, '--color-primary-text': theme.sidebarText, '--color-accent': theme.accent, '--color-badge-bg': entityStyle.badgeBgColor || '#E0E7FF', '--color-badge-text': entityStyle.badgeTextColor || '#4F46E5', '--badge-radius': entityStyle.badgeBorderRadius || '4px' } as React.CSSProperties} className="w-[210mm] min-h-[297mm] bg-white shadow-2xl flex flex-row shrink-0 text-slate-800 transform origin-top md:scale-100 scale-75">
        
        {/* Sidebar Kiri */}
        <div className="w-1/3 bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)] p-5 flex flex-col gap-4 shrink-0">
          <div className="text-left mt-0">
            {/* Profil Image (Creative style) */}
            <img 
              src={data.profile.image || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="w-[100px] h-[100px] object-cover rounded-xl border-4 border-white shadow-sm -rotate-3 transition-transform hover:rotate-0 mx-auto mb-2.5"
            />
            {/* Semantic Headings for Name and Headline */}
            <h1 className="text-[20px] font-extrabold leading-[1.1] text-[var(--color-primary-text)] mt-0 mb-0.5">{data.profile.name}</h1>
            <h2 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-[0.05em] mb-3">{data.profile.headline}</h2>
          </div>

          <div className="flex flex-col">
            {data.profile.contact.website && (
              <div className="flex items-center gap-2 text-[10px] pb-1.5 mb-1.5 border-b border-white/10">
                <Globe className="w-3.5 h-3.5 text-primary-300" />
                <span>{data.profile.contact.website}</span>
              </div>
            )}
            {data.profile.contact.email && (
              <div className="flex items-center gap-2 text-[10px] pb-1.5 mb-1.5 border-b border-white/10">
                <Mail className="w-3.5 h-3.5 text-primary-300" />
                <span>{data.profile.contact.email}</span>
              </div>
            )}
            {data.profile.contact.phone && (
              <div className="flex items-center gap-2 text-[10px] pb-1.5 mb-1.5 border-b border-white/10">
                <Phone className="w-3.5 h-3.5 text-primary-300" />
                <span>{data.profile.contact.phone}</span>
              </div>
            )}
            {data.profile.contact.location && (
              <div className="flex items-center gap-2 text-[10px]">
                <MapPin className="w-3.5 h-3.5 text-primary-300" />
                <span>{data.profile.contact.location}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[13px] font-bold text-[var(--color-primary-text)] uppercase mb-2 border-l-[3px] border-[var(--color-accent)] pl-2">Ringkasan Profesional</h3>
            <p className="italic text-[var(--color-primary-text)]/90 text-[10.5px] leading-relaxed">
              {data.profile.summary}
            </p>
          </div>

          {Object.keys(data.profile.skills || {}).length > 0 && (
            <div>
              <h3 className="text-[13px] font-bold text-[var(--color-primary-text)] uppercase mb-2 border-l-[3px] border-[var(--color-accent)] pl-2">Keterampilan Teknis</h3>
              <div className="flex flex-col gap-3">
                {Object.entries(data.profile.skills).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="text-[11px] font-semibold text-[var(--color-primary-text)] mb-1">{category}</h4>
                    <div className="flex flex-wrap gap-1">
                      {skills.map(skill => (
                        <span key={skill} className="bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-[9px] font-medium px-1.5 py-0.5 rounded-[var(--badge-radius)] inline-block">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2">
            <h3 className="text-[13px] font-bold text-[var(--color-primary-text)] uppercase mb-2 border-l-[3px] border-[var(--color-accent)] pl-2">Bahasa & Ketertarikan</h3>
            <div className="text-[10px] text-[var(--color-primary-text)]/90 pl-1 space-y-3">
              {data.profile.languages && data.profile.languages.length > 0 && (
                <div>
                  <ul className="list-disc list-inside space-y-0.5 marker:text-[var(--color-accent)] marker:font-bold">
                    {data.profile.languages.map(lang => (
                       <li key={lang}>{lang}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.profile.interests && data.profile.interests.length > 0 && (
                <div>
                  <ul className="list-disc list-inside space-y-0.5 marker:text-[var(--color-accent)] marker:font-bold">
                    {data.profile.interests.map(interest => (
                       <li key={interest}>{interest}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Konten Kanan */}
        <div className="w-2/3 p-6 flex flex-col gap-4 text-slate-800">
          
          {data.experience && data.experience.length > 0 && (
            <section>
              <div className="mb-2">
                <h3 className="text-[13px] font-bold text-[var(--color-accent)] uppercase border-l-[3px] border-[var(--color-accent)] pl-2">Pengalaman Kerja</h3>
              </div>
              <div className="flex flex-col mt-0">
                {data.experience.map((exp, i) => (
                  <div key={i} className="relative border-l-2 border-primary-100 pl-4 mb-3.5">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[11px] font-semibold text-slate-800 leading-tight">
                        {exp.title} <span className="font-normal">&mdash; </span><span className="inline-block" style={entityStyleCSS}>{exp.company}</span>
                      </h4>
                      <span className="bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-[9px] font-medium px-1.5 py-0.5 rounded-[var(--badge-radius)] shrink-0 ml-4">{exp.period}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 text-[10px] text-slate-700 space-y-0.5 marker:text-[var(--color-accent)] marker:font-bold">
                      {exp.tasks.map((task, j) => (
                        <li key={j}>{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section>
              <div className="mb-2">
                <h3 className="text-[13px] font-bold text-[var(--color-accent)] uppercase border-l-[3px] border-[var(--color-accent)] pl-2">Proyek Unggulan</h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mt-0">
                {data.projects.map((proj, i) => (
                  <div key={i} className={`border border-dashed rounded-md p-2 flex flex-col ${i % 2 === 0 ? 'border-[var(--color-accent)]' : 'border-[var(--color-accent)]'}`}>
                    <h4 className="text-[11px] font-semibold text-slate-800 mb-0.5">{proj.name}</h4>
                    {proj.url && (
                      <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[9px] text-[var(--color-accent)] font-medium hover:underline mb-1">
                        <LinkIcon className="w-2.5 h-2.5" /> {proj.url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    <p className="text-slate-700 text-[9px] leading-relaxed mb-1.5 flex-grow">{proj.description}</p>
                    <div className="mt-auto flex flex-wrap gap-1">
                      {proj.techStack.map((t, j) => (
                        <span key={j} className="text-[7px] bg-[var(--color-primary)] text-[var(--color-primary-text)] font-medium px-1 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section>
              <div className="mb-2">
                <h3 className="text-[13px] font-bold text-[var(--color-accent)] uppercase border-l-[3px] border-[var(--color-accent)] pl-2">Pendidikan</h3>
              </div>
              <div className="flex flex-col gap-2 mt-0">
                {data.education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-800">
                        {edu.degree} <span className="font-normal">&mdash; </span><span className="inline-block" style={entityStyleCSS}>{edu.campus}</span>
                      </h4>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <span className="bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-[9px] px-1.5 py-0.5 rounded-[var(--badge-radius)] font-medium">{edu.year}</span>
                      <span className="bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-[9px] px-1.5 py-0.5 rounded-[var(--badge-radius)] font-medium">IPK: {edu.gpa}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Availability Box Container */}
          {data.availability && (
            <section className="mt-auto">
              <div className="bg-primary-50 border-l-[6px] border-[var(--color-accent)] p-2 mt-3">
                <h4 className="text-[11px] text-[var(--color-accent)] font-semibold mb-0.5">Ketersediaan Kerja</h4>
                <p className="text-slate-700 text-[10px] leading-relaxed">
                  {data.availability}
                </p>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
