// Static-UI review phase — API calls below are commented out and replaced with mock
// data so screens can be reviewed without a live backend. See
// src/features/resumes/mock/resume-mock-data.ts for the dataset. To restore real
// integration, uncomment the `apiClient` call in each function and remove the mock block.
// apiClient/apiEndpoints kept imported so the commented-out real calls still resolve at
// a glance — re-enable by uncommenting, no import changes needed.
import { apiClient, apiEndpoints } from '@/lib/api';
import type { PaginatedApiResponse } from '@/lib/api';

import { MOCK_CANDIDATES } from '@/features/candidates/mock/candidate-mock-data';
import {
  findMockResumeIndex,
  MOCK_RESUMES,
  nextMockResumeId,
} from '@/features/resumes/mock/resume-mock-data';
import { mockDelay, paginateMock, sortMock } from '@/lib/utils/mock-delay';
import type {
  CreateResumePayload,
  DeleteResumeResult,
  Resume,
  ResumeQuery,
  UpdateResumePayload,
} from '../types/resume.type';

export async function getResumes(
  query: ResumeQuery = {},
): Promise<PaginatedApiResponse<Resume>> {
  // return apiClient.get<PaginatedApiResponse<Resume>>(apiEndpoints.resumes.list, {
  //   params: query as QueryParams,
  // });

  await mockDelay();
  const search = query.search?.trim().toLowerCase();
  let filtered = query.candidateId
    ? MOCK_RESUMES.filter((resume) => resume.candidateId === query.candidateId)
    : MOCK_RESUMES;
  if (query.parseStatus) {
    filtered = filtered.filter((resume) => resume.parseStatus === query.parseStatus);
  }
  if (search) {
    filtered = filtered.filter((resume) =>
      [resume.fileAsset?.fileName, resume.candidateId].filter(Boolean).some((field) =>
        field!.toLowerCase().includes(search),
      ),
    );
  }
  const sorted = sortMock(filtered, query.sortBy, query.sortOrder);
  const { data, meta } = paginateMock(sorted, query.page, query.limit);
  return { success: true, message: 'Resumes fetched successfully (mock)', data, meta };
}

export async function createResume(payload: CreateResumePayload): Promise<Resume> {
  // const response = await apiClient.post<ApiResponse<Resume>>('/resumes', payload);
  // return response.data;

  await mockDelay();
  const now = new Date().toISOString();
  const resume: Resume = {
    id: nextMockResumeId(),
    candidateId: payload.candidateId,
    fileAssetId: payload.fileAssetId,
    rawText: null,
    parsedData: null,
    parseStatus: 'PENDING',
    parserVersion: null,
    parsingError: null,
    uploadedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  MOCK_RESUMES.unshift(resume);
  return resume;
}

export async function getResumeById(id: string): Promise<Resume> {
  // const response = await apiClient.get<ApiResponse<Resume>>(`/resumes/${id}`);
  // return response.data;

  await mockDelay();
  const resume = MOCK_RESUMES.find((item) => item.id === id);
  if (!resume) throw new Error('Resume not found');
  return resume;
}

export async function updateResume(
  id: string,
  payload: UpdateResumePayload,
): Promise<Resume> {
  // const response = await apiClient.patch<ApiResponse<Resume>>(
  //   apiEndpoints.resumes.detail(id),
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  const index = findMockResumeIndex(id);
  if (index === -1) throw new Error('Resume not found');
  const updated: Resume = {
    ...MOCK_RESUMES[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  MOCK_RESUMES[index] = updated;
  return updated;
}

export async function deleteResume(id: string): Promise<DeleteResumeResult> {
  // const response = await apiClient.delete<ApiResponse<DeleteResumeResult>>(
  //   apiEndpoints.resumes.delete(id),
  // );
  // return response.data;

  await mockDelay();
  const index = findMockResumeIndex(id);
  if (index !== -1) MOCK_RESUMES.splice(index, 1);
  return { id, deleted: true };
}

export async function parseResumeById(id: string): Promise<Resume> {
  // const response = await apiClient.post<ApiResponse<Resume>>(
  //   `/resumes/${id}/parse`,
  //   {},
  // );
  // return response.data;

  await mockDelay(1200);
  const index = findMockResumeIndex(id);
  if (index === -1) throw new Error('Resume not found');
  const resume = MOCK_RESUMES[index];
  const candidate = MOCK_CANDIDATES.find((item) => item.id === resume.candidateId);

  const updated: Resume = {
    ...resume,
    parseStatus: 'SUCCESS',
    parserVersion: 'v2.4.1',
    parsingError: null,
    parsedData: {
      personal: {
        name: candidate?.fullName ?? 'Unknown candidate',
        email: candidate?.primaryEmail ?? null,
        phone: candidate?.primaryPhone ?? null,
        location: candidate?.location ?? null,
      },
      summary: 'Experienced professional with a strong track record across cross-functional projects.',
      skills: [{ name: 'Communication', category: 'Soft skill' }, { name: 'Project Management', category: 'General' }],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      languages: [{ name: 'English', proficiency: 'Fluent' }],
    },
    updatedAt: new Date().toISOString(),
  };
  MOCK_RESUMES[index] = updated;
  return updated;
}
