import type {
  Candidate,
  CreateCandidatePayload,
} from '@/features/candidates/types/candidate.type';

export interface UseCreateCandidateResult {
  isCreating: boolean;
  createNewCandidate: (payload: CreateCandidatePayload) => Promise<Candidate>;
}