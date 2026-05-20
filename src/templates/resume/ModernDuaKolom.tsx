import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { ResumeData } from '../../types/resume.types';

export const metadata = {
  name: 'Layout Modern Dua Kolom',
  desc: 'Bersih, profesional, dan efisien dengan pembagian kolom info pribadi & portofolio.'
};

interface Props {
  data: ResumeData;
}

export default function ModernDuaKolom({ data }: Props) {
  const contacts = [];
  if (data.profile.contact.website) contacts.push({ icon: Globe, value: data.profile.contact.website });
  if (data.profile.contact.email) contacts.push({ icon: Mail, value: data.profile.contact.email });
  if (data.profile.contact.phone) contacts.push({ icon: Phone, value: data.profile.contact.phone });
  if (data.profile.contact.location) contacts.push({ icon: MapPin, value: data.profile.contact.location });

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
    <div style={themeStyle} className="min-h-screen bg-slate-200 py-10 flex justify-center items-start overflow-auto">
      {/* Container A4 Page */}
      <div style={{ '--color-primary': theme.sidebarBg, '--color-primary-text': theme.sidebarText, '--color-accent': theme.accent, '--color-badge-bg': entityStyle.badgeBgColor || '#E0E7FF', '--color-badge-text': entityStyle.badgeTextColor || '#4F46E5', '--badge-radius': entityStyle.badgeBorderRadius || '4px', boxSizing: "border-box" } as React.CSSProperties} className="w-[210mm] min-h-[297mm] bg-white shadow-2xl flex flex-row overflow-hidden text-sm transform origin-top md:scale-100 scale-75"
      >
        {/* Konten Kiri (Sidebar) */}
        <aside className="w-1/3 bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)] p-8 flex flex-col gap-8">
          {/* Header Profile */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg transform rotate-3">
              <img
                src={data.profile.image || 'https://via.placeholder.com/150'}
                alt={data.profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-primary-text)] mb-1">
                {data.profile.name}
              </h1>
              <h2 className="text-[var(--color-accent)] font-medium tracking-wide">
                {data.profile.headline}
              </h2>
            </div>
          </div>

          {/* Contacts */}
          <div className="flex flex-col gap-3 pb-6 border-b border-[var(--color-accent)]/50">
            {contacts.map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <Icon className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                  <span className="text-primary-100">{contact.value}</span>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-[var(--color-primary-text)] uppercase tracking-wider border-b-2 border-[var(--color-accent)] inline-block w-max pb-1">
              Profil Profesional
            </h3>
            <p className="italic text-xs leading-relaxed text-primary-100">
              {data.profile.summary}
            </p>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-4 pt-2">
            <h3 className="text-lg font-bold text-[var(--color-primary-text)] uppercase tracking-wider border-b-2 border-[var(--color-accent)] pb-1">
              Keterampilan Teknis
            </h3>
            {Object.entries(data.profile.skills || {}).map(([category, items], idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold text-[var(--color-accent)]">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 bg-[var(--color-primary)] text-primary-100 text-[10px] font-medium rounded-full border border-[var(--color-accent)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Languages & Interests */}
          <div className="flex flex-col gap-4 pt-2 mt-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-[var(--color-primary-text)] uppercase tracking-wider border-b-2 border-[var(--color-accent)] pb-1">
                Bahasa
              </h3>
              <ul className="list-disc list-inside text-xs text-primary-100 space-y-1">
                {(data.profile.languages || []).map((lang, idx) => (
                  <li key={idx}>{lang}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-[var(--color-primary-text)] uppercase tracking-wider border-b-2 border-[var(--color-accent)] pb-1">
                Ketertarikan
              </h3>
              <ul className="list-disc list-inside text-xs text-primary-100 space-y-1">
                {(data.profile.interests || []).map((interest, idx) => (
                  <li key={idx}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Konten Kanan (Utama) */}
        <main className="w-2/3 bg-white text-slate-800 p-8 flex flex-col gap-8">
          {/* Pengalaman */}
          {data.experience && data.experience.length > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Pengalaman Kerja
                </h3>
              </div>
              <div className="flex flex-col gap-6 pl-2">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6">
                    <span className="absolute top-1.5 left-0 w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full ring-4 ring-primary-50"></span>
                    {idx !== data.experience.length - 1 && (
                      <span className="absolute top-4 left-1 w-0.5 h-[calc(100%+0.5rem)] bg-slate-200"></span>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 text-base leading-tight pr-4">
                        {exp.title} &mdash;{" "}
                        <span className="inline-block text-slate-600" style={entityStyleCSS}>
                          {exp.company}
                        </span>
                      </h4>
                      <span className="shrink-0 px-2.5 py-0.5 bg-[var(--color-accent)] text-[var(--color-primary-text)] text-[10px] font-bold rounded-sm shadow-sm whitespace-nowrap mt-0.5">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1.5 text-xs text-slate-600">
                      {exp.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="pl-1">
                          <p className="inline m-0 p-0 text-left">{task}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Proyek Unggulan */}
          {data.projects && data.projects.length > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col border-b-2 border-slate-100 pb-2">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Proyek Unggulan
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {data.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded-lg border-2 border-dashed border-primary-300 p-3 bg-primary-50/30 gap-2"
                  >
                    {project.image && (
                      <div className="h-24 w-full rounded-md overflow-hidden bg-slate-200">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">
                        {project.name}
                      </h4>
                      <span className="text-[10px] text-[var(--color-accent)] font-medium">
                        {project.url}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed text-left">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-auto pt-2">
                      {project.techStack.map((tech, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-1.5 py-0.5 bg-secondary-100 text-secondary-800 border border-secondary-200 text-[9px] font-semibold rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pendidikan */}
          {data.education && data.education.length > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col border-b-2 border-slate-100 pb-2">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Pendidikan
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-slate-900 text-base">
                        {edu.degree}
                      </h3>
                      <h3 className="text-slate-600 font-medium text-sm self-start inline-block" style={entityStyleCSS}>
                        {edu.campus}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 bg-primary-100 text-[var(--color-accent)] text-[10px] font-bold rounded-sm border border-primary-200">
                        {edu.year}
                      </span>
                      <span className="px-2 py-0.5 bg-[var(--color-primary)] text-[var(--color-primary-text)] text-[10px] font-bold rounded-sm shadow-sm">
                        IPK: {edu.gpa}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Availability Box */}
          {data.availability && (
            <section className="mt-auto">
              <div className="bg-slate-50 border-l-4 border-l-secondary-500 rounded-r-lg p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-secondary-100 rounded-bl-[100px] -mr-8 -mt-8 opacity-50"></div>
                <h4 className="font-bold text-slate-800 mb-1">
                  Ketersediaan Kerja
                </h4>
                <p className="text-xs text-slate-600 text-left">
                  {data.availability}
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
