import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, PaginatedApiResponse, QueryParams } from '@/lib/api/api-types';

import type {
  BulkCreateResultItem,
  CreateInterviewQuestionPayload,
  DeleteInterviewQuestionResult,
  InterviewQuestion,
  InterviewQuestionQuery,
  SearchInterviewQuestionsPayload,
  SearchOrGenerateResult,
  SearchResultRow,
  UpdateInterviewQuestionPayload,
} from '@/features/interview-questions/types/interview-question.type';

export async function getInterviewQuestions(
  query: InterviewQuestionQuery = {},
): Promise<PaginatedApiResponse<InterviewQuestion>> {
  return apiClient.get<PaginatedApiResponse<InterviewQuestion>>(
    apiEndpoints.interviewQuestions.list,
    { params: query as QueryParams },
  );
}

export async function getInterviewQuestionById(id: string): Promise<InterviewQuestion> {
  const response = await apiClient.get<ApiResponse<InterviewQuestion>>(
    apiEndpoints.interviewQuestions.detail(id),
  );
  return response.data;
}

export async function createInterviewQuestion(
  payload: CreateInterviewQuestionPayload,
): Promise<InterviewQuestion> {
  const response = await apiClient.post<ApiResponse<InterviewQuestion>>(
    apiEndpoints.interviewQuestions.create,
    payload,
  );
  return response.data;
}

export async function bulkCreateInterviewQuestions(
  items: CreateInterviewQuestionPayload[],
): Promise<BulkCreateResultItem[]> {
  const response = await apiClient.post<ApiResponse<BulkCreateResultItem[]>>(
    apiEndpoints.interviewQuestions.bulkCreate,
    { items },
  );
  return response.data;
}

export async function updateInterviewQuestion(
  id: string,
  payload: UpdateInterviewQuestionPayload,
): Promise<InterviewQuestion> {
  const response = await apiClient.patch<ApiResponse<InterviewQuestion>>(
    apiEndpoints.interviewQuestions.update(id),
    payload,
  );
  return response.data;
}

export async function deleteInterviewQuestion(id: string): Promise<DeleteInterviewQuestionResult> {
  const response = await apiClient.delete<ApiResponse<DeleteInterviewQuestionResult>>(
    apiEndpoints.interviewQuestions.delete(id),
  );
  return response.data;
}

export async function reembedInterviewQuestion(id: string): Promise<InterviewQuestion> {
  const response = await apiClient.post<ApiResponse<InterviewQuestion>>(
    apiEndpoints.interviewQuestions.reembed(id),
    {},
  );
  return response.data;
}

export async function searchInterviewQuestions(
  payload: SearchInterviewQuestionsPayload,
): Promise<SearchResultRow[]> {
  const response = await apiClient.post<ApiResponse<SearchResultRow[]>>(
    apiEndpoints.interviewQuestions.search,
    payload,
  );
  return response.data;
}

export async function searchOrGenerateInterviewQuestions(
  payload: SearchInterviewQuestionsPayload,
): Promise<SearchOrGenerateResult> {
  const response = await apiClient.post<ApiResponse<SearchOrGenerateResult>>(
    apiEndpoints.interviewQuestions.searchOrGenerate,
    payload,
  );
  return response.data;
}
