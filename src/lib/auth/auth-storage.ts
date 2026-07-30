import type { AuthUser } from '@/features/auth/types/auth.type';

const ACCESS_TOKEN_STORAGE_KEY = 'ai_recruiter_access_token';
const AUTH_USER_STORAGE_KEY = 'ai_recruiter_auth_user';

const isBrowser = () => typeof window !== 'undefined';

export const getStoredAccessToken = (): string | null => {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const setStoredAccessToken = (accessToken: string) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
};

export const getStoredAuthUser = (): AuthUser | null => {
  if (!isBrowser()) {
    return null;
  }

  const value = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
};

export const setStoredAuthUser = (user: AuthUser) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredAuthSession = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};
