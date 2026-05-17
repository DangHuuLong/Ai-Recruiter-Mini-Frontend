import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse } from '@/lib/api/api-types';

import type { LoginPayload, LoginResult } from '@/features/auth/types/auth.type';

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await apiClient.post<ApiResponse<LoginResult>>(
    apiEndpoints.auth.login,
    payload,
  );

  return response.data;
}
