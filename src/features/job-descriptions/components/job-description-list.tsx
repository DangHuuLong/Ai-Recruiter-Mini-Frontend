'use client';

import { BriefcaseIcon, EyeIcon, MapPinIcon, PauseIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  onDeactivate: (jobDescription: JobDescription) => void,
): DataTableColumn<JobDescription>[] {
  return [
    {
      key: 'title',
      header: 'Job Description',
      sortKey: 'title',
      render: (jobDescription) => (
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
            <BriefcaseIcon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">{jobDescription.title}</p>
            <p className="mt-0.5 text-xs text-on-surface-muted">{jobDescription.companyName || 'No company'}</p>
            <span
              className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                jobDescription.isActive
                  ? 'bg-success-container text-success'
                  : 'bg-surface-variant text-on-surface-muted'
              }`}
            >
              {jobDescription.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (jobDescription) => (
        <p className="flex items-center gap-1.5 text-sm text-on-surface-variant">
          {jobDescription.location ? <MapPinIcon className="size-3.5 shrink-0 text-on-surface-muted" /> : null}
          {jobDescription.location || 'Not provided'}
        </p>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (jobDescription) => (
        <div className="space-y-1 text-sm text-on-surface-variant">
          <p>{jobDescription.employmentType || 'Not provided'}</p>
          <p className="text-xs text-on-surface-muted">{jobDescription.seniority || 'No seniority'}</p>
        </div>
      ),
    },
    {
      key: 'parseStatus',
      header: 'Parse Status',
      render: (jobDescription) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName(jobDescription.parseStatus)}`}>
          {jobDescription.parseStatus}
        </span>
      ),
    },
    {
      key: 'skills',
      header: 'Skills',
      render: (jobDescription) => (
        <span className="inline-flex rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          {jobDescription._count?.skills ?? jobDescription.skills?.length ?? 0} skills
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortKey: 'updatedAt',
      render: (jobDescription) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">{formatDate(jobDescription.updatedAt)}</p>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (jobDescription) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <ActionIconButton href={`/job-descriptions/${jobDescription.id}`} icon={<EyeIcon className="size-4" />} label="View" />
          <ActionIconButton
            href={`/job-descriptions/${jobDescription.id}/edit`}
            icon={<PencilIcon className="size-4" />}
            label="Edit"
          />
          {jobDescription.isActive ? (
            <ActionIconButton
              icon={<PauseIcon className="size-4" />}
              label="Deactivate"
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
      const message = error instanceof Error ? error.message : 'Failed to load job descriptions';
      setErrorMessage(message);
      showToast.error('Failed to load job descriptions', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadJobDescriptions();
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
      showToast.success('Job description deactivated successfully');
      setJobToDeactivate(null);
      await loadJobDescriptions();
    } catch (error) {
      showToast.error('Failed to deactivate job description', {
        description: error instanceof Error ? error.message : 'Something went wrong while deactivating the JD.',
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
        showToast.success(`${succeeded} job description${succeeded === 1 ? '' : 's'} deactivated successfully`);
      } else {
        showToast.warning(`${succeeded} deactivated, ${failed} failed`, {
          description: results.find((result) => !result.success)?.error,
        });
      }
      setSelectedIds(new Set());
      setIsBulkConfirmOpen(false);
      await loadJobDescriptions();
    } catch (error) {
      showToast.error('Bulk deactivation failed', {
        description: error instanceof Error ? error.message : 'Something went wrong while deactivating job descriptions.',
      });
    } finally {
      setIsBulkDeactivating(false);
    }
  };

  if (isLoading && jobDescriptions.length === 0) {
    return <LoadingState title="Loading job descriptions..." description="Please wait while job descriptions are being loaded." />;
  }

  if (errorMessage && jobDescriptions.length === 0) {
    return (
      <EmptyState
        title="Failed to load job descriptions"
        description={errorMessage}
        action={<button type="button" onClick={() => void loadJobDescriptions()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">Try again</button>}
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
          <p className="text-sm font-semibold text-on-surface-variant">Total job descriptions</p>
          <p className="text-2xl font-bold text-on-surface">{meta.total}</p>
        </div>
      </div>

      <ListControls
        search={{
          value: search,
          placeholder: 'Search by title, company, department, or location...',
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
          Deactivate selected
        </button>
      </BulkActionBar>

      {jobDescriptions.length === 0 ? (
        <EmptyState
          title="No job descriptions found"
          description="Create the first job description or adjust your search keyword."
          action={<Link href="/job-descriptions/new" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">Create Job Description</Link>}
        />
      ) : (
        <DataTable
          data={jobDescriptions}
          columns={buildColumns(setJobToDeactivate)}
          getRowKey={(jobDescription) => jobDescription.id}
          sort={sort}
          onSortChange={handleSortChange}
          selection={{ selectedIds, onChange: setSelectedIds }}
        />
      )}

      <ConfirmDialog
        open={Boolean(jobToDeactivate)}
        title="Deactivate job description?"
        description="This removes it from the list and disables its detail page. It stays linked to any existing applications, but cannot be viewed, edited, or reused. This cannot be undone."
        confirmLabel="Deactivate JD"
        variant="warning"
        isLoading={isMutating}
        onCancel={() => setJobToDeactivate(null)}
        onConfirm={() => void handleDeactivate()}
      />

      <ConfirmDialog
        open={isBulkConfirmOpen}
        title={`Deactivate ${selectedIds.size} job description${selectedIds.size === 1 ? '' : 's'}?`}
        description="This removes it from the list and disables its detail page. It stays linked to any existing applications, but cannot be viewed, edited, or reused. This cannot be undone."
        confirmLabel="Deactivate selected"
        variant="warning"
        isLoading={isBulkDeactivating}
        onCancel={() => setIsBulkConfirmOpen(false)}
        onConfirm={() => void handleBulkDeactivate()}
      />
    </section>
  );
}
