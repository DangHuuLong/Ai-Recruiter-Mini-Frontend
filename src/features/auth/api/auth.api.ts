import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse } from '@/lib/api/api-types';

import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResult,
  MessageResult,
  RegisterOrganizationPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/features/auth/types/auth.type';

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await apiClient.post<ApiResponse<LoginResult>>(
    apiEndpoints.auth.login,
    payload,
  );

  return response.data;
}

export async function registerOrganization(
  payload: RegisterOrganizationPayload,
): Promise<MessageResult> {
  const response = await apiClient.post<ApiResponse<unknown>>(
    apiEndpoints.auth.registerOrganization,
    payload,
  );

  return { message: response.message };
}

export async function verifyEmail(payload: VerifyEmailPayload): Promise<LoginResult> {
  const response = await apiClient.post<ApiResponse<LoginResult>>(
    apiEndpoints.auth.verifyEmail,
    payload,
  );

  return response.data;
}

export async function resendVerification(
  payload: ResendVerificationPayload,
): Promise<MessageResult> {
  const response = await apiClient.post<ApiResponse<unknown>>(
    apiEndpoints.auth.resendVerification,
    payload,
  );

  return { message: response.message };
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResult> {
  const response = await apiClient.post<ApiResponse<unknown>>(
    apiEndpoints.auth.forgotPassword,
    payload,
  );

  return { message: response.message };
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<MessageResult> {
  const response = await apiClient.post<ApiResponse<unknown>>(
    apiEndpoints.auth.resetPassword,
    payload,
  );

  return { message: response.message };
}
