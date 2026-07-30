import { ROUTES } from '@/config/routes.config';
import type { UserRole } from '@/features/auth/types/auth.type';

const ALL_ROLES: UserRole[] = ['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'DEV'];

// DEV is a platform-level role for the internal content team, not tied to any
// organization's recruiting workflow — it only ever sees the Interview Question Bank.
const ORG_ROLES: UserRole[] = ['ADMIN', 'RECRUITER', 'HIRING_MANAGER'];

type RouteAccessRule = {
  prefix: string;
  roles: UserRole[];
};

// Ordered by prefix length (longest first) so the most specific rule always wins.
const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
  { prefix: '/interview-questions', roles: ['DEV'] },
  { prefix: '/audit-log', roles: ['ADMIN'] },
  { prefix: '/users', roles: ['ADMIN'] },
  { prefix: ROUTES.MY_PROFILE, roles: ALL_ROLES },
];

// Any route not covered above is assumed to be an org-scoped recruiting feature — DEV is
// excluded by default rather than opted in per-route.
export function getRequiredRoles(pathname: string): UserRole[] {
  const rule = ROUTE_ACCESS_RULES.find(
    (candidate) => pathname === candidate.prefix || pathname.startsWith(`${candidate.prefix}/`),
  );

  return rule ? rule.roles : ORG_ROLES;
}

export function canAccessRoute(pathname: string, role: UserRole): boolean {
  return getRequiredRoles(pathname).includes(role);
}

export function getDefaultRouteForRole(role: UserRole): string {
  return role === 'DEV' ? ROUTES.INTERVIEW_QUESTIONS : ROUTES.DASHBOARD;
}
