import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, PaginatedApiResponse, QueryParams } from '@/lib/api/api-types';

import type {
  Application,
  ApplicationEvent,
  ApplicationQuery,
  CreateApplicationPayload,
  UpdateApplicationPayload,
  UpdateApplicationStatusPayload,
} from '@/features/applications/types/application.type';

export async function getApplications(
  query: ApplicationQuery = {},
): Promise<PaginatedApiResponse<Application>> {
  return apiClient.get<PaginatedApiResponse<Application>>(
    apiEndpoints.applications.list,
    { params: query as QueryParams },
  );
}

export async function getCandidateApplications(candidateId: string): Promise<Application[]> {
  const response = await apiClient.get<ApiResponse<Application[]>>(
    apiEndpoints.candidates.applications(candidateId),
  );
  return response.data;
}

export async function getApplicationById(id: string): Promise<Application> {
  const response = await apiClient.get<ApiResponse<Application>>(
    apiEndpoints.applications.detail(id),
  );
  return response.data;
}

export async function createApplication(
  payload: CreateApplicationPayload,
): Promise<Application> {
  const response = await apiClient.post<ApiResponse<Application>>(
    apiEndpoints.applications.create,
    payload,
  );
  return response.data;
}

export async function updateApplication(
  id: string,
  payload: UpdateApplicationPayload,
): Promise<Application> {
  const response = await apiClient.patch<ApiResponse<Application>>(
    apiEndpoints.applications.update(id),
    payload,
  );
  return response.data;
}

export async function updateApplicationStatus(
  id: string,
  payload: UpdateApplicationStatusPayload,
): Promise<Application> {
  const response = await apiClient.patch<ApiResponse<Application>>(
    apiEndpoints.applications.status(id),
    payload,
  );
  return response.data;
}

export async function getApplicationEvents(
  id: string,
): Promise<ApplicationEvent[]> {
  const response = await apiClient.get<ApiResponse<ApplicationEvent[]>>(
    apiEndpoints.applications.events(id),
  );
  return response.data;
}
