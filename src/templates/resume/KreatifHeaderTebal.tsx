import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { ResumeData } from '../../types/resume.types';

export const metadata = {
  name: 'Layout Modern Web/Creative',
  desc: 'Tata letak modern dengan visual header tebal & dinamis.'
};

interface Props {
  data: ResumeData;
}

export default function KreatifHeaderTebal({ data }: Props) {
  const contacts = [];
  if (data.profile.contact.website) contacts.push({ icon: Globe, value: data.profile.contact.website });
  if (data.profile.contact.email) contacts.push({ icon: Mail, value: data.profile.contact.email });
  if (data.profile.contact.phone) contacts.push({ icon: Phone, value: data.profile.contact.phone });
  if (data.profile.contact.location) contacts.push({ icon: MapPin, value: data.profile.contact.location });
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
    <div style={themeStyle} className="min-h-screen bg-slate-200 py-10 flex justify-center items-start overflow-auto">
      {/* 
        Kertas Resume A4
        Menggunakan dimensi persis: 210mm x 297mm 
        Tanpa overflow scroll internal untuk mensimulasikan dokumen kaku/cetakan
      */}
      <div style={{ '--color-primary': theme.sidebarBg, '--color-primary-text': theme.sidebarText, '--color-accent': theme.accent, '--color-badge-bg': entityStyle.badgeBgColor || '#E0E7FF', '--color-badge-text': entityStyle.badgeTextColor || '#4F46E5', '--badge-radius': entityStyle.badgeBorderRadius || '4px' } as React.CSSProperties} className="w-[210mm] min-h-[297mm] bg-white shadow-2xl flex flex-row shrink-0 mx-auto overflow-hidden transform origin-top md:scale-100 scale-75">
        
        {/* Kolom Kiri: Sidebar */}
        <aside className="w-[33%] bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)] flex flex-col pt-10 pb-8 px-6">
          {/* Bagian Area Profil */}
          <div className="flex justify-center mb-5 mt-2">
            <img
              src={data.profile.image || 'https://via.placeholder.com/150'}
              alt={`Foto profil dari ${data.profile.name}`}
              className="w-32 h-32 rounded-full border-4 border-white rotate-3 object-cover shadow-lg"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight mb-1">{data.profile.name}</h1>
            <h2 className="text-sm font-medium text-[var(--color-accent)]">{data.profile.headline}</h2>
          </div>

          {/* Bagian Area Kontak */}
          <div className="space-y-3 border-b border-[var(--color-accent)] pb-5 mb-6 mt-6 text-xs text-primary-50">
            {contacts.map((contact, idx) => {
              const Icon = contact.icon;
              return (
              <div key={idx} className="flex items-center gap-3">
                <Icon size={15} className="text-[var(--color-accent)] shrink-0" />
                <span>{contact.value}</span>
              </div>
            )})}
          </div>

          {/* Bagian Ringkasan Profil */}
          <div className="mb-6">
            <h3 className="text-[13px] font-bold uppercase tracking-widest mb-2.5 text-primary-200">
              Ringkasan Profil
            </h3>
            <p className="text-xs italic text-primary-50 leading-relaxed">
              {data.profile.summary}
            </p>
          </div>

          {/* Bagian Keterampilan Teknis */}
          {skillsList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[13px] font-bold uppercase tracking-widest mb-3.5 text-primary-200">
                Keterampilan Teknis
              </h3>
              <div className="space-y-3.5">
                {skillsList.map((group) => (
                  <div key={group.category}>
                    <h4 className="text-[11px] font-semibold text-[var(--color-accent)] mb-1.5 leading-none">
                      {group.category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 bg-[var(--color-primary)] text-primary-50 border border-[var(--color-accent)] rounded-full text-[10px] whitespace-nowrap shadow-sm"
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

          {/* Bagian Bahasa & Ketertarikan */}
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-widest mb-2 text-primary-200">
              Bahasa & Ketertarikan
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-primary-50 mb-3">
              {(data.profile.languages || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <ul className="list-disc list-inside space-y-1 text-xs text-primary-50">
              {(data.profile.interests || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Kolom Kanan: Konten Utama */}
        <main className="w-[67%] bg-white text-gray-900 pt-10 pb-8 px-8 flex flex-col shrink-0">
          
          {/* Bagian Pengalaman Profesional */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-7">
              <h2 className="text-lg font-bold uppercase tracking-widest text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] pb-1 mb-5 inline-block">
                Pengalaman Profesional
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-primary-300 text-sm">
                    
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">
                        {exp.title} <span className="font-normal text-[var(--color-accent)] px-1">&mdash;</span> <span className="inline-block" style={entityStyleCSS}>{exp.company}</span>
                      </h4>
                      <span className="bg-[var(--color-primary)] text-[var(--color-primary-text)] px-2 py-0.5 rounded text-[11px] shrink-0 font-semibold shadow-sm ml-2">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-2 space-y-1.5 text-[13px] text-gray-700">
                      {exp.tasks.map((resp, i) => (
                        <li key={i} className="pl-1 leading-relaxed">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bagian Proyek Unggulan */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-widest text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] pb-1 mb-5 inline-block">
                Proyek Unggulan
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-dashed border-primary-300 rounded-[8px] p-3.5 flex flex-col bg-slate-50 relative group"
                  >
                    <h4 className="font-bold text-[var(--color-accent)] text-sm mb-0.5 leading-tight">{proj.name}</h4>
                    <a
                      href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[var(--color-accent)] hover:text-secondary-700 underline mb-2.5 break-all inline-block font-medium"
                    >
                      {proj.url.replace(/^https?:\/\//, '')}
                    </a>
                    <p className="text-[12px] text-gray-700 mb-3.5 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1">
                      {proj.techStack.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 bg-white text-secondary-800 border border-secondary-200 rounded text-[10px] font-bold shadow-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bagian Pendidikan */}
          {data.education && data.education.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold uppercase tracking-widest text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] pb-1 mb-5 inline-block">
                Pendidikan
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-primary-300 text-sm">
                    
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">
                        {edu.degree} <span className="font-normal text-[var(--color-accent)] px-1">&mdash;</span> <span className="inline-block" style={entityStyleCSS}>{edu.campus}</span>
                      </h3>
                      <div className="flex items-center gap-1.5 ml-3">
                        <span className="bg-[var(--color-primary)] text-[var(--color-primary-text)] px-2 py-0.5 rounded text-[11px] shrink-0 font-semibold shadow-sm">
                          {edu.year}
                        </span>
                        <span className="bg-[var(--color-primary)] text-[var(--color-primary-text)] px-2 py-0.5 rounded text-[11px] shrink-0 font-semibold shadow-sm">
                          {edu.gpa}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Kartu Ketersediaan Kerja */}
          {data.availability && (
            <aside className="mt-auto border-l-4 border-[var(--color-accent)] bg-secondary-50 p-4 rounded-r shadow-sm">
              <p className="text-[13px] font-medium text-gray-800 leading-relaxed italic">
                {data.availability}
              </p>
            </aside>
          )}
          
        </main>
      </div>
    </div>
  );
}
