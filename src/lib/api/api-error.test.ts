import { describe, expect, it } from 'vitest';

import { ApiError, isApiError } from './api-error';
import type { ApiErrorResponse } from './api-types';

function buildResponse(overrides: Partial<ApiErrorResponse> = {}): ApiErrorResponse {
  return {
    success: false,
    statusCode: 400,
    message: 'Validation failed',
    errors: [{ field: 'email', message: 'must be a valid email' }],
    timestamp: '2026-03-15T12:00:00Z',
    path: '/api/auth/login',
    ...overrides,
  };
}

describe('ApiError', () => {
  it('carries the response message as the Error message', () => {
    const error = new ApiError(buildResponse(), 400);

    expect(error.message).toBe('Validation failed');
    expect(error.name).toBe('ApiError');
  });

  it('copies statusCode/errors/timestamp/path from the response', () => {
    const error = new ApiError(buildResponse(), 400);

    expect(error.statusCode).toBe(400);
    expect(error.errors).toEqual([{ field: 'email', message: 'must be a valid email' }]);
    expect(error.timestamp).toBe('2026-03-15T12:00:00Z');
    expect(error.path).toBe('/api/auth/login');
  });

  it('falls back to the HTTP status code when the response omits statusCode', () => {
    const response = buildResponse();
    // @ts-expect-error - simulating a malformed/legacy error body missing statusCode
    delete response.statusCode;

    const error = new ApiError(response, 500);

    expect(error.statusCode).toBe(500);
  });
});

describe('isApiError', () => {
  it('returns true for an ApiError instance', () => {
    expect(isApiError(new ApiError(buildResponse(), 400))).toBe(true);
  });

  it('returns false for a plain Error', () => {
    expect(isApiError(new Error('boom'))).toBe(false);
  });

  it('returns false for a non-error value', () => {
    expect(isApiError({ message: 'not an error' })).toBe(false);
  });
});
