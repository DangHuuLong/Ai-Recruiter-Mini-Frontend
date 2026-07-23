// Static-UI review phase — API calls below are commented out and replaced with mock
// implementations backed by the in-memory auth store (the session set at login already
// holds exactly the AuthUser shape the real GET /users/me returns — id/organizationId/
// email/fullName/role, see Ai-Recruiter-Mini-Backend's AuthUser type). To restore real
// integration, uncomment the `apiClient` call in each function and remove the mock
// block. apiClient/apiEndpoints kept imported so the commented-out real calls still
// resolve at a glance — re-enable by uncommenting, no import changes needed.
import { apiClient, apiEndpoints } from '@/lib/api';
import type { AuthUser } from '@/features/auth/types/auth.type';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { mockDelay } from '@/lib/utils/mock-delay';

export async function getCurrentUser(): Promise<AuthUser> {
  // const response = await apiClient.get<ApiResponse<AuthUser>>(apiEndpoints.users.me);
  // return response.data;

  await mockDelay();
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Not authenticated');
  return user;
}

export async function updateCurrentUserFullName(fullName: string): Promise<AuthUser> {
  // const response = await apiClient.patch<ApiResponse<AuthUser>>(
  //   apiEndpoints.users.update(currentUserId),
  //   { fullName },
  // );
  // return response.data;

  await mockDelay();
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Not authenticated');
  // PATCH /users/:id is ADMIN-only on the real backend, even to edit yourself — mirror
  // that restriction here so the mock behaves the same way the real API would.
  if (user.role !== 'ADMIN') {
    throw new Error('Only an organization admin can update their own profile right now.');
  }

  return { ...user, fullName };
}
