'use client';

import { EyeIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  ActionIconButton,
  DataTable,
  ListControls,
  type DataTableColumn,
  type DataTableSort,
  type DataTableSortOrder,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import { getScoringBatches } from '@/features/batch-scoring/api/batch-scoring.api';
import {
  STATUS_CLASSES,
  STATUS_LABELS,
  type ScoringBatchQuery,
  type ScoringBatchStatus,
  type ScoringBatchSummary,
} from '@/features/batch-scoring/types/batch-scoring.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format-date';

const PAGE_SIZE = 10;

const STATUS_FILTER_OPTIONS = (Object.keys(STATUS_LABELS) as ScoringBatchStatus[]).map((status) => ({
  label: STATUS_LABELS[status],
  value: status,
}));

function buildColumns(status: ScoringBatchStatus | ''): DataTableColumn<ScoringBatchSummary>[] {
  return [
    {
      key: 'name',
      header: 'Batch name',
      sortKey: 'name',
      render: (batch) => (
        <Link href={`${ROUTES.BATCH_SCORING}/${batch.id}`} className="font-semibold text-primary hover:underline">
          {batch.name || 'Untitled batch'}
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      filter: { key: 'status', options: STATUS_FILTER_OPTIONS, activeValue: status },
      render: (batch) => (
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_CLASSES[batch.status])}>
          {STATUS_LABELS[batch.status]}
        </span>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (batch) => (
        <p className="text-on-surface-variant">
          {batch.completedPairCount}/{batch.totalPairCount} pairs
        </p>
      ),
    },
    {
      key: 'cvs',
      header: 'CVs',
      render: (batch) => <p className="text-on-surface-variant">{batch.totalCvCount}</p>,
    },
    {
      key: 'jds',
      header: 'JDs',
      render: (batch) => <p className="text-on-surface-variant">{batch.totalJdCount}</p>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortKey: 'createdAt',
      render: (batch) => <p className="whitespace-nowrap text-on-surface-variant">{formatDate(batch.createdAt)}</p>,
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (batch) => (
        <div className="flex justify-end">
          <ActionIconButton href={`${ROUTES.BATCH_SCORING}/${batch.id}`} icon={<EyeIcon className="size-4" />} label="View" />
        </div>
      ),
    },
  ];
}

export function BatchList() {
  const [batches, setBatches] = useState<ScoringBatchSummary[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [status, setStatus] = useState<ScoringBatchStatus | ''>('');
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBatches = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getScoringBatches({
        page,
        limit: PAGE_SIZE,
        status: status || undefined,
        sortBy: (sort?.key as ScoringBatchQuery['sortBy']) ?? 'createdAt',
        sortOrder: sort?.order ?? 'desc',
      });
      setBatches(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load scoring batches';
      setErrorMessage(message);
      showToast.error('Failed to load scoring batches', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, sort]);

  const handleSortChange = (key: string, order: DataTableSortOrder) => {
    setSort({ key, order });
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') {
      setStatus(value as ScoringBatchStatus | '');
      setPage(1);
    }
  };

  if (isLoading && batches.length === 0) {
    return <LoadingState title="Loading scoring batches..." description="Please wait while batches are being loaded." />;
  }

  if (errorMessage && batches.length === 0) {
    return (
      <EmptyState
        title="Failed to load scoring batches"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadBatches()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Scoring Batches</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Run AI matching across many candidates and job descriptions at once.
          </p>
        </div>
        <Link
          href={ROUTES.BATCH_SCORING_CREATE}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
        >
          <PlusIcon className="size-4" />
          New batch
        </Link>
      </div>

      <ListControls pagination={{ ...meta, onPageChange: setPage }} />

      {batches.length === 0 ? (
        <EmptyState
          title="No batches yet"
          description="Create your first batch to start scoring candidates against job descriptions."
        />
      ) : (
        <DataTable
          data={batches}
          columns={buildColumns(status)}
          getRowKey={(batch) => batch.id}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
}
