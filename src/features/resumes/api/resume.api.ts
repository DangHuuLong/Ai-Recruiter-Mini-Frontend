import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, PaginatedApiResponse, QueryParams } from '@/lib/api';

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
  return apiClient.get<PaginatedApiResponse<Resume>>(apiEndpoints.resumes.list, {
    params: query as QueryParams,
  });
}

export async function createResume(payload: CreateResumePayload): Promise<Resume> {
  const response = await apiClient.post<ApiResponse<Resume>>(apiEndpoints.resumes.create, payload);
  return response.data;
}

export async function getResumeById(id: string): Promise<Resume> {
  const response = await apiClient.get<ApiResponse<Resume>>(apiEndpoints.resumes.detail(id));
  return response.data;
}

export async function updateResume(
  id: string,
  payload: UpdateResumePayload,
): Promise<Resume> {
  const response = await apiClient.patch<ApiResponse<Resume>>(
    apiEndpoints.resumes.update(id),
    payload,
  );
  return response.data;
}

export async function deleteResume(id: string): Promise<DeleteResumeResult> {
  const response = await apiClient.delete<ApiResponse<DeleteResumeResult>>(
    apiEndpoints.resumes.delete(id),
  );
  return response.data;
}

export async function parseResumeById(id: string): Promise<Resume> {
  const response = await apiClient.post<ApiResponse<Resume>>(apiEndpoints.resumes.parse(id), {});
  return response.data;
}
