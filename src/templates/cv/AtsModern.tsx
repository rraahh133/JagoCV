import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { ResumeData } from '../../types/resume.types';

export const metadata = {
  name: 'ATS Modern (Optimal)',
  desc: 'Format ATS bersih dengan sentuhan tipografi modern dan border aksen kiri.'
};

interface Props {
  data: ResumeData;
}

export default function AtsModern({ data }: Props) {
  // Ambil profil
  const p = data.profile;
  const c = p.contact;

  // Render lists dynamically
  const hasExperience = data.experience && data.experience.length > 0;
  const hasEducation = data.education && data.education.length > 0;
  const hasProjects = data.projects && data.projects.length > 0;
  const hasSkills = p.skills && Object.keys(p.skills).length > 0;

  // Bilingual translation
  const lang = data.design?.language === 'en' ? 'en' : 'id';
  const t = {
    id: {
      summary: 'Ringkasan Profesional',
      experience: 'Pengalaman Kerja',
      projects: 'Proyek Pilihan',
      education: 'Pendidikan',
      skills: 'Keahlian & Kompetensi'
    },
    en: {
      summary: 'Professional Summary',
      experience: 'Work Experience',
      projects: 'Projects',
      education: 'Education',
      skills: 'Skills & Competencies'
    }
  }[lang];

  return (
    <div className="w-full bg-white flex justify-center text-black">
      <div className="w-[794px] min-h-[1123px] bg-white text-black px-12 py-10 box-border shrink-0">
        
        {/* HEADER SECTION */}
        <header className="mb-6 page-break-avoid">
          <h1 className="text-4xl font-extrabold uppercase text-black mb-1">
            {p.name || '[Nama Lengkap Anda]'}
          </h1>
          <h2 className="text-sm font-medium tracking-[0.25em] text-black mb-4 uppercase">
            {p.headline || '[Peran / Target Posisi]'}
          </h2>
          
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-black items-center text-[10pt]">
            {c.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{c.email}</span>
              </div>
            )}
            {c.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{c.phone}</span>
              </div>
            )}
            {c.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{c.location}</span>
              </div>
            )}
            {c.website && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{c.website}</span>
              </div>
            )}
          </div>
          <hr className="mt-4 border-black border-[1.5px]" />
        </header>

        {/* SUMMARY SECTION */}
        {p.summary && (
          <section className="mb-6 page-break-avoid">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-fit mb-2 pb-0.5">
              {t.summary}
            </h3>
            <p className="text-[10.5pt] text-justify text-black leading-relaxed">
              {p.summary}
            </p>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {hasExperience && (
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-fit mb-4 pb-0.5">
              {t.experience}
            </h3>
            <div className="space-y-5 text-black">
              {data.experience!.map((exp, idx) => (
                <div key={idx} className="relative page-break-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-[11pt] font-semibold">{exp.title}</h4>
                    <span className="text-[9.5pt]">{exp.period}</span>
                  </div>
                  <div className="text-[10pt] font-bold mb-1.5">{exp.company}</div>
                  {exp.tasks && exp.tasks.length > 0 && (
                    <ul className="list-disc pl-6 border-l-2 border-neutral-300 ml-1 space-y-1 text-[10pt]">
                      {exp.tasks.map((task, i) => (
                        <li key={i} className="pl-1 leading-relaxed">{task}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {hasProjects && (
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-fit mb-4 pb-0.5">
              {t.projects}
            </h3>
            <div className="space-y-5 text-black">
              {data.projects!.map((proj, idx) => (
                <div key={idx} className="relative page-break-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-[11pt] font-semibold">
                      {proj.name}
                      {proj.url && (
                        <span className="font-normal text-[9.5pt] ml-2 text-blue-700 underline">
                          {proj.url}
                        </span>
                      )}
                    </h4>
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[9.5pt] italic mb-1.5 text-neutral-700">
                      Technologies: {proj.techStack.join(', ')}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-[10pt] leading-relaxed text-justify">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION SECTION */}
        {hasEducation && (
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-fit mb-4 pb-0.5">
              {t.education}
            </h3>
            <div className="space-y-4 text-black">
              {data.education!.map((edu, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-[11pt] font-bold">{edu.campus}</h4>
                    <span className="text-[9.5pt]">{edu.year}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="text-[10pt] text-black">{edu.degree}</p>
                    {edu.gpa && <span className="text-[9.5pt]">IPK: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {hasSkills && (
          <section className="page-break-avoid">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-fit mb-3 pb-0.5">
              {t.skills}
            </h3>
            <div className="flex flex-col gap-2 text-black text-[10pt]">
              {Object.entries(p.skills!).map(([category, items], idx) => (
                <div key={idx} className="flex items-start">
                  <span className="font-bold w-[120px] shrink-0">{category}:</span>
                  <span className="leading-relaxed">{items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
