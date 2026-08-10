'use client';

import { EyeIcon, PlusIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

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
  STATUS_LABEL_KEYS,
  type ScoringBatchQuery,
  type ScoringBatchStatus,
  type ScoringBatchSummary,
} from '@/features/batch-scoring/types/batch-scoring.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format-date';

const PAGE_SIZE = 10;

function buildColumns(
  t: ReturnType<typeof useTranslations<'batchScoring'>>,
  tCommon: ReturnType<typeof useTranslations<'common'>>,
  status: ScoringBatchStatus | '',
): DataTableColumn<ScoringBatchSummary>[] {
  const statusFilterOptions = (Object.keys(STATUS_LABEL_KEYS) as ScoringBatchStatus[]).map((batchStatus) => ({
    label: tCommon(`statusLabels.${STATUS_LABEL_KEYS[batchStatus]}`),
    value: batchStatus,
  }));

  return [
    {
      key: 'name',
      header: t('columns.batchName'),
      sortKey: 'name',
      render: (batch) => (
        <Link href={`${ROUTES.BATCH_SCORING}/${batch.id}`} className="font-semibold text-primary hover:underline">
          {batch.name || t('untitledBatch')}
        </Link>
      ),
    },
    {
      key: 'status',
      header: t('columns.status'),
      filter: { key: 'status', options: statusFilterOptions, activeValue: status },
      render: (batch) => (
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_CLASSES[batch.status])}>
          {tCommon(`statusLabels.${STATUS_LABEL_KEYS[batch.status]}`)}
        </span>
      ),
    },
    {
      key: 'progress',
      header: t('columns.progress'),
      render: (batch) => (
        <p className="text-on-surface-variant">
          {t('pairsLabel', { count: `${batch.completedPairCount}/${batch.totalPairCount}` })}
        </p>
      ),
    },
    {
      key: 'cvs',
      header: t('columns.cvs'),
      render: (batch) => <p className="text-on-surface-variant">{batch.totalCvCount}</p>,
    },
    {
      key: 'jds',
      header: t('columns.jds'),
      render: (batch) => <p className="text-on-surface-variant">{batch.totalJdCount}</p>,
    },
    {
      key: 'createdAt',
      header: t('columns.created'),
      sortKey: 'createdAt',
      render: (batch) => <p className="whitespace-nowrap text-on-surface-variant">{formatDate(batch.createdAt)}</p>,
    },
    {
      key: 'action',
      header: t('columns.action'),
      className: 'text-right',
      render: (batch) => (
        <div className="flex justify-end">
          <ActionIconButton href={`${ROUTES.BATCH_SCORING}/${batch.id}`} icon={<EyeIcon className="size-4" />} label={t('actions.view')} />
        </div>
      ),
    },
  ];
}

export function BatchList() {
  const t = useTranslations('batchScoring');
  const tCommon = useTranslations('common');
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
      const message = error instanceof Error ? error.message : t('list.errorFallback');
      setErrorMessage(message);
      showToast.error(t('list.errorFallback'), { description: message });
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
    return <LoadingState title={t('list.loadingTitle')} description={t('list.loadingDescription')} />;
  }

  if (errorMessage && batches.length === 0) {
    return (
      <EmptyState
        title={t('list.errorTitle')}
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadBatches()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('list.tryAgain')}
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('list.title')}</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{t('list.subtitle')}</p>
        </div>
        <Link
          href={ROUTES.BATCH_SCORING_CREATE}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
        >
          <PlusIcon className="size-4" />
          {t('list.newBatch')}
        </Link>
      </div>

      <ListControls pagination={{ ...meta, onPageChange: setPage }} />

      {batches.length === 0 ? (
        <EmptyState
          title={t('list.emptyTitle')}
          description={t('list.emptyDescription')}
        />
      ) : (
        <DataTable
          data={batches}
          columns={buildColumns(t, tCommon, status)}
          getRowKey={(batch) => batch.id}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
}
