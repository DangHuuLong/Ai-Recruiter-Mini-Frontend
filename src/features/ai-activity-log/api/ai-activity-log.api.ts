import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, PaginatedApiResponse, QueryParams } from '@/lib/api/api-types';

import type {
  AiActivityLog,
  AiActivityLogListItem,
  AiActivityLogQuery,
  AiActivityLogSummary,
  TimeseriesBucket,
  TimeseriesQuery,
} from '@/features/ai-activity-log/types/ai-activity-log.type';

export async function getAiActivityLogs(
  query: AiActivityLogQuery = {},
): Promise<PaginatedApiResponse<AiActivityLogListItem>> {
  return apiClient.get<PaginatedApiResponse<AiActivityLogListItem>>(
    apiEndpoints.aiActivityLogs.list,
    { params: query as QueryParams, noCache: true },
  );
}

export async function getAiActivityLogById(id: string): Promise<AiActivityLog> {
  const response = await apiClient.get<ApiResponse<AiActivityLog>>(
    apiEndpoints.aiActivityLogs.detail(id),
    { noCache: true },
  );
  return response.data;
}

export async function getAiActivityLogSummary(): Promise<AiActivityLogSummary> {
  const response = await apiClient.get<ApiResponse<AiActivityLogSummary>>(
    apiEndpoints.aiActivityLogs.statsSummary,
    { params: { tzOffsetMinutes: -new Date().getTimezoneOffset() }, noCache: true },
  );
  return response.data;
}

export async function getAiActivityLogTimeseries(
  query: TimeseriesQuery,
): Promise<TimeseriesBucket[]> {
  const params: TimeseriesQuery = {
    tzOffsetMinutes: -new Date().getTimezoneOffset(),
    ...query,
  };
  const response = await apiClient.get<ApiResponse<TimeseriesBucket[]>>(
    apiEndpoints.aiActivityLogs.statsTimeseries,
    { params: params as QueryParams, noCache: true },
  );
  return response.data;
}
