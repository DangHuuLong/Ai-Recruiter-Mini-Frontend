import type { Candidate } from '@/features/candidates/types/candidate.type';

export type CandidateListState = {
  candidates: Candidate[];
  isLoading: boolean;
  errorMessage: string | null;
  refetchCandidates: () => Promise<void>;
};