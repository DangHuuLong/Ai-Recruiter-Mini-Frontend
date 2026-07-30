export type ErrorItem = {
  field: string | null;
  message: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type PaginatedApiResponse<T> = {
  success: true;
  message: string;
  data: T[];
  meta: PaginationMeta;
};

export type ApiErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errors: ErrorItem[];
  timestamp: string;
  path: string;
};

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number;
};

export type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: QueryParams;
  body?: unknown;
  onUploadProgress?: (progress: UploadProgress) => void;
  // GET responses are cached in-memory by default (see api-cache.ts) — set true to always
  // hit the network, for data that must stay real-time (e.g. status polling).
  noCache?: boolean;
};

// Shared per-id success/failure shape returned by bulk endpoints (e.g. POST
// /candidates/bulk-delete, /job-descriptions/bulk-deactivate,
// /evaluation-configs/bulk-delete) — each item in the array either succeeded with
// its resulting data, or failed with an error message, so one bad id doesn't
// block the rest of the batch.
export type BulkOperationResultItem<T> =
  | { id: string; success: true; data: T }
  | { id: string; success: false; error: string };