import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { ResumeData } from '../../types/resume.types';

export const metadata = {
  name: 'ATS Compact (Generator)',
  desc: 'Format ATS padat dengan daftar keahlian multi-kolom dan hemat ruang.'
};

interface Props {
  data: ResumeData;
}

export default function AtsCompact({ data }: Props) {
  const p = data.profile;
  const c = p.contact;

  const hasExperience = data.experience && data.experience.length > 0;
  const hasEducation = data.education && data.education.length > 0;
  const hasProjects = data.projects && data.projects.length > 0;
  
  // Flatten skills into an array for 3-column list
  const allSkills = p.skills ? Object.values(p.skills).flat() : [];
  const hasSkills = allSkills.length > 0;

  // Bilingual translation
  const lang = data.design?.language === 'en' ? 'en' : 'id';
  const t = {
    id: {
      summary: 'Ringkasan Profesional',
      experience: 'Pengalaman Kerja',
      projects: 'Proyek Pilihan',
      education: 'Pendidikan',
      skills: 'Keterampilan Utama'
    },
    en: {
      summary: 'Professional Summary',
      experience: 'Work Experience',
      projects: 'Key Projects',
      education: 'Education',
      skills: 'Core Skills'
    }
  }[lang];

  return (
    <div className="w-full bg-white flex justify-center text-black">
      <div className="w-[794px] min-h-[1123px] bg-white text-black px-12 py-10 box-border shrink-0">
        
        {/* Header Section */}
        <header className="mb-4 text-center page-break-avoid">
          <h1 className="text-4xl font-extrabold uppercase mb-1 tracking-tight">
            {p.name || '[Nama Lengkap Anda]'}
          </h1>
          <h2 className="text-lg font-medium tracking-[0.2em] mb-4 uppercase text-neutral-800">
            {p.headline || '[Peran Target]'}
          </h2>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3 text-[9.5pt]">
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
        </header>

        <hr className="border-black border-[1.5px] mb-4" />

        {/* Summary Section */}
        {p.summary && (
          <section className="mb-5 page-break-avoid">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-full mb-2">
              {t.summary}
            </h3>
            <p className="italic text-justify text-[10pt] leading-relaxed">
              {p.summary}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {hasExperience && (
          <section className="mb-5">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-full mb-3">
              {t.experience}
            </h3>
            <div className="flex flex-col gap-4">
              {data.experience!.map((exp, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex justify-between items-end mb-0.5">
                    <span className="font-semibold text-[11pt]">
                      {exp.title}
                    </span>
                    <span className="text-[9.5pt]">
                      {exp.period}
                    </span>
                  </div>
                  <div className="font-bold text-[10pt] mb-1">
                    {exp.company}
                  </div>
                  {exp.tasks && exp.tasks.length > 0 && (
                    <div className="border-l border-neutral-300 ml-1 pl-4">
                      <ul className="list-disc text-[10pt] space-y-1">
                        {exp.tasks.map((task, i) => (
                          <li key={i} className="leading-relaxed">{task}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {hasProjects && (
          <section className="mb-5">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-full mb-3">
              {t.projects}
            </h3>
            <div className="flex flex-col gap-4">
              {data.projects!.map((proj, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex justify-between items-end mb-0.5">
                    <span className="font-semibold text-[11pt]">
                      {proj.name}
                      {proj.url && <span className="font-normal text-[9.5pt] ml-2 underline text-blue-700">{proj.url}</span>}
                    </span>
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[9.5pt] italic mb-1 text-neutral-700">
                      Stack: {proj.techStack.join(', ')}
                    </div>
                  )}
                  {proj.description && (
                    <div className="border-l border-neutral-300 ml-1 pl-4">
                      <p className="text-[10pt] leading-relaxed text-justify">
                        {proj.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {hasEducation && (
          <section className="mb-5">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-full mb-3">
              {t.education}
            </h3>
            <div className="flex flex-col gap-3">
              {data.education!.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start page-break-avoid">
                  <div>
                    <div className="font-bold text-[10.5pt]">
                      {edu.campus}
                    </div>
                    <div className="text-[10pt]">
                      {edu.degree} {edu.gpa && <span className="italic ml-1">(IPK: {edu.gpa})</span>}
                    </div>
                  </div>
                  <div className="text-[9.5pt]">
                    {edu.year}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {hasSkills && (
          <section className="page-break-avoid">
            <h3 className="text-sm font-bold uppercase text-black border-b border-black w-full mb-3">
              {t.skills}
            </h3>
            <ul className="text-[10pt] list-disc ml-4 columns-3 gap-6">
              {allSkills.map((skill, idx) => (
                <li key={idx} className="break-inside-avoid mb-1">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
}
