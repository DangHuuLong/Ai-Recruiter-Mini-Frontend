// Static-UI review phase — API calls below are commented out and replaced with mock
// data so screens can be reviewed without a live backend. See
// src/features/applications/mock/application-mock-data.ts for the dataset. To restore
// real integration, uncomment the `apiClient` call in each function and remove the mock
// block. apiClient/apiEndpoints kept imported so the commented-out real calls still
// resolve at a glance — re-enable by uncommenting, no import changes needed.
import { apiClient, apiEndpoints } from '@/lib/api';
import type { PaginatedApiResponse } from '@/lib/api/api-types';

import {
  findMockApplicationIndex,
  MOCK_APPLICATION_EVENTS,
  MOCK_APPLICATIONS,
  nextMockApplicationEventId,
  nextMockApplicationId,
} from '@/features/applications/mock/application-mock-data';
import { mockDelay, paginateMock, sortMock } from '@/lib/utils/mock-delay';
import type {
  Application,
  ApplicationEvent,
  ApplicationQuery,
  CreateApplicationPayload,
  DeleteApplicationResult,
  UpdateApplicationPayload,
  UpdateApplicationStatusPayload,
} from '@/features/applications/types/application.type';

export async function getApplications(
  query: ApplicationQuery = {},
): Promise<PaginatedApiResponse<Application>> {
  // return apiClient.get<PaginatedApiResponse<Application>>(
  //   apiEndpoints.applications.list,
  //   { params: query },
  // );

  await mockDelay();
  let filtered = MOCK_APPLICATIONS;
  if (query.status) filtered = filtered.filter((application) => application.status === query.status);
  if (query.candidateId) filtered = filtered.filter((application) => application.candidateId === query.candidateId);
  if (query.jobDescriptionId) filtered = filtered.filter((application) => application.jobDescriptionId === query.jobDescriptionId);
  if (query.resumeId) filtered = filtered.filter((application) => application.resumeId === query.resumeId);
  const search = query.search?.trim().toLowerCase();
  if (search) {
    filtered = filtered.filter((application) =>
      [application.candidate?.fullName, application.jobDescription?.title, application.source]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(search)),
    );
  }
  const sorted = sortMock(filtered, query.sortBy, query.sortOrder);
  const { data, meta } = paginateMock(sorted, query.page, query.limit);
  return { success: true, message: 'Applications fetched successfully (mock)', data, meta };
}

export async function getApplicationById(id: string): Promise<Application> {
  // const response = await apiClient.get<ApiResponse<Application>>(
  //   apiEndpoints.applications.detail(id),
  // );
  // return response.data;

  await mockDelay();
  const application = MOCK_APPLICATIONS.find((item) => item.id === id);
  if (!application) throw new Error('Application not found');
  return application;
}

export async function createApplication(
  payload: CreateApplicationPayload,
): Promise<Application> {
  // const response = await apiClient.post<ApiResponse<Application>>(
  //   apiEndpoints.applications.create,
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  const now = new Date().toISOString();
  const id = nextMockApplicationId();
  const application: Application = {
    id,
    candidateId: payload.candidateId,
    resumeId: payload.resumeId,
    jobDescriptionId: payload.jobDescriptionId,
    createdById: payload.createdById ?? null,
    status: 'APPLIED',
    source: payload.source ?? null,
    appliedAt: now,
    lastActivityAt: now,
    notes: payload.notes ?? null,
    createdAt: now,
    updatedAt: now,
    _count: { evaluations: 0, events: 1 },
  };
  MOCK_APPLICATIONS.unshift(application);
  MOCK_APPLICATION_EVENTS[id] = [
    { id: nextMockApplicationEventId(), applicationId: id, eventType: 'APPLICATION_CREATED', eventData: null, createdAt: now },
  ];
  return application;
}

export async function updateApplication(
  id: string,
  payload: UpdateApplicationPayload,
): Promise<Application> {
  // const response = await apiClient.patch<ApiResponse<Application>>(
  //   apiEndpoints.applications.update(id),
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  const index = findMockApplicationIndex(id);
  if (index === -1) throw new Error('Application not found');
  const updated: Application = {
    ...MOCK_APPLICATIONS[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  MOCK_APPLICATIONS[index] = updated;
  return updated;
}

export async function updateApplicationStatus(
  id: string,
  payload: UpdateApplicationStatusPayload,
): Promise<Application> {
  // const response = await apiClient.patch<ApiResponse<Application>>(
  //   apiEndpoints.applications.status(id),
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  const index = findMockApplicationIndex(id);
  if (index === -1) throw new Error('Application not found');
  const fromStatus = MOCK_APPLICATIONS[index].status;
  const now = new Date().toISOString();
  const updated: Application = {
    ...MOCK_APPLICATIONS[index],
    status: payload.status,
    lastActivityAt: now,
    updatedAt: now,
  };
  MOCK_APPLICATIONS[index] = updated;

  const events = MOCK_APPLICATION_EVENTS[id] ?? [];
  events.unshift({
    id: nextMockApplicationEventId(),
    applicationId: id,
    eventType: 'STATUS_CHANGED',
    eventData: { fromStatus, toStatus: payload.status, note: payload.note },
    createdAt: now,
  });
  MOCK_APPLICATION_EVENTS[id] = events;

  return updated;
}

export async function deleteApplication(id: string): Promise<DeleteApplicationResult> {
  // const response = await apiClient.delete<ApiResponse<DeleteApplicationResult>>(
  //   apiEndpoints.applications.delete(id),
  // );
  // return response.data;

  await mockDelay();
  const index = findMockApplicationIndex(id);
  if (index !== -1) MOCK_APPLICATIONS.splice(index, 1);
  delete MOCK_APPLICATION_EVENTS[id];
  return { id, deleted: true };
}

export async function getApplicationEvents(
  id: string,
): Promise<ApplicationEvent[]> {
  // const response = await apiClient.get<ApiResponse<ApplicationEvent[]>>(
  //   apiEndpoints.applications.events(id),
  // );
  // return response.data;

  await mockDelay();
  return MOCK_APPLICATION_EVENTS[id] ?? [];
}
