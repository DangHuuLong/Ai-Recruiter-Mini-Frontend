'use client';

import { ClipboardCheckIcon, EyeIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  ActionIconButton,
  AvatarChip,
  DataTable,
  type DataTableColumn,
  type DataTableSort,
  type DataTableSortOrder,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getEvaluations } from '@/features/evaluations/api/evaluation.api';
import type { Evaluation, EvaluationQuery, EvaluationStatus } from '@/features/evaluations/types/evaluation.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { formatDateTime } from '@/lib/utils/format-date';

const PAGE_SIZE = 10;

const STATUS_CLASSES: Record<EvaluationStatus, string> = {
  PENDING: 'bg-surface-variant text-on-surface-variant',
  PROCESSING: 'bg-info/15 text-info',
  COMPLETED: 'bg-success-container text-success',
  FAILED: 'bg-error-container text-error',
};

function buildColumns(
  t: ReturnType<typeof useTranslations<'evaluations'>>,
  status: EvaluationStatus | '',
): DataTableColumn<Evaluation>[] {
  const statusFilterOptions = [
    { label: t('statusOptions.pending'), value: 'PENDING' },
    { label: t('statusOptions.processing'), value: 'PROCESSING' },
    { label: t('statusOptions.completed'), value: 'COMPLETED' },
    { label: t('statusOptions.failed'), value: 'FAILED' },
  ];

  return [
    {
      key: 'candidate',
      header: t('columns.candidate'),
      render: (evaluation) => {
        const candidateName = evaluation.application?.candidate?.fullName || evaluation.applicationId;
        return (
          <div className="flex items-center gap-3">
            <AvatarChip name={candidateName} seed={evaluation.applicationId} size="sm" />
            <div>
              <p className="text-sm font-semibold text-on-surface">{candidateName}</p>
              <p className="font-mono text-xs text-on-surface-muted">{evaluation.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'job',
      header: t('columns.jobDescription'),
      render: (evaluation) => (
        <p className="max-w-xs truncate text-sm text-on-surface-variant">
          {evaluation.application?.jobDescription?.title || t('notAvailable')}
        </p>
      ),
    },
    {
      key: 'status',
      header: t('columns.status'),
      filter: { key: 'status', options: statusFilterOptions, activeValue: status },
      render: (evaluation) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[evaluation.status]}`}>
          {evaluation.status}
        </span>
      ),
    },
    {
      key: 'score',
      header: t('columns.overallScore'),
      sortKey: 'overallScore',
      render: (evaluation) =>
        typeof evaluation.overallScore === 'number' ? (
          <p className="text-sm font-semibold text-on-surface">
            {Math.round(evaluation.overallScore)} <span className="font-normal text-on-surface-muted">/ 100</span>
          </p>
        ) : (
          <p className="text-sm text-on-surface-muted">—</p>
        ),
    },
    {
      key: 'createdAt',
      header: t('columns.created'),
      sortKey: 'createdAt',
      render: (evaluation) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">
          {evaluation.createdAt ? formatDateTime(evaluation.createdAt) : t('notRecorded')}
        </p>
      ),
    },
    {
      key: 'action',
      header: t('columns.action'),
      className: 'text-right',
      render: (evaluation) => (
        <div className="flex justify-end">
          <ActionIconButton href={`/evaluations/${evaluation.id}`} icon={<EyeIcon className="size-4" />} label={t('actions.view')} />
        </div>
      ),
    },
  ];
}

export function EvaluationList() {
  const t = useTranslations('evaluations');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [status, setStatus] = useState<EvaluationStatus | ''>('');
  const [sort, setSort] = useState<DataTableSort | null>({ key: 'createdAt', order: 'desc' });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadEvaluations = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getEvaluations({
        page,
        limit: PAGE_SIZE,
        status: status || undefined,
        sortBy: (sort?.key as EvaluationQuery['sortBy']) ?? 'createdAt',
        sortOrder: sort?.order ?? 'desc',
      });
      setEvaluations(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('list.errorFallback');
      setErrorMessage(message);
      showToast.error(t('list.errorFallback'), { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEvaluations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, sort]);

  const handleSortChange = (key: string, order: DataTableSortOrder) => {
    setSort({ key, order });
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') {
      setStatus(value as EvaluationStatus | '');
      setPage(1);
    }
  };

  const canGoPrevious = page > 1;
  const canGoNext = page < meta.totalPages;

  if (isLoading && evaluations.length === 0) {
    return <LoadingState title={t('list.loadingTitle')} description={t('list.loadingDescription')} />;
  }

  if (errorMessage && evaluations.length === 0) {
    return (
      <EmptyState
        title={t('list.errorTitle')}
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadEvaluations()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('list.tryAgain')}
          </button>
        }
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
          <ClipboardCheckIcon className="size-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface-variant">{t('totalEvaluations')}</p>
          <p className="text-2xl font-bold text-on-surface">{meta.total}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-surface-muted">
            {t.rich('pagination.pageInfo', {
              page: meta.page,
              totalPages: meta.totalPages || 1,
              total: meta.total,
              b: (chunks) => <span className="font-semibold text-on-surface">{chunks}</span>,
            })}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-outline bg-surface-lowest px-3 text-sm font-semibold text-on-surface transition hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('pagination.previous')}
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setPage((current) => Math.min(meta.totalPages, current + 1))}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-outline bg-surface-lowest px-3 text-sm font-semibold text-on-surface transition hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('pagination.next')}
            </button>
          </div>
        </div>
      </div>

      {evaluations.length === 0 ? (
        <EmptyState
          title={t('list.emptyTitle')}
          description={t('list.emptyDescription')}
          action={
            <Link
              href="/applications"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
            >
              {t('list.goToApplications')}
            </Link>
          }
        />
      ) : (
        <DataTable
          data={evaluations}
          columns={buildColumns(t, status)}
          getRowKey={(evaluation) => evaluation.id}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      )}
    </section>
  );
}
