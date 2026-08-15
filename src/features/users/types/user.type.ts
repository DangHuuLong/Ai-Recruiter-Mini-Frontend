// DEV is a separate, non-org-scoped role reserved for the platform owner (assigned directly
// in the database, not through this org-facing Team Members UI) — intentionally excluded here,
// matching the backend's ORG_ASSIGNABLE_ROLES.
export type OrgUserRole = 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';

export const ROLE_LABELS: Record<OrgUserRole, string> = {
  ADMIN: 'Admin',
  RECRUITER: 'Recruiter',
  HIRING_MANAGER: 'Hiring Manager',
};

// Maps each role to the message key under common.roleLabels — pass to
// t('roleLabels.' + ROLE_LABEL_KEYS[role]) instead of the English ROLE_LABELS map.
// Covers DEV too (not part of OrgUserRole) since my-profile.tsx can display a DEV account.
export const ROLE_LABEL_KEYS: Record<OrgUserRole | 'DEV', string> = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  HIRING_MANAGER: 'hiringManager',
  DEV: 'dev',
};

export type User = {
  id: string;
  organizationId: string;
  email: string;
  fullName: string | null;
  role: OrgUserRole;
  isActive: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserQuery = {
  page?: number;
  limit?: number;
  search?: string;
  role?: OrgUserRole;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'email' | 'fullName' | 'role';
  sortOrder?: 'asc' | 'desc';
};

export type CreateUserPayload = {
  email: string;
  password: string;
  fullName?: string;
  role?: OrgUserRole;
};

export type UpdateUserPayload = {
  fullName?: string;
  role?: OrgUserRole;
  isActive?: boolean;
};
