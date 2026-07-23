import { apiClient, apiEndpoints } from '@/lib/api';
import type {
  ApiResponse,
  BulkOperationResultItem,
  PaginatedApiResponse,
  QueryParams,
} from '@/lib/api/api-types';

import type {
  Candidate,
  CandidateQuery,
  CreateCandidatePayload,
  DeleteCandidateResult,
  UpdateCandidatePayload,
} from '@/features/candidates/types/candidate.type';
import type { Resume } from '@/features/resumes/types/resume.type';

export async function createCandidate(
  payload: CreateCandidatePayload,
): Promise<Candidate> {
  const response = await apiClient.post<ApiResponse<Candidate>>(
    apiEndpoints.candidates.create,
    payload,
  );
  return response.data;
}

export async function getCandidates(
  query: CandidateQuery = {},
): Promise<PaginatedApiResponse<Candidate>> {
  return apiClient.get<PaginatedApiResponse<Candidate>>(
    apiEndpoints.candidates.list,
    { params: query as QueryParams },
  );
}

export async function getCandidateById(id: string): Promise<Candidate> {
  const response = await apiClient.get<ApiResponse<Candidate>>(
    apiEndpoints.candidates.detail(id),
  );
  return response.data;
}

export async function updateCandidate(
  id: string,
  payload: UpdateCandidatePayload,
): Promise<Candidate> {
  const response = await apiClient.patch<ApiResponse<Candidate>>(
    apiEndpoints.candidates.update(id),
    payload,
  );
  return response.data;
}

export async function deleteCandidate(id: string): Promise<DeleteCandidateResult> {
  const response = await apiClient.delete<ApiResponse<DeleteCandidateResult>>(
    apiEndpoints.candidates.delete(id),
  );
  return response.data;
}

export async function bulkDeleteCandidates(
  ids: string[],
): Promise<BulkOperationResultItem<DeleteCandidateResult>[]> {
  const response = await apiClient.post<ApiResponse<BulkOperationResultItem<DeleteCandidateResult>[]>>(
    apiEndpoints.candidates.bulkDelete,
    { ids },
  );
  return response.data;
}

export async function getCandidateResumesByCandidateId(
  candidateId: string,
): Promise<Resume[]> {
  const response = await apiClient.get<ApiResponse<Resume[]>>(
    apiEndpoints.candidates.resumes(candidateId),
  );
  return response.data;
}
