import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, PaginatedApiResponse, QueryParams } from '@/lib/api/api-types';
import type { AuthUser } from '@/features/auth/types/auth.type';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { CreateUserPayload, UpdateUserPayload, User, UserQuery } from '@/features/users/types/user.type';

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<ApiResponse<AuthUser>>(apiEndpoints.users.me);
  return response.data;
}

export async function getUsers(query: UserQuery = {}): Promise<PaginatedApiResponse<User>> {
  return apiClient.get<PaginatedApiResponse<User>>(apiEndpoints.users.list, {
    params: query as QueryParams,
  });
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const response = await apiClient.post<ApiResponse<User>>(apiEndpoints.users.create, payload);
  return response.data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const response = await apiClient.patch<ApiResponse<User>>(apiEndpoints.users.update(id), payload);
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
