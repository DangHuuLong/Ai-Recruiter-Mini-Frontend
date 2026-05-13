import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, PaginatedApiResponse } from '@/lib/api/api-types';

import type {
  CreateJobDescriptionPayload,
  CreateJobSkillPayload,
  DeleteJobDescriptionResult,
  JobDescription,
  JobDescriptionQuery,
  JobSkill,
  ParsedJobDescriptionState,
  UpdateJobDescriptionPayload,
  UpdateJobSkillPayload,
} from '@/features/job-descriptions/types/job-description.type';

export async function getJobDescriptions(
  query: JobDescriptionQuery = {},
): Promise<PaginatedApiResponse<JobDescription>> {
  return apiClient.get<PaginatedApiResponse<JobDescription>>(
    apiEndpoints.jobDescriptions.list,
    { params: query },
  );
}

export async function createJobDescription(
  payload: CreateJobDescriptionPayload,
): Promise<JobDescription> {
  const response = await apiClient.post<ApiResponse<JobDescription>>(
    apiEndpoints.jobDescriptions.create,
    payload,
  );

  return response.data;
}

export async function getJobDescription(id: string): Promise<JobDescription> {
  const response = await apiClient.get<ApiResponse<JobDescription>>(
    apiEndpoints.jobDescriptions.detail(id),
  );

  return response.data;
}

export async function updateJobDescription(
  id: string,
  payload: UpdateJobDescriptionPayload,
): Promise<JobDescription> {
  const response = await apiClient.patch<ApiResponse<JobDescription>>(
    apiEndpoints.jobDescriptions.update(id),
    payload,
  );

  return response.data;
}

export async function deactivateJobDescription(id: string): Promise<JobDescription> {
  return updateJobDescription(id, { isActive: false });
}

export async function deleteJobDescription(
  id: string,
): Promise<DeleteJobDescriptionResult> {
  const response = await apiClient.delete<ApiResponse<DeleteJobDescriptionResult>>(
    apiEndpoints.jobDescriptions.delete(id),
  );

  return response.data;
}

export async function parseJobDescription(id: string): Promise<JobDescription> {
  const response = await apiClient.post<ApiResponse<JobDescription>>(
    apiEndpoints.jobDescriptions.parse(id),
  );

  return response.data;
}

export async function getParsedJobDescriptionData(
  id: string,
): Promise<ParsedJobDescriptionState> {
  const response = await apiClient.get<ApiResponse<ParsedJobDescriptionState>>(
    apiEndpoints.jobDescriptions.parsedData(id),
  );

  return response.data;
}

export async function getJobSkills(jobDescriptionId: string): Promise<JobSkill[]> {
  const response = await apiClient.get<ApiResponse<JobSkill[]>>(
    apiEndpoints.jobDescriptions.skills(jobDescriptionId),
  );

  return response.data;
}

export async function createJobSkill(
  jobDescriptionId: string,
  payload: CreateJobSkillPayload,
): Promise<JobSkill> {
  const response = await apiClient.post<ApiResponse<JobSkill>>(
    apiEndpoints.jobDescriptions.skills(jobDescriptionId),
    payload,
  );

  return response.data;
}

export async function updateJobSkill(
  skillId: string,
  payload: UpdateJobSkillPayload,
): Promise<JobSkill> {
  const response = await apiClient.patch<ApiResponse<JobSkill>>(
    apiEndpoints.jobSkills.update(skillId),
    payload,
  );

  return response.data;
}

export async function deleteJobSkill(skillId: string): Promise<{ id: string; deleted: boolean }> {
  const response = await apiClient.delete<ApiResponse<{ id: string; deleted: boolean }>>(
    apiEndpoints.jobSkills.delete(skillId),
  );

  return response.data;
}
