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

export async function getCandidates(): Promise<Candidate[]> {
  const response = await apiClient.get<ApiResponse<Candidate[]>>('/candidates');

  return response.data;
}

export async function getCandidateById(id: string): Promise<Candidate> {
  const response = await apiClient.get<ApiResponse<Candidate>>(
    `/candidates/${id}`,
  );

  return response.data;
}