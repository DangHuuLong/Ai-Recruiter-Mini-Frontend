'use client';

import { ClipboardCheckIcon, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

const STATUS_FILTER_OPTIONS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Failed', value: 'FAILED' },
];

function buildColumns(status: EvaluationStatus | ''): DataTableColumn<Evaluation>[] {
  return [
    {
      key: 'candidate',
      header: 'Candidate',
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
      header: 'Job description',
      render: (evaluation) => (
        <p className="max-w-xs truncate text-sm text-on-surface-variant">
          {evaluation.application?.jobDescription?.title || 'Not available'}
        </p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      filter: { key: 'status', options: STATUS_FILTER_OPTIONS, activeValue: status },
      render: (evaluation) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[evaluation.status]}`}>
          {evaluation.status}
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Overall score',
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
      header: 'Created',
      sortKey: 'createdAt',
      render: (evaluation) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">
          {evaluation.createdAt ? formatDateTime(evaluation.createdAt) : 'Not recorded'}
        </p>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (evaluation) => (
        <div className="flex justify-end">
          <ActionIconButton href={`/evaluations/${evaluation.id}`} icon={<EyeIcon className="size-4" />} label="View" />
        </div>
      ),
    },
  ];
}

export function EvaluationList() {
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
      const message = error instanceof Error ? error.message : 'Failed to load evaluations';
      setErrorMessage(message);
      showToast.error('Failed to load evaluations', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEvaluations();
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
    return <LoadingState title="Loading evaluations..." description="Please wait while evaluations are being loaded." />;
  }

  if (errorMessage && evaluations.length === 0) {
    return (
      <EmptyState
        title="Failed to load evaluations"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadEvaluations()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Try again
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
          <p className="text-sm font-semibold text-on-surface-variant">Total evaluations</p>
          <p className="text-2xl font-bold text-on-surface">{meta.total}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-surface-muted">
            Page <span className="font-semibold text-on-surface">{meta.page}</span> of{' '}
            <span className="font-semibold text-on-surface">{meta.totalPages || 1}</span> ·{' '}
            <span className="font-semibold text-on-surface">{meta.total}</span> total
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-outline bg-surface-lowest px-3 text-sm font-semibold text-on-surface transition hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setPage((current) => Math.min(meta.totalPages, current + 1))}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-outline bg-surface-lowest px-3 text-sm font-semibold text-on-surface transition hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {evaluations.length === 0 ? (
        <EmptyState
          title="No evaluations found"
          description="Create an evaluation from an application, or adjust your filter."
          action={
            <Link
              href="/applications"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
            >
              Go to Applications
            </Link>
          }
        />
      ) : (
        <DataTable
          data={evaluations}
          columns={buildColumns(status)}
          getRowKey={(evaluation) => evaluation.id}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      )}
    </section>
  );
}
