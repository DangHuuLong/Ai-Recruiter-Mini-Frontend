'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CopyIcon, EyeIcon, XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  ActionIconButton,
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from '@/components/common';
import { showToast } from '@/components/feedback';
import {
  ACTION_CLASSES,
  AUDIT_RESOURCE_TYPES,
  MOCK_AUDIT_LOGS,
  type MockAuditLog,
} from '@/features/audit-log/mock/audit-log-mock-data';
import { MOCK_USERS } from '@/features/users/mock/user-mock-data';
import { sortMock } from '@/lib/utils/mock-delay';
import { cn } from '@/lib/utils/cn';
import { formatDateTime } from '@/lib/utils/format-date';

const RESOURCE_TYPE_FILTER_OPTIONS = AUDIT_RESOURCE_TYPES.map((type) => ({ label: type, value: type }));

const ACTOR_FILTER_OPTIONS = MOCK_USERS.map((user) => ({
  label: user.fullName ?? user.email,
  value: user.id,
}));

const ACTION_FILTER_OPTIONS = Object.keys(ACTION_CLASSES).map((action) => ({ label: action, value: action }));

function buildColumns(
  resourceType: string,
  actorUserId: string,
  action: string,
  onViewDetails: (log: MockAuditLog) => void,
): DataTableColumn<MockAuditLog>[] {
  return [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortKey: 'createdAt',
      render: (log) => (
        <p className="whitespace-nowrap text-on-surface-variant">{formatDateTime(log.createdAt)}</p>
      ),
    },
    {
      key: 'actor',
      header: 'Actor',
      filter: { key: 'actorUserId', options: ACTOR_FILTER_OPTIONS, activeValue: actorUserId },
      render: (log) => <p className="text-on-surface">{log.actor?.fullName ?? log.actor?.email ?? '—'}</p>,
    },
    {
      key: 'action',
      header: 'Status',
      filter: { key: 'action', options: ACTION_FILTER_OPTIONS, activeValue: action },
      render: (log) => (
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            ACTION_CLASSES[log.action] ?? 'bg-surface-variant text-on-surface-variant',
          )}
        >
          {log.action}
        </span>
      ),
    },
    {
      key: 'resource',
      header: 'Resource',
      filter: { key: 'resourceType', options: RESOURCE_TYPE_FILTER_OPTIONS, activeValue: resourceType },
      render: (log) => (
        <p className="text-on-surface-variant">
          {log.resourceType}
          {log.resourceId ? <span className="ml-1 text-xs text-on-surface-muted">#{log.resourceId}</span> : null}
        </p>
      ),
    },
    {
      key: 'action-column',
      header: 'Action',
      className: 'text-right',
      render: (log) => (
        <div className="flex justify-end">
          <ActionIconButton icon={<EyeIcon className="size-4" />} label="View details" onClick={() => onViewDetails(log)} />
        </div>
      ),
    },
  ];
}

export function AuditLogViewer() {
  const [resourceType, setResourceType] = useState('');
  const [actorUserId, setActorUserId] = useState('');
  const [action, setAction] = useState('');
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [selectedLog, setSelectedLog] = useState<MockAuditLog | null>(null);

  const filtered = useMemo(() => {
    const result = MOCK_AUDIT_LOGS.filter((log) => {
      if (resourceType && log.resourceType !== resourceType) return false;
      if (actorUserId && log.actor?.id !== actorUserId) return false;
      if (action && log.action !== action) return false;
      return true;
    });
    return sortMock(result, sort?.key, sort?.order);
  }, [resourceType, actorUserId, action, sort]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'resourceType') setResourceType(value);
    if (key === 'actorUserId') setActorUserId(value);
    if (key === 'action') setAction(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Audit Log</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Track sensitive actions taken across your organization.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-12 text-center shadow-card">
          <p className="text-sm font-semibold text-on-surface">No audit history yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Sensitive actions will show up here as your team uses the app.
          </p>
        </div>
      ) : (
        <DataTable
          data={filtered}
          columns={buildColumns(resourceType, actorUserId, action, setSelectedLog)}
          getRowKey={(log) => log.id}
          sort={sort}
          onSortChange={(key, order) => setSort({ key, order })}
          onFilterChange={handleFilterChange}
        />
      )}

      <AnimatePresence>
        {selectedLog ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-surface-lowest p-6 shadow-panel"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-on-surface">Audit log detail</h2>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="cursor-pointer rounded-full p-1.5 text-on-surface-muted transition-colors hover:bg-surface-variant hover:text-on-surface"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-on-surface-muted">Action</dt>
                  <dd>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        ACTION_CLASSES[selectedLog.action] ?? 'bg-surface-variant text-on-surface-variant',
                      )}
                    >
                      {selectedLog.action}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-outline pt-4">
                  <dt className="text-on-surface-muted">Resource</dt>
                  <dd className="font-semibold text-on-surface">
                    {selectedLog.resourceType}
                    {selectedLog.resourceId ? ` #${selectedLog.resourceId}` : ''}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-outline pt-4">
                  <dt className="text-on-surface-muted">Actor</dt>
                  <dd className="font-semibold text-on-surface">
                    {selectedLog.actor?.fullName ?? selectedLog.actor?.email ?? '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-outline pt-4">
                  <dt className="text-on-surface-muted">Timestamp</dt>
                  <dd className="font-semibold text-on-surface">{formatDateTime(selectedLog.createdAt)}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-outline pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    Metadata
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        JSON.stringify(selectedLog.metadata ?? null, null, 2),
                      );
                      showToast.success('Metadata copied to clipboard');
                    }}
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
                  >
                    <CopyIcon className="size-3.5" />
                    Copy JSON
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-surface-variant p-3 text-xs text-on-surface-variant">
                  {selectedLog.metadata ? JSON.stringify(selectedLog.metadata, null, 2) : 'null'}
                </pre>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
