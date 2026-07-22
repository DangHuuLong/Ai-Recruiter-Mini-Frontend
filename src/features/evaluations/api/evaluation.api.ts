// Static-UI review phase — API calls below are commented out and replaced with mock
// data so screens can be reviewed without a live backend. See
// src/features/evaluations/mock/evaluation-mock-data.ts for the dataset. To restore
// real integration, uncomment the `apiClient` call in each function and remove the mock
// block. apiClient/apiEndpoints kept imported so the commented-out real calls still
// resolve at a glance — re-enable by uncommenting, no import changes needed.
import { apiClient, apiEndpoints } from '@/lib/api';
import type { PaginatedApiResponse } from '@/lib/api/api-types';

import {
  buildMockEvaluationResult,
  findMockEvaluationIndex,
  MOCK_EVALUATIONS,
  nextMockEvaluationId,
} from '@/features/evaluations/mock/evaluation-mock-data';
import type {
  CreateEvaluationPayload,
  Evaluation,
  EvaluationCriterionScore,
  EvaluationInterviewQuestion,
  EvaluationQuery,
  EvaluationSkill,
} from '@/features/evaluations/types/evaluation.type';
import { mockDelay, paginateMock, sortMock } from '@/lib/utils/mock-delay';

export async function getEvaluations(
  query: EvaluationQuery = {},
): Promise<PaginatedApiResponse<Evaluation>> {
  // return apiClient.get<PaginatedApiResponse<Evaluation>>(
  //   apiEndpoints.evaluations.list,
  //   { params: query },
  // );

  await mockDelay();
  let filtered = MOCK_EVALUATIONS;
  if (query.status) filtered = filtered.filter((evaluation) => evaluation.status === query.status);
  if (query.applicationId) filtered = filtered.filter((evaluation) => evaluation.applicationId === query.applicationId);
  const sorted = sortMock(filtered, query.sortBy, query.sortOrder);
  const { data, meta } = paginateMock(sorted, query.page, query.limit);
  return { success: true, message: 'Evaluations fetched successfully (mock)', data, meta };
}

export async function getEvaluationById(id: string): Promise<Evaluation> {
  // const response = await apiClient.get<ApiResponse<Evaluation>>(
  //   apiEndpoints.evaluations.detail(id),
  // );
  // return response.data;

  await mockDelay();
  const evaluation = MOCK_EVALUATIONS.find((item) => item.id === id);
  if (!evaluation) throw new Error('Evaluation not found');
  return evaluation;
}

export async function createEvaluation(
  payload: CreateEvaluationPayload,
): Promise<Evaluation> {
  // const response = await apiClient.post<ApiResponse<Evaluation>>(
  //   apiEndpoints.evaluations.create,
  //   payload,
  // );
  // return response.data;

  await mockDelay(800);
  const id = nextMockEvaluationId();
  const evaluation = buildMockEvaluationResult(id, payload.applicationId);
  MOCK_EVALUATIONS.unshift(evaluation);
  return evaluation;
}

export async function getApplicationEvaluations(
  applicationId: string,
): Promise<Evaluation[]> {
  // const response = await apiClient.get<ApiResponse<Evaluation[]>>(
  //   apiEndpoints.evaluations.byApplication(applicationId),
  // );
  // return response.data;

  await mockDelay();
  return MOCK_EVALUATIONS.filter((evaluation) => evaluation.applicationId === applicationId);
}

export async function getEvaluationBreakdown(
  id: string,
): Promise<EvaluationCriterionScore[]> {
  // const response = await apiClient.get<ApiResponse<EvaluationCriterionScore[]>>(
  //   apiEndpoints.evaluations.breakdown(id),
  // );
  // return response.data;

  await mockDelay();
  const evaluation = MOCK_EVALUATIONS.find((item) => item.id === id);
  return evaluation?.criterionScores ?? [];
}

export async function getEvaluationSkills(id: string): Promise<EvaluationSkill[]> {
  // const response = await apiClient.get<ApiResponse<EvaluationSkill[]>>(
  //   apiEndpoints.evaluations.skills(id),
  // );
  // return response.data;

  await mockDelay();
  const evaluation = MOCK_EVALUATIONS.find((item) => item.id === id);
  return evaluation?.skills ?? [];
}

export async function getEvaluationInterviewQuestions(
  id: string,
): Promise<EvaluationInterviewQuestion[]> {
  // const response = await apiClient.get<ApiResponse<EvaluationInterviewQuestion[]>>(
  //   apiEndpoints.evaluations.interviewQuestions(id),
  // );
  // return response.data;

  await mockDelay();
  const evaluation = MOCK_EVALUATIONS.find((item) => item.id === id);
  return evaluation?.interviewQuestionRows ?? [];
}

export async function getEvaluationEvidence(id: string): Promise<unknown> {
  // const response = await apiClient.get<ApiResponse<unknown>>(
  //   apiEndpoints.evaluations.evidence(id),
  // );
  // return response.data;

  await mockDelay();
  const evaluation = MOCK_EVALUATIONS.find((item) => item.id === id);
  return evaluation?.evidenceMap ?? {};
}

export async function retryEvaluation(id: string): Promise<Evaluation> {
  // const response = await apiClient.post<ApiResponse<Evaluation>>(
  //   apiEndpoints.evaluations.retry(id),
  // );
  // return response.data;

  await mockDelay(800);
  const index = findMockEvaluationIndex(id);
  if (index === -1) throw new Error('Evaluation not found');
  const retried = buildMockEvaluationResult(id, MOCK_EVALUATIONS[index].applicationId);
  MOCK_EVALUATIONS[index] = retried;
  return retried;
}
