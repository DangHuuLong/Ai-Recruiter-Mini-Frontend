// Mirrors User entity + CreateUserDto/UpdateUserDto from Ai-Recruiter-Mini-Backend
// (src/modules/users/) — read directly from source.

// DEV is a separate, non-org-scoped role reserved for the platform owner (assigned directly
// in the database, not through this org-facing Team Members UI) — intentionally excluded here.
export type UserRole = 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  RECRUITER: 'Recruiter',
  HIRING_MANAGER: 'Hiring Manager',
};

export type MockUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  isActive: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
};

// Simulated "logged in as" user for testing restricted-state UI (can't edit own role,
// can't deactivate self, can't demote the last active admin).
export const MOCK_CURRENT_USER_ID = 'user-1';

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user-1',
    email: 'sarah.jenkins@company.com',
    fullName: 'Sarah Jenkins',
    role: 'ADMIN',
    isActive: true,
    emailVerifiedAt: '2026-06-01T08:00:00Z',
    createdAt: '2026-06-01T08:00:00Z',
  },
  {
    id: 'user-2',
    email: 'marcus.lee@company.com',
    fullName: 'Marcus Lee',
    role: 'RECRUITER',
    isActive: true,
    emailVerifiedAt: '2026-06-10T10:00:00Z',
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'user-3',
    email: 'nora.kim@company.com',
    fullName: 'Nora Kim',
    role: 'HIRING_MANAGER',
    isActive: true,
    emailVerifiedAt: null,
    createdAt: '2026-07-02T14:30:00Z',
  },
  {
    id: 'user-4',
    email: 'alex.chen@company.com',
    fullName: 'Alex Chen',
    role: 'HIRING_MANAGER',
    isActive: false,
    emailVerifiedAt: '2026-05-15T09:00:00Z',
    createdAt: '2026-05-15T09:00:00Z',
  },
];

export function getMockUser(id: string): MockUser | null {
  return MOCK_USERS.find((user) => user.id === id) ?? null;
}

export function isLastActiveAdmin(user: MockUser, allUsers: MockUser[]): boolean {
  if (user.role !== 'ADMIN' || !user.isActive) return false;
  const otherActiveAdmins = allUsers.filter(
    (u) => u.id !== user.id && u.role === 'ADMIN' && u.isActive,
  );
  return otherActiveAdmins.length === 0;
}
