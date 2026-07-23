import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse } from '@/lib/api/api-types';
import type { AuthUser } from '@/features/auth/types/auth.type';
import { useAuthStore } from '@/features/auth/store/auth.store';

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<ApiResponse<AuthUser>>(apiEndpoints.users.me);
  return response.data;
}

// PATCH /users/:id is ADMIN-only on the real backend, even to edit yourself.
export async function updateCurrentUserFullName(fullName: string): Promise<AuthUser> {
  const currentUserId = useAuthStore.getState().user?.id;
  if (!currentUserId) throw new Error('Not authenticated');

  const response = await apiClient.patch<ApiResponse<AuthUser>>(
    apiEndpoints.users.update(currentUserId),
    { fullName },
  );
  return response.data;
}
