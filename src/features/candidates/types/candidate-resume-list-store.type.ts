import type { Resume } from '@/features/resumes/types/resume.type';

export type LoadCandidateResumesOptions = {
  force?: boolean;
};

export type CandidateResumeListStore = {
  resumesByCandidateId: Record<string, Resume[]>;
  loadingByCandidateId: Record<string, boolean>;
  errorByCandidateId: Record<string, string | null>;
  loadCandidateResumes: (
    candidateId: string,
    options?: LoadCandidateResumesOptions,
  ) => Promise<void>;
  setCandidateResumes: (candidateId: string, resumes: Resume[]) => void;
  resetCandidateResumes: (candidateId: string) => void;
};