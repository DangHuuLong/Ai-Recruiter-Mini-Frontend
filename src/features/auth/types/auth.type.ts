export type UserRole = 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'INTERVIEWER' | string;

export type AuthUser = {
  id: string;
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
