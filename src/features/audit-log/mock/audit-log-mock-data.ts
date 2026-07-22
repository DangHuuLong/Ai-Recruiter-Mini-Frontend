// Mirrors AuditLog entity + query params from Ai-Recruiter-Mini-Backend
// (src/modules/audit-logs/) — read directly from source.
//
// Note: action/resourceType are plain strings (not Prisma enums), only populated for
// routes explicitly tagged with @AuditLog() (opt-in). Confirmed tagged routes so far:
// EvaluationConfig DELETE/BULK_DELETE, User UPDATE. The API has no date-range filter
// (only resourceType/resourceId/actorUserId + pagination), so this UI doesn't offer one.

export type MockAuditLog = {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: { id: string; fullName: string | null; email: string } | null;
};

export const MOCK_AUDIT_LOGS: MockAuditLog[] = [
  {
    id: 'log-1',
    action: 'UPDATE',
    resourceType: 'User',
    resourceId: 'user-4',
    metadata: { role: 'HIRING_MANAGER' },
    createdAt: '2026-07-20T10:12:00Z',
    actor: { id: 'user-1', fullName: 'Sarah Jenkins', email: 'sarah.jenkins@company.com' },
  },
  {
    id: 'log-2',
    action: 'DELETE',
    resourceType: 'EvaluationConfig',
    resourceId: 'config-9',
    metadata: null,
    createdAt: '2026-07-19T15:40:00Z',
    actor: { id: 'user-1', fullName: 'Sarah Jenkins', email: 'sarah.jenkins@company.com' },
  },
  {
    id: 'log-3',
    action: 'BULK_DELETE',
    resourceType: 'EvaluationConfig',
    resourceId: null,
    metadata: { ids: ['config-10', 'config-11'] },
    createdAt: '2026-07-18T09:05:00Z',
    actor: { id: 'user-2', fullName: 'Marcus Lee', email: 'marcus.lee@company.com' },
  },
  {
    id: 'log-4',
    action: 'UPDATE',
    resourceType: 'User',
    resourceId: 'user-3',
    metadata: { isActive: false },
    createdAt: '2026-07-16T13:22:00Z',
    actor: { id: 'user-1', fullName: 'Sarah Jenkins', email: 'sarah.jenkins@company.com' },
  },
];

export const AUDIT_RESOURCE_TYPES = ['EvaluationConfig', 'User'];

export const ACTION_CLASSES: Record<string, string> = {
  DELETE: 'bg-error-container text-error',
  BULK_DELETE: 'bg-warning-container text-on-surface',
  UPDATE: 'bg-info/15 text-info',
  CREATE: 'bg-success-container text-success',
};
