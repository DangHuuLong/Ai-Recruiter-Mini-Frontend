import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, BulkOperationResultItem, PaginatedApiResponse, QueryParams } from '@/lib/api/api-types';

import type {
  CreateEvaluationConfigPayload,
  DeleteEvaluationConfigResult,
  EvaluationConfig,
  EvaluationConfigQuery,
  UpdateEvaluationConfigPayload,
} from '@/features/evaluation-configs/types/evaluation-config.type';

export async function getEvaluationConfigs(
  query: EvaluationConfigQuery = {},
): Promise<PaginatedApiResponse<EvaluationConfig>> {
  return apiClient.get<PaginatedApiResponse<EvaluationConfig>>(
    apiEndpoints.evaluationConfigs.list,
    { params: query as QueryParams },
  );
}

export async function getEvaluationConfigById(id: string): Promise<EvaluationConfig> {
  const response = await apiClient.get<ApiResponse<EvaluationConfig>>(
    apiEndpoints.evaluationConfigs.detail(id),
  );
  return response.data;
}

export async function createEvaluationConfig(
  payload: CreateEvaluationConfigPayload,
): Promise<EvaluationConfig> {
  const response = await apiClient.post<ApiResponse<EvaluationConfig>>(
    apiEndpoints.evaluationConfigs.create,
    payload,
  );
  return response.data;
}

export async function updateEvaluationConfig(
  id: string,
  payload: UpdateEvaluationConfigPayload,
): Promise<EvaluationConfig> {
  const response = await apiClient.patch<ApiResponse<EvaluationConfig>>(
    apiEndpoints.evaluationConfigs.update(id),
    payload,
  );
  return response.data;
}

export async function deleteEvaluationConfig(id: string): Promise<DeleteEvaluationConfigResult> {
  const response = await apiClient.delete<ApiResponse<DeleteEvaluationConfigResult>>(
    apiEndpoints.evaluationConfigs.delete(id),
  );
  return response.data;
}

export async function bulkDeleteEvaluationConfigs(
  ids: string[],
): Promise<BulkOperationResultItem<DeleteEvaluationConfigResult>[]> {
  const response = await apiClient.post<ApiResponse<BulkOperationResultItem<DeleteEvaluationConfigResult>[]>>(
    apiEndpoints.evaluationConfigs.bulkDelete,
    { ids },
  );
  return response.data;
}
