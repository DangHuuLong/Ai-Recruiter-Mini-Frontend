import type { Candidate } from '@/features/candidates/types/candidate.type';

export type LoadCandidateDetailOptions = {
  force?: boolean;
};

export type CandidateDetailStore = {
  candidateById: Record<string, Candidate>;
  loadingById: Record<string, boolean>;
  errorById: Record<string, string | null>;
  loadCandidateById: (
    id: string,
    options?: LoadCandidateDetailOptions,
  ) => Promise<void>;
  setCandidateDetail: (candidate: Candidate) => void;
  resetCandidateDetail: (id: string) => void;
};