// Static-UI review phase — API calls below are commented out and replaced with mock
// data so screens can be reviewed without a live backend. See
// src/features/candidates/mock/candidate-mock-data.ts for the dataset. To restore real
// integration, uncomment the `apiClient` call in each function and remove the mock block.
// apiClient/apiEndpoints kept imported so the commented-out real calls below still
// resolve at a glance — re-enable by uncommenting, no import changes needed.
import { apiClient, apiEndpoints } from '@/lib/api';
import type { BulkOperationResultItem, PaginatedApiResponse } from '@/lib/api/api-types';

import type {
  Candidate,
  CandidateQuery,
  CreateCandidatePayload,
  DeleteCandidateResult,
  UpdateCandidatePayload,
} from '@/features/candidates/types/candidate.type';
import {
  findMockCandidateIndex,
  MOCK_CANDIDATES,
  nextMockCandidateId,
} from '@/features/candidates/mock/candidate-mock-data';
import { MOCK_RESUMES } from '@/features/resumes/mock/resume-mock-data';
import type { Resume } from '@/features/resumes/types/resume.type';
import { mockDelay, paginateMock, sortMock } from '@/lib/utils/mock-delay';

export async function createCandidate(
  payload: CreateCandidatePayload,
): Promise<Candidate> {
  // const response = await apiClient.post<ApiResponse<Candidate>>(
  //   apiEndpoints.candidates.create,
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  const now = new Date().toISOString();
  const candidate: Candidate = {
    id: nextMockCandidateId(),
    fullName: payload.fullName,
    primaryEmail: payload.primaryEmail ?? null,
    primaryPhone: payload.primaryPhone ?? null,
    linkedinUrl: payload.linkedinUrl ?? null,
    githubUrl: payload.githubUrl ?? null,
    portfolioUrl: payload.portfolioUrl ?? null,
    location: payload.location ?? null,
    normalizedProfile: null,
    identityConfidence: null,
    createdAt: now,
    updatedAt: now,
  };
  MOCK_CANDIDATES.unshift(candidate);
  return candidate;
}

export async function getCandidates(
  query: CandidateQuery = {},
): Promise<PaginatedApiResponse<Candidate>> {
  // return apiClient.get<PaginatedApiResponse<Candidate>>(
  //   apiEndpoints.candidates.list,
  //   { params: query as QueryParams },
  // );

  await mockDelay();
  const search = query.search?.trim().toLowerCase();
  const filtered = search
    ? MOCK_CANDIDATES.filter((candidate) =>
        [candidate.fullName, candidate.primaryEmail, candidate.primaryPhone, candidate.location]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(search)),
      )
    : MOCK_CANDIDATES;
  const sorted = sortMock(filtered, query.sortBy, query.sortOrder);
  const { data, meta } = paginateMock(sorted, query.page, query.limit);
  return { success: true, message: 'Candidates fetched successfully (mock)', data, meta };
}

export async function getCandidateById(id: string): Promise<Candidate> {
  // const response = await apiClient.get<ApiResponse<Candidate>>(
  //   apiEndpoints.candidates.detail(id),
  // );
  // return response.data;

  await mockDelay();
  const candidate = MOCK_CANDIDATES.find((item) => item.id === id);
  if (!candidate) throw new Error('Candidate not found');
  return candidate;
}

export async function updateCandidate(
  id: string,
  payload: UpdateCandidatePayload,
): Promise<Candidate> {
  // const response = await apiClient.patch<ApiResponse<Candidate>>(
  //   apiEndpoints.candidates.update(id),
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  const index = findMockCandidateIndex(id);
  if (index === -1) throw new Error('Candidate not found');
  const updated: Candidate = {
    ...MOCK_CANDIDATES[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  MOCK_CANDIDATES[index] = updated;
  return updated;
}

export async function deleteCandidate(id: string): Promise<DeleteCandidateResult> {
  // const response = await apiClient.delete<ApiResponse<DeleteCandidateResult>>(
  //   apiEndpoints.candidates.delete(id),
  // );
  // return response.data;

  await mockDelay();
  const index = findMockCandidateIndex(id);
  if (index !== -1) MOCK_CANDIDATES.splice(index, 1);
  return { id, deleted: true };
}

export async function bulkDeleteCandidates(
  ids: string[],
): Promise<BulkOperationResultItem<DeleteCandidateResult>[]> {
  // const response = await apiClient.post<ApiResponse<BulkOperationResultItem<DeleteCandidateResult>[]>>(
  //   apiEndpoints.candidates.bulkDelete,
  //   { ids },
  // );
  // return response.data;

  await mockDelay();
  return ids.map((id) => {
    const index = findMockCandidateIndex(id);
    if (index === -1) {
      return { id, success: false, error: 'Candidate not found' };
    }
    MOCK_CANDIDATES.splice(index, 1);
    return { id, success: true, data: { id, deleted: true } };
  });
}

export async function getCandidateResumesByCandidateId(
  candidateId: string,
): Promise<Resume[]> {
  // const response = await apiClient.get<ApiResponse<Resume[]>>(
  //   `/candidates/${candidateId}/resumes`,
  // );
  // return response.data;

  await mockDelay();
  return MOCK_RESUMES.filter((resume) => resume.candidateId === candidateId);
}
