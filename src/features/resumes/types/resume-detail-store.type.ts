import type { Resume } from '@/features/resumes/types/resume.type';

export type LoadResumeDetailOptions = {
  force?: boolean;
};

export type ResumeDetailStore = {
  resumeById: Record<string, Resume>;
  loadingById: Record<string, boolean>;
  errorById: Record<string, string | null>;
  loadResumeById: (
    id: string,
    options?: LoadResumeDetailOptions,
  ) => Promise<void>;
  setResumeDetail: (resume: Resume) => void;
  resetResumeDetail: (id: string) => void;
};