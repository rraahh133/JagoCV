import { Globe, Lightbulb, Mail, MapPin, Phone, UserCircle2 } from "lucide-react";
import { ResumeData } from '../../types/resume.types';

export const metadata = {
  name: 'Layout Minimalis Tech',
  desc: 'Sangat cocok untuk software developer, insinyur IT, dan bidang kreatif.'
};

interface Props {
  data: ResumeData;
}

export default function MinimalisTeknologi({ data }: Props) {
  const contacts = [];
  if (data.profile.contact.website) contacts.push({ icon: Globe, text: data.profile.contact.website, url: data.profile.contact.website });
  if (data.profile.contact.email) contacts.push({ icon: Mail, text: data.profile.contact.email, url: `mailto:${data.profile.contact.email}` });
  if (data.profile.contact.phone) contacts.push({ icon: Phone, text: data.profile.contact.phone, url: `tel:${data.profile.contact.phone}` });
  if (data.profile.contact.location) contacts.push({ icon: MapPin, text: data.profile.contact.location, url: null });

  const skillsList = Object.entries(data.profile.skills || {}).map(([category, items]) => ({
    category,
    items
  }));

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
    <div style={themeStyle} className="bg-slate-200 min-h-screen py-10 flex justify-center items-start overflow-x-auto">
      {/* Resume Container (A4 Proportions) */}
      <div style={{ '--color-primary': theme.sidebarBg, '--color-primary-text': theme.sidebarText, '--color-accent': theme.accent, '--color-badge-bg': entityStyle.badgeBgColor || '#E0E7FF', '--color-badge-text': entityStyle.badgeTextColor || '#4F46E5', '--badge-radius': entityStyle.badgeBorderRadius || '4px' } as React.CSSProperties} className="w-[210mm] min-h-[297mm] bg-white shadow-2xl flex flex-row shrink-0 mx-auto box-border ring-1 ring-slate-900/5 transform origin-top md:scale-100 scale-75">
        
        {/* Left Sidebar (Primary Color Background) - 33% Width */}
        <div className="w-1/3 bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)] p-8 flex flex-col gap-8">
          
          {/* Header Profile Section */}
          <div className="flex flex-col items-center text-center">
            <img 
              src={data.profile.image || 'https://via.placeholder.com/150'} 
              alt={data.profile.name}
              className="w-40 h-40 object-cover rounded-full border-[6px] border-white shadow-xl rotate-3 mb-6"
            />
            <h1 className="text-3xl font-extrabold tracking-tight uppercase leading-none">{data.profile.name}</h1>
            <h2 className="text-lg font-semibold text-[var(--color-accent)] mt-2">{data.profile.headline}</h2>
          </div>

          {/* Contact Details */}
          <div className="border-b border-[var(--color-accent)]/60 pb-6 flex flex-col gap-3">
            {contacts.map((contact, idx) => {
              const Icon = contact.icon;
              return (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <Icon className="w-4 h-4 text-[var(--color-accent)] stroke-[2.5]" />
                {contact.url ? (
                  <a href={contact.url.startsWith('http') || contact.url.startsWith('mailto') || contact.url.startsWith('tel') ? contact.url : `https://${contact.url}`} className="hover:text-[var(--color-primary-text)] transition-colors">{contact.text}</a>
                ) : (
                  <span>{contact.text}</span>
                )}
              </div>
            )})}
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className="text-xl font-bold tracking-wide text-[var(--color-primary-text)] border-l-4 border-[var(--color-accent)] pl-3 mb-4 uppercase">
              Profil Eksekutif
            </h3>
            <p className="italic text-sm text-primary-50 leading-relaxed">
              {data.profile.summary}
            </p>
          </div>

          {/* Technical Skills */}
          {skillsList.length > 0 && (
            <div>
              <h3 className="text-xl font-bold tracking-wide text-[var(--color-primary-text)] border-l-4 border-[var(--color-accent)] pl-3 mb-5 uppercase">
                Keterampilan Teknis
              </h3>
              <div className="flex flex-col gap-4">
                {skillsList.map((skillGroup, idx) => (
                  <div key={idx}>
                    <h4 className="text-xs font-bold text-primary-200 mb-2 uppercase tracking-wide">
                      {skillGroup.category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skillGroup.items.map((item, idj) => (
                        <span 
                          key={idj} 
                          className="px-2.5 py-1 bg-[var(--color-primary)] text-primary-50 rounded-full text-[11px] font-medium tracking-wide shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages & Interests */}
          <div className="flex flex-col gap-6">
            {data.profile.languages && data.profile.languages.length > 0 && (
              <div>
                <h3 className="text-xl font-bold tracking-wide text-[var(--color-primary-text)] border-l-4 border-[var(--color-accent)] pl-3 mb-4 uppercase">
                  Bahasa
                </h3>
                <ul className="list-disc list-outside ml-4 flex flex-col gap-1 marker:text-[var(--color-accent)]">
                  {data.profile.languages.map((lang, idx) => (
                    <li key={idx} className="text-sm">
                      {lang}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.profile.interests && data.profile.interests.length > 0 && (
              <div>
                <h3 className="text-xl font-bold tracking-wide text-[var(--color-primary-text)] border-l-4 border-[var(--color-accent)] pl-3 mb-4 uppercase">
                  Ketertarikan
                </h3>
                <ul className="list-disc list-outside ml-4 flex flex-col gap-1 marker:text-[var(--color-accent)]">
                  {data.profile.interests.map((interest, idx) => (
                    <li key={idx} className="text-sm">
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Right Content Area (White Background) - ~66% Width */}
        <div className="flex-1 bg-white p-10 flex flex-col gap-9 text-slate-900">
          
          {/* Experience Section */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest relative inline-block mb-8">
                Riwayat Pengalaman
                <span className="absolute -bottom-1.5 left-0 w-1/2 h-1.5 bg-[var(--color-accent)]"></span>
              </h2>
              
              <div className="flex flex-col gap-7">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-[var(--color-accent)] before:absolute before:-left-[9px] before:top-1.5 before:w-4 before:h-4 before:bg-white before:border-4 before:border-[var(--color-accent)] before:rounded-full">
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <h4 className="text-[17px] font-bold text-slate-900 leading-tight">
                        {exp.title} <span className="font-medium text-[var(--color-accent)] select-none">&mdash;</span> <span className="inline-block" style={entityStyleCSS}>{exp.company}</span>
                      </h4>
                      <span className="shrink-0 px-3 py-1 bg-[var(--color-primary)] text-[var(--color-primary-text)] text-[11px] font-bold tracking-wider rounded uppercase shadow-sm">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="list-disc list-outside ml-4 marker:text-[var(--color-accent)] text-sm/relaxed text-slate-700 flex flex-col gap-1.5">
                      {exp.tasks.map((task, tidx) => (
                        <li key={tidx}><p>{task}</p></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest relative inline-block mb-8">
                Proyek Unggulan
                <span className="absolute -bottom-1.5 left-0 w-1/2 h-1.5 bg-[var(--color-accent)]"></span>
              </h2>

              <div className="grid grid-cols-2 gap-5">
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="flex flex-col border-[2px] border-dashed border-primary-300 rounded-xl overflow-hidden group hover:border-[var(--color-accent)] transition-colors">
                    {proj.image && (
                      <img src={proj.image} alt={proj.name} className="w-full h-28 object-cover border-b border-primary-100" />
                    )}
                    <div className="p-4 flex flex-col grow">
                      <h4 className="font-bold text-[15px] mb-1 text-slate-800">{proj.name}</h4>
                      <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold text-[var(--color-accent)] hover:text-[var(--color-accent)] mb-2 truncate break-all inline-block hover:underline">
                        🔗 {proj.url.replace(/^https?:\/\//, '')}
                      </a>
                      <p className="text-[13px] text-slate-600 leading-relaxed mb-4 grow">
                        {proj.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {proj.techStack.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-sm text-[10px] font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest relative inline-block mb-8">
                Pendidikan Formal
                <span className="absolute -bottom-1.5 left-0 w-1/2 h-1.5 bg-[var(--color-accent)]"></span>
              </h2>

              <div className="flex flex-col gap-4">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]"></div>
                    
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-0.5">{edu.degree}</h3>
                        <h3 className="text-sm font-semibold inline-block" style={entityStyleCSS}>{edu.campus}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="px-2.5 py-0.5 bg-[var(--color-primary)] text-[var(--color-primary-text)] text-[11px] font-bold rounded shadow-sm">
                          {edu.year}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[var(--color-accent)] text-[var(--color-primary-text)] text-[11px] font-bold rounded shadow-sm">
                          IPK: {edu.gpa}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Availability Status Card (Footer push down) */}
          {data.availability && (
            <section className="mt-auto pt-6">
              <div className="bg-amber-50/50 border-l-[6px] border-[var(--color-accent)] p-5 rounded-r-xl shadow-sm relative overflow-hidden">
                 {/* Decorative watermark / icon */}
                 <Lightbulb className="absolute -right-3 -bottom-3 text-[var(--color-accent)]/10 w-24 h-24 rotate-12" strokeWidth={1.5} />
                 
                 <div className="flex gap-4 items-center relative z-10">
                   <div className="bg-secondary-100 p-2.5 rounded-full shrink-0">
                     <UserCircle2 className="w-6 h-6 text-[var(--color-accent)]" />
                   </div>
                   <p className="text-[13.5px] italic text-slate-700 font-medium">
                     {data.availability}
                   </p>
                 </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
