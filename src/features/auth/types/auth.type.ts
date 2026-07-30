export type UserRole = 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'DEV';

export type AuthUser = {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
  tokenType: 'Bearer' | string;
  expiresIn: number;
  user: AuthUser;
};

export type RegisterOrganizationPayload = {
  organizationName: string;
  adminFullName: string;
  adminEmail: string;
  adminPassword: string;
};

export type VerifyEmailPayload = {
  token: string;
};

export type ResendVerificationPayload = {
  email: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export type MessageResult = {
  message: string;
};
