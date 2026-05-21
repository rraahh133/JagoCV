import type { DocType } from './enums';

// ===================================================================
// CV (ATS) FORM DATA
// ===================================================================

export interface CvFormData {
  fullName: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  experiences: WorkExperience[];
  educations: Education[];
  skills: string;
  technicalSkills?: string[];
  softSkills?: string[];
  photoUrl?: string;
  language?: 'id' | 'en';
}

// ===================================================================
// VISUAL RESUME FORM DATA
// ===================================================================

export interface ResumeFormData {
  displayName: string;
  headline: string;
  websiteUrl: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  technicalSkills: string;
  softSkills: SoftSkill[];
  experiences: WorkExperience[];
  educations: Education[];
  projects: Project[];
  languages: string;
  hobbies: string;
}

// ===================================================================
// WEB PORTFOLIO FORM DATA
// ===================================================================

export interface PortfolioFormData {
  customLink: string;
  profileTitle: string;
  location: string;
  accentEmoji: string;
  shortBio: string;
  aboutMe: string;
  links: PortfolioLink[];
  projects: Project[];
  experiences: WorkExperience[];
  skills: string;
  accentColor: string;
  fontFamily: string;
}

// ===================================================================
// SHARED SUB-MODELS
// ===================================================================

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  imageUrl?: string;
}

export interface SoftSkill {
  id: string;
  name: string;
  level: number; // 0-100
}

export interface PortfolioLink {
  id: string;
  title: string;
  url: string;
}

// ===================================================================
// DOCUMENT SAVE PAYLOAD
// ===================================================================

export interface SaveDocumentPayload {
  title: string;
  type: DocType;
  content?: Record<string, unknown>;
  status?: string;
  templateId?: string;
  fontFamily?: string;
  themeColor?: string;
}

// ===================================================================
// HELPERS
// ===================================================================

/** Buat ID unik sederhana untuk form items */
export function createId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/** Buat WorkExperience kosong */
export function createEmptyExperience(): WorkExperience {
  return {
    id: createId(),
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  };
}

/** Buat Education kosong */
export function createEmptyEducation(): Education {
  return {
    id: createId(),
    degree: '',
    institution: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
  };
}

/** Buat Project kosong */
export function createEmptyProject(): Project {
  return {
    id: createId(),
    name: '',
    url: '',
    description: '',
  };
}

/** Buat SoftSkill kosong */
export function createEmptySoftSkill(): SoftSkill {
  return {
    id: createId(),
    name: '',
    level: 50,
  };
}

/** Buat PortfolioLink kosong */
export function createEmptyLink(): PortfolioLink {
  return {
    id: createId(),
    title: '',
    url: '',
  };
}
