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

export type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: QueryParams;
  body?: unknown;
};