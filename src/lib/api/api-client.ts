import { envConfig } from '@/config/env.config';

import { ApiError } from './api-error';
import type { ApiErrorResponse, RequestOptions } from './api-types';

const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

const normalizeBaseUrl = (baseUrl: string): string => {
  return baseUrl.replace(/\/$/, '');
};

const normalizePath = (path: string): string => {
  return path.startsWith('/') ? path : `/${path}`;
};

const buildUrl = (path: string, params?: RequestOptions['params']): string => {
  const baseUrl = normalizeBaseUrl(envConfig.apiBaseUrl);
  const normalizedPath = normalizePath(path);

  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

const createFallbackErrorResponse = (
  response: Response,
  path: string,
): ApiErrorResponse => {
  return {
    success: false,
    statusCode: response.status,
    message: response.statusText || 'Request failed',
    errors: [],
    timestamp: new Date().toISOString(),
    path,
  };
};

const parseJsonResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!isJson) {
    return null;
  }

  return response.json();
};

const parseResponse = async <T>(
  response: Response,
  path: string,
): Promise<T> => {
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    if (data && typeof data === 'object' && 'success' in data) {
      throw new ApiError(data as ApiErrorResponse, response.status);
    }

    throw new ApiError(createFallbackErrorResponse(response, path), response.status);
  }

  return data as T;
};

const request = async <T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { params, body, headers, ...fetchOptions } = options;

  const isFormData = body instanceof FormData;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    method,
    headers: {
      ...(!isFormData ? DEFAULT_HEADERS : {}),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    ...fetchOptions,
  });

  return parseResponse<T>(response, normalizePath(path));
};

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => {
    return request<T>('GET', path, options);
  },

  post: <T>(path: string, body?: unknown, options?: RequestOptions) => {
    return request<T>('POST', path, {
      ...options,
      body,
    });
  },

  put: <T>(path: string, body?: unknown, options?: RequestOptions) => {
    return request<T>('PUT', path, {
      ...options,
      body,
    });
  },

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => {
    return request<T>('PATCH', path, {
      ...options,
      body,
    });
  },

  delete: <T>(path: string, options?: RequestOptions) => {
    return request<T>('DELETE', path, options);
  },

  upload: <T>(path: string, formData: FormData, options?: RequestOptions) => {
    return request<T>('POST', path, {
      ...options,
      body: formData,
    });
  },
};