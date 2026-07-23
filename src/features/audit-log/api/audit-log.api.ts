import { apiClient, apiEndpoints } from '@/lib/api';
import type { PaginatedApiResponse, QueryParams } from '@/lib/api/api-types';

import type { AuditLog, AuditLogQuery } from '@/features/audit-log/types/audit-log.type';

export async function getAuditLogs(query: AuditLogQuery = {}): Promise<PaginatedApiResponse<AuditLog>> {
  return apiClient.get<PaginatedApiResponse<AuditLog>>(apiEndpoints.auditLogs.list, {
    params: query as QueryParams,
  });
}
