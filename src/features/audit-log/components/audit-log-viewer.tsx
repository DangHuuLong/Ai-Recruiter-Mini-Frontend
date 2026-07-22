'use client';

import { useState } from 'react';

import {
  ACTION_CLASSES,
  AUDIT_RESOURCE_TYPES,
  MOCK_AUDIT_LOGS,
  type MockAuditLog,
} from '@/features/audit-log/mock/audit-log-mock-data';
import { MOCK_USERS } from '@/features/users/mock/user-mock-data';
import { cn } from '@/lib/utils/cn';
import { formatDateTime } from '@/lib/utils/format-date';

export function AuditLogViewer() {
  const [resourceType, setResourceType] = useState('');
  const [actorUserId, setActorUserId] = useState('');
  const [selectedLog, setSelectedLog] = useState<MockAuditLog | null>(null);

  const filtered = MOCK_AUDIT_LOGS.filter((log) => {
    if (resourceType && log.resourceType !== resourceType) return false;
    if (actorUserId && log.actor?.id !== actorUserId) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Audit Log</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Track sensitive actions taken across your organization.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          className="h-10 cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
        >
          <option value="">All resource types</option>
          {AUDIT_RESOURCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={actorUserId}
          onChange={(e) => setActorUserId(e.target.value)}
          className="h-10 cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
        >
          <option value="">All team members</option>
          {MOCK_USERS.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullName ?? user.email}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-12 text-center shadow-card">
          <p className="text-sm font-semibold text-on-surface">No audit history yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Sensitive actions will show up here as your team uses the app.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-surface-variant">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Timestamp
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Actor
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Action
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Resource
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-on-surface-variant" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filtered.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-surface-variant/60">
                  <td className="whitespace-nowrap px-5 py-4 text-on-surface-variant">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-on-surface">
                    {log.actor?.fullName ?? log.actor?.email ?? '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        ACTION_CLASSES[log.action] ?? 'bg-surface-variant text-on-surface-variant',
                      )}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">
                    {log.resourceType}
                    {log.resourceId ? (
                      <span className="ml-1 text-xs text-on-surface-muted">#{log.resourceId}</span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="cursor-pointer text-sm font-semibold text-primary hover:underline"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLog ? (
        <div
          onClick={() => setSelectedLog(null)}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-outline bg-surface-lowest p-6 shadow-panel"
          >
            <h2 className="text-lg font-bold text-on-surface">Audit log detail</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-on-surface-muted">Action</dt>
                <dd className="font-semibold text-on-surface">{selectedLog.action}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-on-surface-muted">Resource</dt>
                <dd className="font-semibold text-on-surface">
                  {selectedLog.resourceType}
                  {selectedLog.resourceId ? ` #${selectedLog.resourceId}` : ''}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-on-surface-muted">Actor</dt>
                <dd className="font-semibold text-on-surface">
                  {selectedLog.actor?.fullName ?? selectedLog.actor?.email ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-on-surface-muted">Timestamp</dt>
                <dd className="font-semibold text-on-surface">
                  {formatDateTime(selectedLog.createdAt)}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Metadata
              </p>
              <pre className="overflow-x-auto rounded-lg bg-surface-variant p-3 text-xs text-on-surface-variant">
                {selectedLog.metadata ? JSON.stringify(selectedLog.metadata, null, 2) : 'null'}
              </pre>
            </div>

            <button
              type="button"
              onClick={() => setSelectedLog(null)}
              className="mt-6 w-full cursor-pointer rounded-lg border border-outline px-4 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
