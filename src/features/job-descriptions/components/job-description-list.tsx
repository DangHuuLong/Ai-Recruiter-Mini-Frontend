'use client';

import { BriefcaseIcon, EyeIcon, MapPinIcon, PauseIcon, PencilIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  ActionIconButton,
  BulkActionBar,
  ConfirmDialog,
  DataTable,
  ListControls,
  type DataTableColumn,
  type DataTableSort,
  type DataTableSortOrder,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import {
  bulkDeactivateJobDescriptions,
  deactivateJobDescription,
  getJobDescriptions,
} from '@/features/job-descriptions/api/job-description.api';
import type { JobDescription, JobDescriptionQuery } from '@/features/job-descriptions/types/job-description.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { formatDate } from '@/lib/utils/format-date';

const PAGE_SIZE = 10;

function statusClassName(status: JobDescription['parseStatus']) {
  switch (status) {
    case 'SUCCESS':
      return 'bg-success-container text-success';
    case 'FAILED':
      return 'bg-error-container text-error';
    case 'PROCESSING':
      return 'bg-warning-container text-on-surface';
    default:
      return 'bg-surface-variant text-on-surface-variant';
  }
}

function buildColumns(
  t: ReturnType<typeof useTranslations<'jobDescriptions'>>,
  onDeactivate: (jobDescription: JobDescription) => void,
): DataTableColumn<JobDescription>[] {
  return [
    {
      key: 'title',
      header: t('columns.jobDescription'),
      sortKey: 'title',
      render: (jobDescription) => (
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
            <BriefcaseIcon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">{jobDescription.title}</p>
            <p className="mt-0.5 text-xs text-on-surface-muted">{jobDescription.companyName || t('noCompany')}</p>
            <span
              className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                jobDescription.isActive
                  ? 'bg-success-container text-success'
                  : 'bg-surface-variant text-on-surface-muted'
              }`}
            >
              {jobDescription.isActive ? t('active') : t('inactive')}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: t('columns.location'),
      render: (jobDescription) => (
        <p className="flex items-center gap-1.5 text-sm text-on-surface-variant">
          {jobDescription.location ? <MapPinIcon className="size-3.5 shrink-0 text-on-surface-muted" /> : null}
          {jobDescription.location || t('notProvided')}
        </p>
      ),
    },
    {
      key: 'type',
      header: t('columns.type'),
      render: (jobDescription) => (
        <div className="space-y-1 text-sm text-on-surface-variant">
          <p>{jobDescription.employmentType || t('notProvided')}</p>
          <p className="text-xs text-on-surface-muted">{jobDescription.seniority || t('noSeniority')}</p>
        </div>
      ),
    },
    {
      key: 'parseStatus',
      header: t('columns.parseStatus'),
      render: (jobDescription) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName(jobDescription.parseStatus)}`}>
          {jobDescription.parseStatus}
        </span>
      ),
    },
    {
      key: 'skills',
      header: t('columns.skills'),
      render: (jobDescription) => (
        <span className="inline-flex rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          {t('skillsCount', { count: jobDescription._count?.skills ?? jobDescription.skills?.length ?? 0 })}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: t('columns.updated'),
      sortKey: 'updatedAt',
      render: (jobDescription) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">{formatDate(jobDescription.updatedAt)}</p>
      ),
    },
    {
      key: 'action',
      header: t('columns.action'),
      className: 'text-right',
      render: (jobDescription) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <ActionIconButton href={`/job-descriptions/${jobDescription.id}`} icon={<EyeIcon className="size-4" />} label={t('actions.view')} />
          <ActionIconButton
            href={`/job-descriptions/${jobDescription.id}/edit`}
            icon={<PencilIcon className="size-4" />}
            label={t('actions.edit')}
          />
          {jobDescription.isActive ? (
            <ActionIconButton
              icon={<PauseIcon className="size-4" />}
              label={t('actions.deactivate')}
              variant="warning"
              onClick={() => onDeactivate(jobDescription)}
            />
          ) : null}
        </div>
      ),
    },
  ];
}

export function JobDescriptionList() {
  const t = useTranslations('jobDescriptions');
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jobToDeactivate, setJobToDeactivate] = useState<JobDescription | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
  const [isBulkDeactivating, setIsBulkDeactivating] = useState(false);

  const loadJobDescriptions = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getJobDescriptions({
        page,
        limit: PAGE_SIZE,
        search,
        sortBy: sort?.key as JobDescriptionQuery['sortBy'],
        sortOrder: sort?.order,
      });
      setJobDescriptions(response.data);
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
    void loadJobDescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, sort]);

  const handleSortChange = (key: string, order: DataTableSortOrder) => {
    setSort({ key, order });
    setPage(1);
  };

  const handleDeactivate = async () => {
    if (!jobToDeactivate) return;

    try {
      setIsMutating(true);
      await deactivateJobDescription(jobToDeactivate.id);
      showToast.success(t('list.deactivateSuccess'));
      setJobToDeactivate(null);
      await loadJobDescriptions();
    } catch (error) {
      showToast.error(t('list.deactivateFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.deactivateFailedFallback'),
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      setIsBulkDeactivating(true);
      const results = await bulkDeactivateJobDescriptions(Array.from(selectedIds));
      const succeeded = results.filter((result) => result.success).length;
      const failed = results.length - succeeded;
      if (failed === 0) {
        showToast.success(t('list.bulkDeactivateSuccess', { count: succeeded }));
      } else {
        showToast.warning(t('list.bulkDeactivatePartial', { succeeded, failed }), {
          description: results.find((result) => !result.success)?.error,
        });
      }
      setSelectedIds(new Set());
      setIsBulkConfirmOpen(false);
      await loadJobDescriptions();
    } catch (error) {
      showToast.error(t('list.bulkDeactivateFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.bulkDeactivateFailedFallback'),
      });
    } finally {
      setIsBulkDeactivating(false);
    }
  };

  if (isLoading && jobDescriptions.length === 0) {
    return <LoadingState title={t('list.loadingTitle')} description={t('list.loadingDescription')} />;
  }

  if (errorMessage && jobDescriptions.length === 0) {
    return (
      <EmptyState
        title={t('list.errorTitle')}
        description={errorMessage}
        action={<button type="button" onClick={() => void loadJobDescriptions()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">{t('list.tryAgain')}</button>}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
          <BriefcaseIcon className="size-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface-variant">{t('totalJobDescriptions')}</p>
          <p className="text-2xl font-bold text-on-surface">{meta.total}</p>
        </div>
      </div>

      <ListControls
        search={{
          value: search,
          placeholder: t('searchPlaceholder'),
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
        }}
        pagination={{ ...meta, onPageChange: setPage }}
      />

      <BulkActionBar count={selectedIds.size} onClear={() => setSelectedIds(new Set())}>
        <button
          type="button"
          onClick={() => setIsBulkConfirmOpen(true)}
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl bg-warning px-4 text-sm font-semibold text-on-surface transition hover:opacity-90"
        >
          <PauseIcon className="size-4" />
          {t('deactivateSelected')}
        </button>
      </BulkActionBar>

      {jobDescriptions.length === 0 ? (
        <EmptyState
          title={t('list.emptyTitle')}
          description={t('list.emptyDescription')}
          action={<Link href="/job-descriptions/new" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">{t('createJd')}</Link>}
        />
      ) : (
        <DataTable
          data={jobDescriptions}
          columns={buildColumns(t, setJobToDeactivate)}
          getRowKey={(jobDescription) => jobDescription.id}
          sort={sort}
          onSortChange={handleSortChange}
          selection={{ selectedIds, onChange: setSelectedIds }}
        />
      )}

      <ConfirmDialog
        open={Boolean(jobToDeactivate)}
        title={t('list.deactivateConfirmTitle')}
        description={t('list.deactivateConfirmDescription')}
        confirmLabel={t('list.deactivateConfirmAction')}
        variant="warning"
        isLoading={isMutating}
        onCancel={() => setJobToDeactivate(null)}
        onConfirm={() => void handleDeactivate()}
      />

      <ConfirmDialog
        open={isBulkConfirmOpen}
        title={t('list.bulkDeactivateConfirmTitle', { count: selectedIds.size })}
        description={t('list.deactivateConfirmDescription')}
        confirmLabel={t('list.bulkDeactivateConfirmAction')}
        variant="warning"
        isLoading={isBulkDeactivating}
        onCancel={() => setIsBulkConfirmOpen(false)}
        onConfirm={() => void handleBulkDeactivate()}
      />
    </section>
  );
}
