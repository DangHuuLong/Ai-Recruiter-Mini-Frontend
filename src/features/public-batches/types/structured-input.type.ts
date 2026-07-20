// Mirrors ResumeStructuredInputDto / JobDescriptionStructuredInputDto in
// Ai-Recruiter-Mini-Backend (src/modules/scoring-batches/dto/) field-for-field.

export type ResumePersonal = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
};

export type ResumeSkill = {
  name: string;
  category: string;
  level: string;
  evidence: string;
};

export type ResumeEducation = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  gpa: string;
  gpaScale: string;
  description: string;
};

export type ResumeExperience = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  durationMonths: string;
  responsibilities: string[];
  technologies: string[];
};

export type ResumeProject = {
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  urls: string[];
};

export type ResumeCertification = {
  name: string;
  issuer: string;
  issuedYear: string;
  url: string;
};

export type ResumeAchievement = {
  title: string;
  description: string;
  year: string;
};

export type ResumeLanguage = {
  name: string;
  proficiency: string;
};

export type ResumeStructuredValues = {
  label: string;
  personal: ResumePersonal;
  summary: string;
  skills: ResumeSkill[];
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];
  languages: ResumeLanguage[];
};

export const EMPTY_RESUME_STRUCTURED: ResumeStructuredValues = {
  label: '',
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
  },
  summary: '',
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
};

export const EMPTY_RESUME_SKILL: ResumeSkill = { name: '', category: '', level: '', evidence: '' };
export const EMPTY_RESUME_EDUCATION: ResumeEducation = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startYear: '',
  endYear: '',
  gpa: '',
  gpaScale: '',
  description: '',
};
export const EMPTY_RESUME_EXPERIENCE: ResumeExperience = {
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  durationMonths: '',
  responsibilities: [],
  technologies: [],
};
export const EMPTY_RESUME_PROJECT: ResumeProject = {
  name: '',
  role: '',
  startDate: '',
  endDate: '',
  description: '',
  technologies: [],
  urls: [],
};
export const EMPTY_RESUME_CERTIFICATION: ResumeCertification = {
  name: '',
  issuer: '',
  issuedYear: '',
  url: '',
};
export const EMPTY_RESUME_ACHIEVEMENT: ResumeAchievement = { title: '', description: '', year: '' };
export const EMPTY_RESUME_LANGUAGE: ResumeLanguage = { name: '', proficiency: '' };

export type JobDescriptionSkill = {
  name: string;
  isCore: boolean;
  weightHint: string;
};

export type JobDescriptionStructuredValues = {
  label: string;
  title: string;
  seniority: string;
  employmentType: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  requiredSkills: JobDescriptionSkill[];
  preferredSkills: JobDescriptionSkill[];
  minExperienceYears: string;
  educationRequirement: string;
  domainKeywords: string[];
};

export const EMPTY_JD_STRUCTURED: JobDescriptionStructuredValues = {
  label: '',
  title: '',
  seniority: '',
  employmentType: '',
  responsibilities: [],
  requirements: [],
  niceToHave: [],
  requiredSkills: [],
  preferredSkills: [],
  minExperienceYears: '',
  educationRequirement: '',
  domainKeywords: [],
};

export const EMPTY_JD_SKILL: JobDescriptionSkill = { name: '', isCore: false, weightHint: '' };
