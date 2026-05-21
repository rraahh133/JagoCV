import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import { ResumeData } from '../../types/resume.types';

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-[0.875rem] font-bold uppercase border-b border-black block pb-1 text-black">
        {title}
      </h2>
    </div>
  );
}

interface Props {
  data: ResumeData;
}

export default function AtsStandard({ data }: Props) {
  const contacts = [];
  if (data.profile.contact.email) contacts.push({ icon: <Mail size={14} />, text: data.profile.contact.email });
  if (data.profile.contact.phone) contacts.push({ icon: <Phone size={14} />, text: data.profile.contact.phone });
  if (data.profile.contact.location) contacts.push({ icon: <MapPin size={14} />, text: data.profile.contact.location });
  if (data.profile.contact.website) contacts.push({ icon: <Globe size={14} />, text: data.profile.contact.website });

  // Bilingual translation
  const lang = data.design?.language === 'en' ? 'en' : 'id';
  const t = {
    id: {
      summary: 'Ringkasan Profesional',
      experience: 'Pengalaman Kerja',
      projects: 'Proyek Pilihan',
      education: 'Pendidikan',
      skills: 'Keterampilan Teknis'
    },
    en: {
      summary: 'Professional Summary',
      experience: 'Work Experience',
      projects: 'Projects',
      education: 'Education',
      skills: 'Technical Skills'
    }
  }[lang];

  return (
    <div className="w-full bg-white flex justify-center text-black">
      <div className="w-[794px] min-h-[1123px] bg-white text-black box-border px-10 py-12 shrink-0">
        {/* Header Section */}
        <header className="mb-4 page-break-avoid">
          <h1 className="text-4xl font-extrabold uppercase leading-tight text-black mb-1">
            {data.profile.name}
          </h1>
          <p className="text-lg font-medium tracking-[0.25em] text-black uppercase mt-1 mb-3">
            {data.profile.headline}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10pt] text-black items-center mb-4">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {contact.icon}
                <span>{contact.text}</span>
              </div>
            ))}
          </div>
          <hr className="border-t-[1.5px] border-black my-4" />
        </header>

        {/* Summary Section */}
        {data.profile.summary && (
          <section className="mb-6 page-break-avoid">
            <SectionTitle title={t.summary} />
            <p className="italic text-justify text-[10.5pt] leading-relaxed text-black">
              {data.profile.summary}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-6">
            <SectionTitle title={t.experience} />
            <div className="flex flex-col gap-4">
              {data.experience.map((exp, index) => (
                <div key={index} className="page-break-avoid">
                  <div className="flex justify-between items-end mb-0.5">
                    <h3 className="font-semibold text-[11pt] text-black">
                      {exp.title}
                    </h3>
                    <span className="text-[9pt] font-medium uppercase text-black">{exp.period}</span>
                  </div>
                  <div className="font-bold text-[10pt] text-black mb-2">
                    {exp.company}
                  </div>
                  <div className="pl-4 ml-1 border-l border-neutral-300">
                    <ul className="list-disc list-outside ml-3 flex flex-col space-y-1 text-[10pt] text-black">
                      {exp.tasks.map((desc, i) => (
                        <li key={i} className="pl-1 text-justify">
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <section className="mb-6">
            <SectionTitle title={t.education} />
            <div className="flex flex-col gap-4">
              {data.education.map((edu, index) => (
                <div key={index} className="page-break-avoid">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-[10pt] text-black">
                      {edu.campus}
                    </h3>
                    <span className="text-[10pt] font-medium text-black">{edu.year}</span>
                  </div>
                  <div className="text-[10pt] text-black">{edu.degree}</div>
                  {edu.gpa && <div className="text-[10pt] text-black italic">IPK: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.profile.skills && Object.keys(data.profile.skills).length > 0 && (
          <section className="mb-6 page-break-avoid">
            <SectionTitle title={t.skills} />
            <div className="text-[10.5pt] text-black">
               <ul className="list-disc list-outside ml-4 space-y-1">
                 {Object.entries(data.profile.skills).map(([category, items]) => (
                   <li key={category}>
                     <span className="font-bold">{category}:</span> {items.join(', ')}
                   </li>
                 ))}
               </ul>
             </div>
          </section>
        )}
        
      </div>
    </div>
  );
}
