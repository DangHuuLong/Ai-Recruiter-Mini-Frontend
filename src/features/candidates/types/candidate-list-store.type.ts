import type { Candidate } from '@/features/candidates/types/candidate.type';

export type LoadCandidatesOptions = {
  force?: boolean;
};

export type CandidateListStore = {
  candidates: Candidate[];
  hasLoaded: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  loadCandidates: (options?: LoadCandidatesOptions) => Promise<void>;
  setCandidates: (candidates: Candidate[]) => void;
  resetCandidates: () => void;
};