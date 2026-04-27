import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/lib/api/api-types';

import type {
  Candidate,
  CreateCandidatePayload,
} from '@/features/candidates/types/candidate.type';

export async function createCandidate(
  payload: CreateCandidatePayload,
): Promise<Candidate> {
  const response = await apiClient.post<ApiResponse<Candidate>>(
    '/candidates',
    payload,
  );

  return response.data;
}