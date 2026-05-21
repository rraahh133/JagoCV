import React from 'react';
import { CvFormData } from '../types/document';
import { ResumeData } from '../types/resume.types';

export function mapCvToResumeData(cv: CvFormData, isPreview: boolean = false): ResumeData {
  const hasExperience = cv.experiences && cv.experiences.length > 0;
  const hasEducation = cv.educations && cv.educations.length > 0;

  // Helper to render soft-gray placeholder React element
  const placeholder = (text: string, styleExtra?: React.CSSProperties) => {
    return React.createElement('span', {
      style: {
        color: '#94a3b8',
        fontStyle: 'italic',
        fontWeight: 'normal',
        textTransform: 'none',
        opacity: 0.85,
        ...styleExtra
      }
    }, text) as any;
  };

  return {
    profile: {
      name: cv.fullName || (isPreview ? placeholder('Nama Lengkap Anda') : ''),
      headline: cv.targetRole || (isPreview ? placeholder('Peran Target Profesional') : ''),
      summary: cv.summary || (isPreview ? placeholder('Tulis ringkasan profesional singkat di sini untuk menyoroti keahlian, pengalaman, dan tujuan karir Anda...') : ''),
      image: cv.photoUrl || '',
      contact: {
        email: cv.email || (isPreview ? placeholder('email@domain.com') : ''),
        phone: cv.phone || (isPreview ? placeholder('+62 812 3456 7890') : ''),
        location: cv.location || (isPreview ? placeholder('Kota, Negara') : ''),
        website: cv.portfolio || cv.linkedin || (isPreview ? placeholder('linkedin.com/in/username') : '')
      },
      skills: {
        "Keahlian Utama": (() => {
          // Use technicalSkills array if available
          const techSkills = cv.technicalSkills || [];
          
          if (techSkills.length > 0) {
            return techSkills;
          }
          
          // Fall back to old format (comma-separated string)
          if (cv.skills) {
            return cv.skills.split(',').map(s => s.trim());
          }
          
          // Placeholder for preview
          return isPreview
            ? [
                placeholder('React'),
                placeholder('TypeScript'),
                placeholder('Node.js'),
                placeholder('UI/UX Design')
              ]
            : [];
        })()
      },
      languages: isPreview ? ['Indonesia (Native)', 'Inggris (Professional)'] : [],
      interests: isPreview ? ['Membaca', 'Teknologi', 'Olahraga'] : []
    },
    experience: hasExperience 
      ? cv.experiences!.map(exp => {
          const hasTitle = !!exp.title;
          const hasCompany = !!exp.company;
          const hasDates = !!exp.startDate || !!exp.endDate;
          const hasDesc = !!exp.description;

          return {
            title: exp.title || (isPreview ? placeholder('Posisi/Pekerjaan Anda') : ''),
            company: exp.company || (isPreview ? placeholder('Nama Perusahaan') : ''),
            period: hasDates
              ? `${exp.startDate || ''} - ${exp.isCurrent ? 'Sekarang' : (exp.endDate || '')}`
              : (isPreview ? placeholder('Mulai - Selesai') : ''),
            tasks: hasDesc
              ? exp.description!.split('\n').filter(Boolean)
              : (isPreview
                  ? [
                      placeholder('Deskripsi pencapaian dan tanggung jawab pekerjaan Anda di sini.'),
                      placeholder('Menyelesaikan proyek tepat waktu dengan kualitas tinggi.')
                    ]
                  : [])
          };
        })
      : (isPreview
          ? [
              {
                title: placeholder('Nama Posisi (Contoh: Software Engineer)'),
                company: placeholder('Nama Perusahaan / Organisasi'),
                period: placeholder('Mulai - Selesai (Contoh: 2022 - Sekarang)'),
                tasks: [
                  placeholder('Deskripsikan tanggung jawab utama Anda di posisi ini.'),
                  placeholder('Sebutkan pencapaian kunci yang terukur (misal: meningkatkan efisiensi sebesar 20%).')
                ]
              }
            ]
          : []),
    education: hasEducation
      ? cv.educations!.map(edu => {
          const hasDegree = !!edu.degree;
          const hasCampus = !!edu.institution;
          const hasYear = !!edu.startYear || !!edu.endYear;

          return {
            degree: hasDegree || edu.fieldOfStudy
              ? `${edu.degree || ''} ${edu.fieldOfStudy ? `dalam ${edu.fieldOfStudy}` : ''}`
              : (isPreview ? placeholder('Nama Gelar / Jurusan') : ''),
            campus: edu.institution || (isPreview ? placeholder('Nama Institusi / Universitas') : ''),
            year: hasYear
              ? `${edu.startYear || ''} - ${edu.endYear || ''}`
              : (isPreview ? placeholder('Tahun Masuk - Tahun Lulus') : ''),
            gpa: edu.gpa || (isPreview ? placeholder('3.50') : '')
          };
        })
      : (isPreview
          ? [
              {
                degree: placeholder('Nama Gelar / Jurusan (Contoh: S1 Teknik Informatika)'),
                campus: placeholder('Nama Institusi / Universitas'),
                year: placeholder('Tahun Masuk - Tahun Lulus (Contoh: 2018 - 2022)'),
                gpa: placeholder('3.50')
              }
            ]
          : []),
    projects: [], // Not available in CV Form
    design: {
      language: cv.language || 'id'
    } as any
  };
}
