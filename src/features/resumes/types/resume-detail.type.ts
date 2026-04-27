import type { Resume } from '@/features/resumes/types/resume.type';

export type ResumeDetailState = {
  resume: Resume | null;
  isLoading: boolean;
  errorMessage: string | null;
  refetchResume: () => Promise<void>;
};