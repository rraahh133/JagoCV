import { ResumeData } from '../types/resume.types';

interface Props {
  templateId: string;
  data: ResumeData;
  fontFamily?: string;
}

// Dynamically scan and import all templates (eager loading for reliability)
const resumeTemplates = (import.meta as any).glob('../templates/resume/*.tsx', { eager: true });
const cvAtsTemplates = (import.meta as any).glob('../templates/cv/*.tsx', { eager: true });

// Backward compatibility map for old hardcoded layout IDs stored in DB
const oldIdMap: Record<string, string> = {
  'a4-react-resume': 'ModernMinimalis',
  'cv-a4-satu-halaman': 'KreatifSatuHalaman',
  'single-page-resume': 'ModernDuaKolom',
  'a4-single-page-resume': 'MinimalisTeknologi',
  'a4-web-resume': 'KreatifHeaderTebal',
  'one-page-cv': 'KlasikRamahAts',
  'modern-interactive-resume': 'CorporateElegan',
  'modern-ats': 'AtsCompact',
};

import A4Paginator from './A4Paginator';

export default function ResumeViewer({ templateId, data, fontFamily }: Props) {
  // Deep clone and clean experience tasks to avoid double bullet points in lists
  const cleanedData = {
    ...data,
    experience: data.experience?.map(exp => ({
      ...exp,
      tasks: exp.tasks?.map(task => typeof task === 'string' ? task.replace(/^[•\-\*\s]+/, '') : task) || []
    })) || [],
    education: data.education?.map(edu => ({
      ...edu,
      degree: typeof edu.degree === 'string' ? edu.degree.replace(/\s*@\s*/g, ' ').trim() : edu.degree,
      campus: typeof edu.campus === 'string' ? edu.campus.replace(/\s*@\s*/g, ' ').trim() : edu.campus
    })) || []
  };

  // Resolve template name (handles old IDs and new IDs)
  const resolvedName = oldIdMap[templateId] || templateId;

  const resumePath = `../templates/resume/${resolvedName}.tsx`;
  const cvPath = `../templates/cv/${resolvedName}.tsx`;

  let module: any = null;
  if (resumeTemplates[resumePath]) {
    module = resumeTemplates[resumePath];
  } else if (cvAtsTemplates[cvPath]) {
    module = cvAtsTemplates[cvPath];
  } else {
    // Default fallback
    module = cvAtsTemplates['../templates/cv/AtsCompact.tsx'] || resumeTemplates['../templates/resume/ModernMinimalis.tsx'];
  }

  if (module && module.default) {
    const TemplateComponent = module.default;
    // Always activate A4Paginator — resume templates also need multi-page support
    return (
      <div style={{ fontFamily: fontFamily || 'Inter, sans-serif' }} className="w-full">
        <A4Paginator active={true}>
          <TemplateComponent data={cleanedData} />
        </A4Paginator>
      </div>
    );
  }

  return (
    <div className="p-12 text-center text-rose-500 font-bold">
      Template "{templateId}" tidak ditemukan.
    </div>
  );
}
