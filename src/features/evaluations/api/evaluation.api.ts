import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, PaginatedApiResponse } from '@/lib/api/api-types';

import type {
  CreateEvaluationPayload,
  Evaluation,
  EvaluationCriterionScore,
  EvaluationInterviewQuestion,
  EvaluationQuery,
  EvaluationSkill,
} from '@/features/evaluations/types/evaluation.type';

export async function getEvaluations(
  query: EvaluationQuery = {},
): Promise<Evaluation[]> {
  const response = await apiClient.get<PaginatedApiResponse<Evaluation>>(
    apiEndpoints.evaluations.list,
    { params: query },
  );

  return response.data;
}

export async function getEvaluationById(id: string): Promise<Evaluation> {
  const response = await apiClient.get<ApiResponse<Evaluation>>(
    apiEndpoints.evaluations.detail(id),
  );

  return response.data;
}

export async function createEvaluation(
  payload: CreateEvaluationPayload,
): Promise<Evaluation> {
  const response = await apiClient.post<ApiResponse<Evaluation>>(
    apiEndpoints.evaluations.create,
    payload,
  );

  return response.data;
}

export async function getApplicationEvaluations(
  applicationId: string,
): Promise<Evaluation[]> {
  const response = await apiClient.get<ApiResponse<Evaluation[]>>(
    apiEndpoints.evaluations.byApplication(applicationId),
  );

  return response.data;
}

export async function getEvaluationBreakdown(
  id: string,
): Promise<EvaluationCriterionScore[]> {
  const response = await apiClient.get<ApiResponse<EvaluationCriterionScore[]>>(
    apiEndpoints.evaluations.breakdown(id),
  );

  return response.data;
}

export async function getEvaluationSkills(id: string): Promise<EvaluationSkill[]> {
  const response = await apiClient.get<ApiResponse<EvaluationSkill[]>>(
    apiEndpoints.evaluations.skills(id),
  );

  return response.data;
}

export async function getEvaluationInterviewQuestions(
  id: string,
): Promise<EvaluationInterviewQuestion[]> {
  const response = await apiClient.get<ApiResponse<EvaluationInterviewQuestion[]>>(
    apiEndpoints.evaluations.interviewQuestions(id),
  );

  return response.data;
}

export async function getEvaluationEvidence(id: string): Promise<unknown> {
  const response = await apiClient.get<ApiResponse<unknown>>(
    apiEndpoints.evaluations.evidence(id),
  );

  return response.data;
}

export async function retryEvaluation(id: string): Promise<Evaluation> {
  const response = await apiClient.post<ApiResponse<Evaluation>>(
    apiEndpoints.evaluations.retry(id),
  );

  return response.data;
}
