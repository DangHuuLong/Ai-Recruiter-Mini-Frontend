import { envConfig } from '@/config/env.config';
import { ROUTES } from '@/config/routes.config';
import { clearStoredAuthSession, getStoredAccessToken } from '@/lib/auth/auth-storage';

import { clearApiCache, readApiCache, writeApiCache } from './api-cache';
import { ApiError } from './api-error';
import type { ApiErrorResponse, RequestOptions } from './api-types';

// A 401 on a request that carried a token means the session is stale/expired — clear it and
// bounce to login. A 401 with no token (e.g. bad login credentials) is a normal error the
// caller should handle inline, not a session expiry.
const handleUnauthorized = () => {
  clearStoredAuthSession();
  clearApiCache();

  if (typeof window !== 'undefined' && window.location.pathname !== ROUTES.LOGIN) {
    window.location.assign(ROUTES.LOGIN);
  }
};

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

const createXhrFallbackErrorResponse = (
  xhr: XMLHttpRequest,
  path: string,
): ApiErrorResponse => {
  return {
    success: false,
    statusCode: xhr.status,
    message: xhr.statusText || 'Request failed',
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

const parseXhrResponse = <T>(xhr: XMLHttpRequest, path: string): T => {
  const contentType = xhr.getResponseHeader('content-type');
  const isJson = contentType?.includes('application/json');

  const data = isJson && xhr.responseText ? JSON.parse(xhr.responseText) : null;

  if (xhr.status < 200 || xhr.status >= 300) {
    if (data && typeof data === 'object' && 'success' in data) {
      throw new ApiError(data as ApiErrorResponse, xhr.status);
    }

    throw new ApiError(createXhrFallbackErrorResponse(xhr, path), xhr.status);
  }

  return data as T;
};

const buildRequestHeaders = (
  body: RequestOptions['body'],
  headers?: HeadersInit,
): HeadersInit => {
  const isFormData = body instanceof FormData;
  const accessToken = getStoredAccessToken();

  return {
    ...(!isFormData ? DEFAULT_HEADERS : {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...headers,
  };
};

const setXhrHeaders = (xhr: XMLHttpRequest, headers: HeadersInit) => {
  Object.entries(headers).forEach(([key, value]) => {
    if (typeof value === 'string') {
      xhr.setRequestHeader(key, value);
    }
  });
};

const request = async <T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { params, body, headers, noCache, ...fetchOptions } = options;

  const isFormData = body instanceof FormData;
  const url = buildUrl(path, params);
  const hadToken = Boolean(getStoredAccessToken());

  if (method === 'GET' && !noCache) {
    const cached = readApiCache<T>(url);
    if (cached !== undefined) {
      return cached;
    }
  }

  const response = await fetch(url, {
    method,
    headers: buildRequestHeaders(body, headers),
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    ...fetchOptions,
  });

  if (response.status === 401 && hadToken) {
    handleUnauthorized();
  }

  const result = await parseResponse<T>(response, normalizePath(path));

  if (method === 'GET') {
    if (!noCache) writeApiCache(url, result);
  } else {
    // Any successful mutation can affect data behind other GET endpoints (not just this
    // one path) — e.g. promoting a batch cell touches candidates/applications/evaluations.
    // Clearing everything is simple and always correct; the cost is just a few refetches.
    clearApiCache();
  }

  return result;
};

const uploadWithProgress = async <T>(
  path: string,
  formData: FormData,
  options: RequestOptions = {},
): Promise<T> => {
  const { params, headers, onUploadProgress } = options;
  const url = buildUrl(path, params);
  const normalizedPath = normalizePath(path);
  const hadToken = Boolean(getStoredAccessToken());

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    setXhrHeaders(xhr, buildRequestHeaders(formData, headers));

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onUploadProgress) {
        return;
      }

      const percent = Math.round((event.loaded / event.total) * 100);

      onUploadProgress({
        loaded: event.loaded,
        total: event.total,
        percent,
      });
    };

    xhr.onload = () => {
      if (xhr.status === 401 && hadToken) {
        handleUnauthorized();
      }

      try {
        resolve(parseXhrResponse<T>(xhr, normalizedPath));
      } catch (error) {
        reject(error);
      }
    };

    xhr.onerror = () => {
      reject(
        new ApiError(
          createXhrFallbackErrorResponse(xhr, normalizedPath),
          xhr.status || 500,
        ),
      );
    };

    xhr.send(formData);
  });
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
    if (options?.onUploadProgress) {
      return uploadWithProgress<T>(path, formData, options);
    }

    return request<T>('POST', path, {
      ...options,
      body: formData,
    });
  },
};