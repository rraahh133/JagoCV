import React from 'react';
import { ResumeData } from '../../types/resume.types';

export const metadata = {
  name: 'Layout Dua Kolom Modern',
  desc: 'Desain dual-column yang modern dan efisien memaksimalkan penggunaan ruang.'
};

interface Props {
  data: ResumeData;
}

export default function CorporateElegan({ data }: Props) {
  const skillsList = Object.entries(data.profile.skills || {}).map(([category, items]) => ({
    category,
    items
  }));

  // Placeholder data for empty sections
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

  const isProjPlaceholder = !data.projects || data.projects.length === 0;
  const projects = !isProjPlaceholder 
    ? data.projects 
    : [
        {
          name: "[Nama Proyek Unggulan]",
          url: "[tautan-proyek.com]",
          description: "[Jelaskan secara singkat mengenai proyek yang pernah Anda kerjakan]",
          techStack: ["[Tech 1]", "[Tech 2]"],
          image: ""
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

  const entityStyle = data.design?.entityStyle || { isBold: true, color: '', hasBadge: false };
  const theme = data.design?.theme || { sidebarBg: data.design?.entityStyle?.color || '#2563EB', sidebarText: '#ffffff', accent: data.design?.entityStyle?.color || '#4F46E5' };
  const entityStyleCSS = {
    fontWeight: entityStyle.isBold ? 'bold' : 'normal',
    color: entityStyle.hasBadge ? (entityStyle.badgeTextColor || entityStyle.color || 'inherit') : (entityStyle.color || 'inherit'),
    backgroundColor: entityStyle.hasBadge ? (entityStyle.badgeBgColor || `${entityStyle.color}1A`) : 'transparent',
    padding: entityStyle.hasBadge ? '2px 6px' : '0',
    borderRadius: entityStyle.hasBadge ? (entityStyle.badgeBorderRadius || '4px') : '0',
  };

  return (
    <div className="w-full selection:bg-primary-200 selection:text-[var(--color-accent)]">
      
      {/* A4 Document Container — no overflow-hidden so content can flow to page 2+ */}
      <div style={{ '--color-primary': theme.sidebarBg, '--color-primary-text': theme.sidebarText, '--color-accent': theme.accent, '--color-badge-bg': entityStyle.badgeBgColor || '#E0E7FF', '--color-badge-text': entityStyle.badgeTextColor || '#4F46E5', '--badge-radius': entityStyle.badgeBorderRadius || '4px' } as React.CSSProperties} className="w-[210mm] min-h-[297mm] flex flex-row shrink-0 bg-white shadow-2xl text-slate-900 print:shadow-none print:w-[210mm] print:min-h-[297mm] print:m-0 print:py-0 mx-auto">
        
        {/* LEFT SIDEBAR: PROFILE — stretches to match right column height */}
        <aside
          className="w-[33%] bg-[var(--color-primary)] p-6 sm:p-8 text-[var(--color-primary-text)] flex flex-col shrink-0 self-stretch"
        >
        <div className="flex flex-col h-full">
          <div>
            <div className="w-32 h-32 bg-[var(--color-accent)] rounded-2xl mb-8 shadow-lg transform rotate-3 flex items-center justify-center border-4 border-white overflow-hidden">
              <img 
                src={data.profile.image || 'https://via.placeholder.com/150'} 
                alt={data.profile.name} 
                className="w-full h-full object-cover transform -rotate-3 scale-110"
              />
            </div>

            <h1 className="text-4xl font-black leading-none mb-3 uppercase tracking-tighter">
              {data.profile.name.split(' ').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < data.profile.name.split(' ').length - 1 && <br/>}
                </React.Fragment>
              ))}
            </h1>
            <h2 className="text-[var(--color-accent)] font-semibold tracking-widest text-xs uppercase mb-8 text-left">
              {data.profile.headline}
            </h2>

            <div className="space-y-4 text-sm mb-10">
              <div className="grid grid-cols-1 gap-2.5 pb-5 border-b border-[var(--color-accent)]">
                {data.profile.contact.website && (
                  <a href={data.profile.contact.website.startsWith('http') ? data.profile.contact.website : `https://${data.profile.contact.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[13px] hover:text-[var(--color-accent)] transition-colors">
                    <span className="text-[var(--color-accent)] text-xs">●</span> {data.profile.contact.website}
                  </a>
                )}
                {data.profile.contact.email && (
                  <a href={`mailto:${data.profile.contact.email}`} className="flex items-center gap-3 text-[13px] hover:text-[var(--color-accent)] transition-colors">
                    <span className="text-[var(--color-accent)] text-xs">●</span> {data.profile.contact.email}
                  </a>
                )}
                {data.profile.contact.phone && (
                  <a href={`tel:${data.profile.contact.phone}`} className="flex items-center gap-3 text-[13px] hover:text-[var(--color-accent)] transition-colors">
                    <span className="text-[var(--color-accent)] text-xs">●</span> {data.profile.contact.phone}
                  </a>
                )}
                {data.profile.contact.location && (
                  <div className="flex items-center gap-3 text-[13px]">
                    <span className="text-[var(--color-accent)] text-xs">●</span> {data.profile.contact.location}
                  </div>
                )}
              </div>
              <div className="opacity-90 mt-5">
                <h3 className="font-bold text-[var(--color-accent)] uppercase text-[10px] mb-1.5 tracking-widest text-left">Ringkasan Profil Profesional</h3>
                <p className="leading-relaxed italic text-[13px]">{data.profile.summary}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 mt-8">
            {skillsList.length > 0 && (
              <section>
                <h3 className="text-[var(--color-accent)] font-black uppercase text-xs tracking-widest mb-4 text-left">Keterampilan Teknis</h3>
                <div className="space-y-4">
                  {skillsList.map((skillGroup, idx) => (
                    <div key={idx}>
                      <h4 className="text-[10px] font-bold text-primary-200 uppercase mb-1.5">{skillGroup.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((item, i) => (
                          <span key={i} className="px-2 py-1 bg-[var(--color-primary)] text-[10px] rounded border border-[var(--color-accent)] leading-none">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="flex flex-col gap-4">
              {data.profile.languages && data.profile.languages.length > 0 && (
                <section>
                  <h3 className="text-[var(--color-accent)] font-black uppercase text-[10px] tracking-widest mb-2">Bahasa</h3>
                  <div className="flex flex-col gap-1.5 list-none">
                    {data.profile.languages.map((lang, idx) => (
                      <div key={idx} className="text-[11px] leading-tight flex items-start gap-2">
                        <span className="text-[var(--color-accent)] text-[8px] mt-0.5">●</span>
                        <span>{lang}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {data.profile.interests && data.profile.interests.length > 0 && (
                <section>
                  <h3 className="text-[var(--color-accent)] font-black uppercase text-[10px] tracking-widest mb-2">Ketertarikan</h3>
                  <div className="flex flex-col gap-1.5 list-none">
                    {data.profile.interests.map((hobby, idx) => (
                      <div key={idx} className="text-[11px] leading-tight flex items-start gap-2">
                        <span className="text-[var(--color-accent)] text-[8px] mt-0.5">●</span>
                        <span>{hobby}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 p-6 sm:p-8 flex flex-col bg-white">
        <div className="w-full">
          
          <div className="flex flex-col gap-10">
            {/* WORK EXPERIENCE */}
            <div className="w-full">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-200 pb-2">Experience</h2>
              
              <div className="space-y-8">
                {experiences.map((exp, idx) => (
                    <div key={idx} className="flex gap-4 group page-break-avoid">
                      <div className="w-1 bg-[var(--color-accent)] shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-1 xl:gap-4 mb-2">
                          <h4 className="font-bold text-lg leading-tight text-slate-900">{exp.title} — <span className="text-slate-600 inline-block" style={entityStyleCSS}>{exp.company}</span></h4>
                          <span className="text-[10px] bg-[var(--color-accent)] text-[var(--color-primary-text)] rounded px-2 py-1 font-bold whitespace-nowrap self-start">
                            {exp.period}
                          </span>
                        </div>
                        <div className="space-y-1.5 mt-2">
                          {exp.tasks.map((task, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="text-slate-300 text-[10px] mt-1 shrink-0">■</span>
                              <p className="text-xs text-slate-600 italic leading-relaxed">{task}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            {/* PROJECTS & EDUCATION */}
            <div className="w-full grid grid-cols-2 gap-6 shrink-0 page-break-avoid">
              
              {/* FEATURED PROJECTS */}
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Featured Projects</h2>
                <div className="space-y-4">
                  {projects.map((proj, idx) => (
                      <a 
                        key={idx} 
                        href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block p-4 border-2 border-dashed border-primary-200 rounded-lg group hover:border-[var(--color-accent)] hover:bg-slate-50 transition-all flex flex-col items-start"
                      >
                        {proj.image && (
                           <div className="w-full h-24 mb-3 rounded overflow-hidden">
                              <img src={proj.image} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                           </div>
                        )}
                        <h3 className="text-[11px] font-bold text-[var(--color-accent)] uppercase mb-1 underline group-hover:text-[var(--color-accent)] transition-colors">
                          {proj.name}
                        </h3>
                        <p className="text-[12px] font-medium leading-snug text-slate-700 mb-2">
                          {proj.description}
                        </p>
                        
                        <div className="flex gap-1.5 flex-wrap mt-auto">
                          {proj.techStack.map((tech, i) => (
                            <span key={i} className="font-bold uppercase tracking-wider text-[8px] bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] px-1.5 py-0.5 rounded-[var(--badge-radius)]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </a>
                    ))}
                  </div>
                </section>

              {/* EDUCATION */}
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Education</h2>
                <div className="space-y-4">
                  {educations.map((edu, idx) => (
                      <div key={idx}>
                        <h3 className="font-bold text-sm text-slate-900 text-left">{edu.degree} <span className="inline-block" style={entityStyleCSS}>{edu.campus}</span></h3>
                        <p className="text-[11px] text-[var(--color-badge-text)] mt-1 font-medium bg-[var(--color-badge-bg)] inline-block px-2 py-0.5 rounded-[var(--badge-radius)] text-left">{edu.year} • {edu.gpa}</p>
                      </div>
                    ))}
                  </div>
                  
                  {data.availability && (
                    <div className="mt-6">
                      <div className="bg-primary-50 p-4 rounded-lg border-l-4 border-[var(--color-accent)]">
                        <h3 className="text-[10px] font-bold uppercase text-[var(--color-accent)] mb-1 tracking-widest">Availability</h3>
                        <p className="text-[12px] text-[var(--color-accent)] italic font-medium">{data.availability}</p>
                      </div>
                    </div>
                  )}
                </section>

            </div>
          </div>
          
        </div>
      </main>
      </div>
    </div>
  );
}
