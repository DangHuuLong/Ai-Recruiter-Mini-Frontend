import { envConfig } from '@/config/env.config';
import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, PaginatedApiResponse, QueryParams } from '@/lib/api/api-types';
import { getStoredAccessToken } from '@/lib/auth/auth-storage';

import type {
  BatchMatrix,
  BatchStatusResult,
  CancelBatchResult,
  CellDetail,
  CreateScoringBatchPayload,
  CreateScoringBatchResult,
  MatrixQuery,
  PromoteBatchItem,
  PromoteBatchItemResult,
  ScoringBatchQuery,
  ScoringBatchSummary,
  SkillGapSummary,
  UploadUrlFileRequest,
  UploadUrlKind,
  UploadUrlResult,
} from '@/features/batch-scoring/types/batch-scoring.type';

export async function getScoringBatches(
  query: ScoringBatchQuery = {},
): Promise<PaginatedApiResponse<ScoringBatchSummary>> {
  return apiClient.get<PaginatedApiResponse<ScoringBatchSummary>>(
    apiEndpoints.scoringBatches.list,
    { params: query as QueryParams },
  );
}

// SHA-256 hex digest of a file's contents, required by the upload-urls endpoint (and re-verified
// server-side against the actually-uploaded bytes once the batch is created).
export async function computeFileChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function getUploadUrls(
  kind: UploadUrlKind,
  files: UploadUrlFileRequest[],
): Promise<UploadUrlResult[]> {
  const response = await apiClient.post<ApiResponse<UploadUrlResult[]>>(
    apiEndpoints.scoringBatches.uploadUrls,
    { kind, files },
  );
  return response.data;
}

// Uploads the raw file bytes directly to storage using the pre-signed URL — bypasses the
// backend entirely, matching how the signed URL is designed to be used.
export async function uploadFileToSignedUrl(signedUploadUrl: string, file: File): Promise<void> {
  const response = await fetch(signedUploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Upload failed for "${file.name}" (${response.status})`);
  }
}

export async function createScoringBatch(
  payload: CreateScoringBatchPayload,
): Promise<CreateScoringBatchResult> {
  const response = await apiClient.post<ApiResponse<CreateScoringBatchResult>>(
    apiEndpoints.scoringBatches.create,
    payload,
  );
  return response.data;
}

// Polled on an interval while a batch is in progress — must always hit the network.
export async function getScoringBatchStatus(id: string): Promise<BatchStatusResult> {
  const response = await apiClient.get<ApiResponse<BatchStatusResult>>(
    apiEndpoints.scoringBatches.status(id),
    { noCache: true },
  );
  return response.data;
}

// Reloaded on every poll tick once a batch settles — must always hit the network.
export async function getScoringBatchMatrix(id: string, query: MatrixQuery = {}): Promise<BatchMatrix> {
  const response = await apiClient.get<ApiResponse<BatchMatrix>>(
    apiEndpoints.scoringBatches.matrix(id),
    { params: query as QueryParams, noCache: true },
  );
  return response.data;
}

export async function getScoringBatchCell(
  id: string,
  resumeItemId: string,
  jdItemId: string,
): Promise<CellDetail> {
  const response = await apiClient.get<ApiResponse<CellDetail>>(
    apiEndpoints.scoringBatches.cell(id, resumeItemId, jdItemId),
  );
  return response.data;
}

export async function getSkillGapSummary(id: string, jdItemId?: string): Promise<SkillGapSummary> {
  const response = await apiClient.get<ApiResponse<SkillGapSummary>>(
    apiEndpoints.scoringBatches.skillGapSummary(id),
    { params: jdItemId ? { jdItemId } : undefined },
  );
  return response.data;
}

// The export endpoint returns a raw text/csv body (not the {success,message,data} JSON
// envelope), so this bypasses apiClient and triggers a real browser download.
export async function downloadScoringBatchCsv(id: string, batchName: string | null): Promise<void> {
  const baseUrl = envConfig.apiBaseUrl.replace(/\/$/, '');
  const token = getStoredAccessToken();

  const response = await fetch(`${baseUrl}${apiEndpoints.scoringBatches.export(id)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Export failed (${response.status})`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(batchName || 'scoring-batch').replace(/[^a-z0-9-]+/gi, '-')}-${id}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function cancelScoringBatch(id: string): Promise<CancelBatchResult> {
  const response = await apiClient.post<ApiResponse<CancelBatchResult>>(
    apiEndpoints.scoringBatches.cancel(id),
    {},
  );
  return response.data;
}

export async function promoteScoringBatchItems(
  id: string,
  items: PromoteBatchItem[],
): Promise<PromoteBatchItemResult[]> {
  const response = await apiClient.post<ApiResponse<PromoteBatchItemResult[]>>(
    apiEndpoints.scoringBatches.promote(id),
    { items },
  );
  return response.data;
}
