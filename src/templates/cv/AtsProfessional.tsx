import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { ResumeData } from '../../types/resume.types';

export const metadata = {
  name: 'ATS Professional',
  desc: 'Desain tradisional namun elegan dengan tipografi klasik dan tegas untuk level eksekutif.'
};

interface Props {
  data: ResumeData;
}

export default function AtsProfessional({ data }: Props) {
  const p = data.profile;
  const c = p.contact;

  const hasExperience = data.experience && data.experience.length > 0;
  const hasEducation = data.education && data.education.length > 0;
  const hasProjects = data.projects && data.projects.length > 0;
  
  // Flatten skills
  const allSkills = p.skills ? Object.values(p.skills).flat() : [];
  const hasSkills = allSkills.length > 0;

  // Bilingual translation
  const lang = data.design?.language === 'en' ? 'en' : 'id';
  const t = {
    id: {
      summary: 'Ringkasan Profesional',
      experience: 'Pengalaman Kerja',
      projects: 'Proyek & Portofolio',
      education: 'Pendidikan',
      skills: 'Keterampilan Teknis & Profesional'
    },
    en: {
      summary: 'Professional Summary',
      experience: 'Work Experience',
      projects: 'Projects & Portfolios',
      education: 'Education',
      skills: 'Technical & Professional Skills'
    }
  }[lang];

  return (
    <div className="w-full bg-white flex justify-center text-black">
      <div className="w-[794px] min-h-[1123px] bg-white text-black px-12 py-12 box-border shrink-0">
        
        {/* 1. Header Section */}
        <header className="mb-6 page-break-avoid">
          <h1 className="text-5xl font-extrabold uppercase leading-none mb-1 tracking-tight">
            {p.name || '[Nama Lengkap Anda]'}
          </h1>
          <p className="text-lg font-medium tracking-[0.3em] uppercase mb-4 text-neutral-800">
            {p.headline || '[Peran / Jabatan Target]'}
          </p>
          <div className="flex flex-wrap gap-y-2 gap-x-6 text-[10pt] mb-4">
            {c.email && (
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="stroke-[2]" />
                <span>{c.email}</span>
              </div>
            )}
            {c.phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={14} className="stroke-[2]" />
                <span>{c.phone}</span>
              </div>
            )}
            {c.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="stroke-[2]" />
                <span>{c.location}</span>
              </div>
            )}
            {c.website && (
              <div className="flex items-center gap-1.5">
                <Globe size={14} className="stroke-[2]" />
                <span>{c.website}</span>
              </div>
            )}
          </div>
          <div className="border-b-[1.5px] border-black w-full" />
        </header>

        {/* 2. Summary Section */}
        {p.summary && (
          <section className="mb-6 page-break-avoid">
            <h2 className="text-sm font-bold uppercase border-b border-black inline-block mb-2 pb-0.5 w-full">
              {t.summary}
            </h2>
            <p className="italic text-justify text-[10.5pt] leading-relaxed mt-1">
              {p.summary}
            </p>
          </section>
        )}

        {/* 3. Experience Section */}
        {hasExperience && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-black inline-block mb-3 pb-0.5 w-full">
              {t.experience}
            </h2>
            <div className="flex flex-col gap-4">
              {data.experience!.map((exp, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-[11.5pt] tracking-tight">
                      {exp.title}
                    </span>
                    <span className="text-[9.5pt]">
                      {exp.period}
                    </span>
                  </div>
                  <div className="font-bold text-[10pt] mb-2 text-neutral-800">
                    {exp.company}
                  </div>
                  {exp.tasks && exp.tasks.length > 0 && (
                    <ul className="text-[10pt] space-y-1 list-disc list-outside ml-4 text-justify">
                      {exp.tasks.map((task, i) => (
                        <li key={i} className="pl-1 leading-relaxed">
                          {task}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Projects Section */}
        {hasProjects && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-black inline-block mb-3 pb-0.5 w-full">
              {t.projects}
            </h2>
            <div className="flex flex-col gap-4">
              {data.projects!.map((proj, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-[11pt] tracking-tight">
                      {proj.name}
                    </span>
                    {proj.url && <span className="font-normal text-[9.5pt] ml-2 text-blue-700 underline">{proj.url}</span>}
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[9.5pt] italic mb-1.5 text-neutral-700">
                      Technologies used: {proj.techStack.join(', ')}
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

        {/* 5. Education Section */}
        {hasEducation && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-black inline-block mb-3 pb-0.5 w-full">
              {t.education}
            </h2>
            <div className="flex flex-col gap-4">
              {data.education!.map((edu, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-[10.5pt] tracking-tight">
                      {edu.campus}
                    </span>
                    <span className="text-[9.5pt]">
                      {edu.year}
                    </span>
                  </div>
                  <div className="text-[10pt]">
                    {edu.degree} {edu.gpa && <span className="italic">| IPK: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Technical Skills Section */}
        {hasSkills && (
          <section className="mt-2 page-break-avoid">
            <h2 className="text-sm font-bold uppercase border-b border-black inline-block mb-3 pb-0.5 w-full">
              {t.skills}
            </h2>
            <p className="text-[10pt] leading-relaxed">
              {allSkills.join(", ")}
            </p>
          </section>
        )}

      </div>
    </div>
  );
}
