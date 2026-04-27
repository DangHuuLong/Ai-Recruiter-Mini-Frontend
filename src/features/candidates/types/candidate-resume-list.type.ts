import type { Resume } from '@/features/resumes/types/resume.type';

export type CandidateResumeListState = {
  resumes: Resume[];
  isLoading: boolean;
  errorMessage: string | null;
  refetchResumes: () => Promise<void>;
};