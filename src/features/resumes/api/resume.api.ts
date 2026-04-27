import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import type { CreateResumePayload, Resume } from '../types/resume.type';

export async function createResume(payload: CreateResumePayload): Promise<Resume> {
  const response = await apiClient.post<ApiResponse<Resume>>('/resumes', payload);

  return response.data;
}

export async function getResumeById(id: string): Promise<Resume> {
  const response = await apiClient.get<ApiResponse<Resume>>(`/resumes/${id}`);

  return response.data;
}