import type { Candidate } from '@/features/candidates/types/candidate.type';

export type CandidateDetailState = {
  candidate: Candidate | null;
  isLoading: boolean;
  errorMessage: string | null;
  refetchCandidate: () => Promise<void>;
};