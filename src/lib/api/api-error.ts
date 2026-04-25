import type { ApiErrorResponse, ErrorItem } from './api-types';

export class ApiError extends Error {
  statusCode: number;
  errors: ErrorItem[];
  timestamp?: string;
  path?: string;

  constructor(response: ApiErrorResponse, statusCode: number) {
    super(response.message);

    this.name = 'ApiError';
    this.statusCode = response.statusCode ?? statusCode;
    this.errors = response.errors;
    this.timestamp = response.timestamp;
    this.path = response.path;
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};