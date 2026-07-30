'use client';

import { create } from 'zustand';

import type { AuthUser, LoginResult } from '@/features/auth/types/auth.type';
import { clearApiCache } from '@/lib/api/api-cache';
import {
  clearStoredAuthSession,
  getStoredAccessToken,
  getStoredAuthUser,
  setStoredAccessToken,
  setStoredAuthUser,
} from '@/lib/auth/auth-storage';

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  hydrate: () => void;
  setSession: (session: LoginResult) => void;
  updateUser: (user: AuthUser) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isHydrated: false,

  hydrate: () => {
    set({
      accessToken: getStoredAccessToken(),
      user: getStoredAuthUser(),
      isHydrated: true,
    });
  },

  setSession: (session) => {
    setStoredAccessToken(session.accessToken);
    setStoredAuthUser(session.user);

    set({
      accessToken: session.accessToken,
      user: session.user,
      isHydrated: true,
    });
  },

  updateUser: (user) => {
    setStoredAuthUser(user);
    set({ user });
  },

  clearSession: () => {
    clearStoredAuthSession();
    clearApiCache();

    set({
      accessToken: null,
      user: null,
      isHydrated: true,
    });
  },
}));

export const selectIsAuthenticated = (state: AuthState) => {
  return Boolean(state.accessToken && state.user);
};
