'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CopyIcon, EyeIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  ActionIconButton,
  DataTable,
  ListControls,
  type DataTableColumn,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getAuditLogs } from '@/features/audit-log/api/audit-log.api';
import { ACTION_CLASSES, AUDIT_RESOURCE_TYPES, type AuditLog } from '@/features/audit-log/types/audit-log.type';
import { getUsers } from '@/features/users/api/user.api';
import type { User } from '@/features/users/types/user.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { cn } from '@/lib/utils/cn';
import { formatDateTime } from '@/lib/utils/format-date';

const PAGE_SIZE = 20;

const RESOURCE_TYPE_FILTER_OPTIONS = AUDIT_RESOURCE_TYPES.map((type) => ({ label: type, value: type }));

function buildColumns(
  t: ReturnType<typeof useTranslations<'auditLog'>>,
  resourceType: string,
  actorUserId: string,
  actorOptions: { label: string; value: string }[],
  onViewDetails: (log: AuditLog) => void,
): DataTableColumn<AuditLog>[] {
  return [
    {
      key: 'timestamp',
      header: t('columns.timestamp'),
      render: (log) => (
        <p className="whitespace-nowrap text-on-surface-variant">{formatDateTime(log.createdAt)}</p>
      ),
    },
    {
      key: 'actor',
      header: t('columns.actor'),
      filter: { key: 'actorUserId', options: actorOptions, activeValue: actorUserId },
      render: (log) => <p className="text-on-surface">{log.actor?.fullName ?? log.actor?.email ?? '—'}</p>,
    },
    {
      key: 'action',
      header: t('columns.status'),
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
      header: t('columns.resource'),
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
      header: t('columns.action'),
      className: 'text-right',
      render: (log) => (
        <div className="flex justify-end">
          <ActionIconButton icon={<EyeIcon className="size-4" />} label={t('viewDetails')} onClick={() => onViewDetails(log)} />
        </div>
      ),
    },
  ];
}

export function AuditLogViewer() {
  const t = useTranslations('auditLog');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [resourceType, setResourceType] = useState('');
  const [actorUserId, setActorUserId] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [actors, setActors] = useState<User[]>([]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getAuditLogs({
        page,
        limit: PAGE_SIZE,
        resourceType: resourceType || undefined,
        actorUserId: actorUserId || undefined,
      });
      setLogs(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('errorFallback');
      setErrorMessage(message);
      showToast.error(t('errorFallback'), { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, resourceType, actorUserId]);

  useEffect(() => {
    getUsers({ limit: 100, sortBy: 'fullName', sortOrder: 'asc' })
      .then((response) => setActors(response.data))
      .catch(() => setActors([]));
  }, []);

  const actorOptions = actors.map((user) => ({ label: user.fullName ?? user.email, value: user.id }));

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'resourceType') {
      setResourceType(value);
      setPage(1);
    }
    if (key === 'actorUserId') {
      setActorUserId(value);
      setPage(1);
    }
  };

  if (isLoading && logs.length === 0) {
    return <LoadingState title={t('loadingTitle')} description={t('loadingDescription')} />;
  }

  if (errorMessage && logs.length === 0) {
    return (
      <EmptyState
        title={t('errorTitle')}
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadLogs()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('tryAgain')}
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{t('subtitle')}</p>
      </div>

      <ListControls pagination={{ ...meta, onPageChange: setPage }} />

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-12 text-center shadow-card">
          <p className="text-sm font-semibold text-on-surface">{t('emptyTitle')}</p>
          <p className="mt-1 text-sm text-on-surface-variant">{t('emptyDescription')}</p>
        </div>
      ) : (
        <DataTable
          data={logs}
          columns={buildColumns(t, resourceType, actorUserId, actorOptions, setSelectedLog)}
          getRowKey={(log) => log.id}
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
                <h2 className="text-lg font-bold text-on-surface">{t('detail.title')}</h2>
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
                  <dt className="text-on-surface-muted">{t('detail.action')}</dt>
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
                  <dt className="text-on-surface-muted">{t('detail.resource')}</dt>
                  <dd className="font-semibold text-on-surface">
                    {selectedLog.resourceType}
                    {selectedLog.resourceId ? ` #${selectedLog.resourceId}` : ''}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-outline pt-4">
                  <dt className="text-on-surface-muted">{t('detail.actor')}</dt>
                  <dd className="font-semibold text-on-surface">
                    {selectedLog.actor?.fullName ?? selectedLog.actor?.email ?? '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-outline pt-4">
                  <dt className="text-on-surface-muted">{t('detail.timestamp')}</dt>
                  <dd className="font-semibold text-on-surface">{formatDateTime(selectedLog.createdAt)}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-outline pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    {t('detail.metadata')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        JSON.stringify(selectedLog.metadata ?? null, null, 2),
                      );
                      showToast.success(t('detail.copySuccess'));
                    }}
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
                  >
                    <CopyIcon className="size-3.5" />
                    {t('detail.copyJson')}
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
