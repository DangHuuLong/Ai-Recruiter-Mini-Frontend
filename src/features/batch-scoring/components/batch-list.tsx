'use client';

import { EyeIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  ActionIconButton,
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from '@/components/common';
import { ROUTES } from '@/config/routes.config';
import {
  MOCK_BATCHES,
  STATUS_CLASSES,
  STATUS_LABELS,
  type MockBatchSummary,
  type ScoringBatchStatus,
} from '@/features/batch-scoring/mock/batch-scoring-mock-data';
import { sortMock } from '@/lib/utils/mock-delay';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format-date';

const STATUS_FILTER_OPTIONS = (Object.keys(STATUS_LABELS) as ScoringBatchStatus[]).map((status) => ({
  label: STATUS_LABELS[status],
  value: status,
}));

function buildColumns(status: ScoringBatchStatus | ''): DataTableColumn<MockBatchSummary>[] {
  return [
    {
      key: 'name',
      header: 'Batch name',
      sortKey: 'name',
      render: (batch) => (
        <Link href={`${ROUTES.BATCH_SCORING}/${batch.id}`} className="font-semibold text-primary hover:underline">
          {batch.name}
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
      sortKey: 'totalCvCount',
      render: (batch) => <p className="text-on-surface-variant">{batch.totalCvCount}</p>,
    },
    {
      key: 'jds',
      header: 'JDs',
      sortKey: 'totalJdCount',
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
  const [status, setStatus] = useState<ScoringBatchStatus | ''>('');
  const [sort, setSort] = useState<DataTableSort | null>(null);

  const visibleBatches = useMemo(() => {
    let filtered = MOCK_BATCHES;
    if (status) filtered = filtered.filter((batch) => batch.status === status);
    return sortMock(filtered, sort?.key, sort?.order);
  }, [status, sort]);

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

      {MOCK_BATCHES.length === 0 ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-12 text-center shadow-card">
          <p className="text-sm font-semibold text-on-surface">No batches yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Create your first batch to start scoring candidates against job descriptions.
          </p>
        </div>
      ) : (
        <DataTable
          data={visibleBatches}
          columns={buildColumns(status)}
          getRowKey={(batch) => batch.id}
          sort={sort}
          onSortChange={(key, order) => setSort({ key, order })}
          onFilterChange={(key, value) => {
            if (key === 'status') setStatus(value as ScoringBatchStatus | '');
          }}
        />
      )}
    </div>
  );
}
