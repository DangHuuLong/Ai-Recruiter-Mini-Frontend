export type AuditLog = {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: { id: string; fullName: string | null; email: string } | null;
};

// The backend has no date-range or action filter, and no sort override — only
// resourceType/resourceId/actorUserId + pagination (findAll always orders createdAt desc).
export type AuditLogQuery = {
  page?: number;
  limit?: number;
  resourceType?: string;
  resourceId?: string;
  actorUserId?: string;
};

// Resource types actually tagged with @AuditLog() on the backend today.
export const AUDIT_RESOURCE_TYPES = ['Candidate', 'EvaluationConfig', 'JobDescription', 'ScoringBatch', 'User'];

export const ACTION_CLASSES: Record<string, string> = {
  DELETE: 'bg-error-container text-error',
  BULK_DELETE: 'bg-error-container text-error',
  DEACTIVATE: 'bg-warning-container text-on-surface',
  BULK_DEACTIVATE: 'bg-warning-container text-on-surface',
  CANCEL: 'bg-warning-container text-on-surface',
  UPDATE: 'bg-info/15 text-info',
  PROMOTE: 'bg-success-container text-success',
  CREATE: 'bg-success-container text-success',
};
