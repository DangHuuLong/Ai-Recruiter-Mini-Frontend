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

const MOCK_DELAY_MS = 600;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildMockSession = (email: string): LoginResult => ({
  accessToken: 'mock-access-token',
  tokenType: 'Bearer',
  expiresIn: 3600,
  user: {
    id: 'mock-user-id',
    email,
    fullName: 'Sarah Jenkins',
    role: 'ADMIN',
  },
});

export async function login(payload: LoginPayload): Promise<LoginResult> {
  await delay(MOCK_DELAY_MS);
  return buildMockSession(payload.email);
}

export async function registerOrganization(
  payload: RegisterOrganizationPayload,
): Promise<MessageResult> {
  await delay(MOCK_DELAY_MS);
  return { message: `Verification email sent to ${payload.adminEmail}` };
}

export async function verifyEmail(_payload: VerifyEmailPayload): Promise<LoginResult> {
  await delay(MOCK_DELAY_MS);
  return buildMockSession('sarah.jenkins@company.com');
}

export async function resendVerification(
  _payload: ResendVerificationPayload,
): Promise<MessageResult> {
  await delay(MOCK_DELAY_MS);
  return { message: 'Verification email resent' };
}

export async function forgotPassword(_payload: ForgotPasswordPayload): Promise<MessageResult> {
  await delay(MOCK_DELAY_MS);
  return { message: 'Password reset email sent' };
}

export async function resetPassword(_payload: ResetPasswordPayload): Promise<MessageResult> {
  await delay(MOCK_DELAY_MS);
  return { message: 'Password updated' };
}
