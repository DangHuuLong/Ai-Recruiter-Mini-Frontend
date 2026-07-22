// Static-UI review phase — API calls below are commented out and replaced with mock
// data so screens can be reviewed without a live backend. See
// src/features/job-descriptions/mock/job-description-mock-data.ts for the dataset. To
// restore real integration, uncomment the `apiClient` call in each function and remove
// the mock block. apiClient/apiEndpoints kept imported so the commented-out real calls
// still resolve at a glance — re-enable by uncommenting, no import changes needed.
import { apiClient, apiEndpoints } from '@/lib/api';
import type { BulkOperationResultItem, PaginatedApiResponse } from '@/lib/api/api-types';

import {
  findMockJobDescriptionIndex,
  MOCK_JOB_DESCRIPTIONS,
  nextMockJobDescriptionId,
  nextMockJobSkillId,
} from '@/features/job-descriptions/mock/job-description-mock-data';
import { mockDelay, paginateMock, sortMock } from '@/lib/utils/mock-delay';
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
  // return apiClient.get<PaginatedApiResponse<JobDescription>>(
  //   apiEndpoints.jobDescriptions.list,
  //   { params: query },
  // );

  await mockDelay();
  let filtered = MOCK_JOB_DESCRIPTIONS;
  if (query.isActive !== undefined) {
    filtered = filtered.filter((jd) => jd.isActive === query.isActive);
  }
  if (query.parseStatus) {
    filtered = filtered.filter((jd) => jd.parseStatus === query.parseStatus);
  }
  const search = query.search?.trim().toLowerCase();
  if (search) {
    filtered = filtered.filter((jd) =>
      [jd.title, jd.companyName, jd.department, jd.location].filter(Boolean).some((field) =>
        field!.toLowerCase().includes(search),
      ),
    );
  }
  const sorted = sortMock(filtered, query.sortBy, query.sortOrder);
  const { data, meta } = paginateMock(sorted, query.page, query.limit);
  return { success: true, message: 'Job descriptions fetched successfully (mock)', data, meta };
}

export async function createJobDescription(
  payload: CreateJobDescriptionPayload,
): Promise<JobDescription> {
  // const response = await apiClient.post<ApiResponse<JobDescription>>(
  //   apiEndpoints.jobDescriptions.create,
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  const now = new Date().toISOString();
  const jobDescription: JobDescription = {
    id: nextMockJobDescriptionId(),
    createdById: payload.createdById ?? null,
    title: payload.title,
    companyName: payload.companyName ?? null,
    department: payload.department ?? null,
    location: payload.location ?? null,
    employmentType: payload.employmentType ?? null,
    seniority: payload.seniority ?? null,
    rawText: payload.rawText,
    parsedData: null,
    parserVersion: payload.parserVersion ?? null,
    parseStatus: 'PENDING',
    parsingError: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    skills: [],
    _count: { applications: 0, skills: 0 },
  };
  MOCK_JOB_DESCRIPTIONS.unshift(jobDescription);
  return jobDescription;
}

export async function getJobDescription(id: string): Promise<JobDescription> {
  // const response = await apiClient.get<ApiResponse<JobDescription>>(
  //   apiEndpoints.jobDescriptions.detail(id),
  // );
  // return response.data;

  await mockDelay();
  const jobDescription = MOCK_JOB_DESCRIPTIONS.find((item) => item.id === id);
  if (!jobDescription) throw new Error('Job description not found');
  return jobDescription;
}

export async function updateJobDescription(
  id: string,
  payload: UpdateJobDescriptionPayload,
): Promise<JobDescription> {
  // const response = await apiClient.patch<ApiResponse<JobDescription>>(
  //   apiEndpoints.jobDescriptions.update(id),
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  const index = findMockJobDescriptionIndex(id);
  if (index === -1) throw new Error('Job description not found');
  const updated: JobDescription = {
    ...MOCK_JOB_DESCRIPTIONS[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  MOCK_JOB_DESCRIPTIONS[index] = updated;
  return updated;
}

export async function deactivateJobDescription(id: string): Promise<JobDescription> {
  return updateJobDescription(id, { isActive: false });
}

export async function bulkDeactivateJobDescriptions(
  ids: string[],
): Promise<BulkOperationResultItem<JobDescription>[]> {
  // const response = await apiClient.post<ApiResponse<BulkOperationResultItem<JobDescription>[]>>(
  //   apiEndpoints.jobDescriptions.bulkDeactivate,
  //   { ids },
  // );
  // return response.data;

  await mockDelay();
  const results: BulkOperationResultItem<JobDescription>[] = [];
  for (const id of ids) {
    try {
      const data = await deactivateJobDescription(id);
      results.push({ id, success: true, data });
    } catch (error) {
      results.push({ id, success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
  return results;
}

export async function deleteJobDescription(
  id: string,
): Promise<DeleteJobDescriptionResult> {
  // const response = await apiClient.delete<ApiResponse<DeleteJobDescriptionResult>>(
  //   apiEndpoints.jobDescriptions.delete(id),
  // );
  // return response.data;

  await mockDelay();
  const index = findMockJobDescriptionIndex(id);
  if (index !== -1) MOCK_JOB_DESCRIPTIONS.splice(index, 1);
  return { id, deleted: true };
}

export async function parseJobDescription(id: string): Promise<JobDescription> {
  // const response = await apiClient.post<ApiResponse<JobDescription>>(
  //   apiEndpoints.jobDescriptions.parse(id),
  // );
  // return response.data;

  await mockDelay(1200);
  const index = findMockJobDescriptionIndex(id);
  if (index === -1) throw new Error('Job description not found');
  const jobDescription = MOCK_JOB_DESCRIPTIONS[index];
  const updated: JobDescription = {
    ...jobDescription,
    parseStatus: 'SUCCESS',
    parserVersion: 'v2.4.1',
    parsingError: null,
    parsedData: jobDescription.parsedData ?? {
      title: jobDescription.title,
      seniority: jobDescription.seniority ?? null,
      employment_type: jobDescription.employmentType ?? null,
      responsibilities: ['Responsibility extracted from raw text (mock parse)'],
      requirements: ['Requirement extracted from raw text (mock parse)'],
      nice_to_have: [],
      required_skills: [],
      preferred_skills: [],
      min_experience_years: null,
      education_requirement: null,
      domain_keywords: [],
    },
    updatedAt: new Date().toISOString(),
  };
  MOCK_JOB_DESCRIPTIONS[index] = updated;
  return updated;
}

export async function getParsedJobDescriptionData(
  id: string,
): Promise<ParsedJobDescriptionState> {
  // const response = await apiClient.get<ApiResponse<ParsedJobDescriptionState>>(
  //   apiEndpoints.jobDescriptions.parsedData(id),
  // );
  // return response.data;

  await mockDelay();
  const jobDescription = MOCK_JOB_DESCRIPTIONS.find((item) => item.id === id);
  if (!jobDescription) throw new Error('Job description not found');
  const { id: jdId, title, rawText, parsedData, parseStatus, parserVersion, parsingError, updatedAt } = jobDescription;
  return { id: jdId, title, rawText, parsedData, parseStatus, parserVersion, parsingError, updatedAt };
}

export async function getJobSkills(jobDescriptionId: string): Promise<JobSkill[]> {
  // const response = await apiClient.get<ApiResponse<JobSkill[]>>(
  //   apiEndpoints.jobDescriptions.skills(jobDescriptionId),
  // );
  // return response.data;

  await mockDelay();
  const jobDescription = MOCK_JOB_DESCRIPTIONS.find((item) => item.id === jobDescriptionId);
  return jobDescription?.skills ?? [];
}

export async function createJobSkill(
  jobDescriptionId: string,
  payload: CreateJobSkillPayload,
): Promise<JobSkill> {
  // const response = await apiClient.post<ApiResponse<JobSkill>>(
  //   apiEndpoints.jobDescriptions.skills(jobDescriptionId),
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  const index = findMockJobDescriptionIndex(jobDescriptionId);
  if (index === -1) throw new Error('Job description not found');
  const skill: JobSkill = {
    id: nextMockJobSkillId(),
    jobDescriptionId,
    name: payload.name,
    normalizedName: payload.normalizedName ?? null,
    type: payload.type,
    isCore: payload.isCore ?? false,
    weightHint: payload.weightHint ?? null,
    createdAt: new Date().toISOString(),
  };
  const jobDescription = MOCK_JOB_DESCRIPTIONS[index];
  const skills = [...(jobDescription.skills ?? []), skill];
  MOCK_JOB_DESCRIPTIONS[index] = {
    ...jobDescription,
    skills,
    _count: { ...jobDescription._count, applications: jobDescription._count?.applications ?? 0, skills: skills.length },
  };
  return skill;
}

export async function updateJobSkill(
  skillId: string,
  payload: UpdateJobSkillPayload,
): Promise<JobSkill> {
  // const response = await apiClient.patch<ApiResponse<JobSkill>>(
  //   apiEndpoints.jobSkills.update(skillId),
  //   payload,
  // );
  // return response.data;

  await mockDelay();
  for (const jobDescription of MOCK_JOB_DESCRIPTIONS) {
    const skillIndex = (jobDescription.skills ?? []).findIndex((skill) => skill.id === skillId);
    if (skillIndex !== -1 && jobDescription.skills) {
      const updated: JobSkill = { ...jobDescription.skills[skillIndex], ...payload };
      jobDescription.skills[skillIndex] = updated;
      return updated;
    }
  }
  throw new Error('Job skill not found');
}

export async function deleteJobSkill(skillId: string): Promise<{ id: string; deleted: boolean }> {
  // const response = await apiClient.delete<ApiResponse<{ id: string; deleted: boolean }>>(
  //   apiEndpoints.jobSkills.delete(skillId),
  // );
  // return response.data;

  await mockDelay();
  for (const jobDescription of MOCK_JOB_DESCRIPTIONS) {
    const skillIndex = (jobDescription.skills ?? []).findIndex((skill) => skill.id === skillId);
    if (skillIndex !== -1 && jobDescription.skills) {
      jobDescription.skills.splice(skillIndex, 1);
      if (jobDescription._count) jobDescription._count.skills = jobDescription.skills.length;
      break;
    }
  }
  return { id: skillId, deleted: true };
}
