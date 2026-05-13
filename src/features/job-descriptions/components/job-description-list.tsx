'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ConfirmDialog, DataTable, ListControls, type DataTableColumn } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import {
  deactivateJobDescription,
  deleteJobDescription,
  getJobDescriptions,
} from '@/features/job-descriptions/api/job-description.api';
import type { JobDescription } from '@/features/job-descriptions/types/job-description.type';
import type { PaginationMeta } from '@/lib/api/api-types';

const PAGE_SIZE = 10;

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value));
}

function statusClassName(status: JobDescription['parseStatus']) {
  switch (status) {
    case 'SUCCESS':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'FAILED':
      return 'bg-red-50 text-red-700 ring-red-200';
    case 'PROCESSING':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    default:
      return 'bg-slate-50 text-slate-600 ring-slate-200';
  }
}

function buildColumns(
  onDeactivate: (jobDescription: JobDescription) => void,
  onDelete: (jobDescription: JobDescription) => void,
): DataTableColumn<JobDescription>[] {
  return [
    {
      key: 'title',
      header: 'Job Description',
      render: (jobDescription) => (
        <div>
          <p className="text-sm font-semibold text-slate-950">{jobDescription.title}</p>
          <p className="mt-1 text-xs text-slate-500">{jobDescription.companyName || 'No company'}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{jobDescription.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (jobDescription) => (
        <p className="text-sm text-slate-600">{jobDescription.location || 'Not provided'}</p>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (jobDescription) => (
        <div className="space-y-1 text-sm text-slate-600">
          <p>{jobDescription.employmentType || 'Not provided'}</p>
          <p className="text-xs text-slate-500">{jobDescription.seniority || 'No seniority'}</p>
        </div>
      ),
    },
    {
      key: 'parseStatus',
      header: 'Parse Status',
      render: (jobDescription) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClassName(jobDescription.parseStatus)}`}>
          {jobDescription.parseStatus}
        </span>
      ),
    },
    {
      key: 'skills',
      header: 'Skills',
      render: (jobDescription) => (
        <p className="text-sm text-slate-600">{jobDescription._count?.skills ?? jobDescription.skills?.length ?? 0}</p>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (jobDescription) => (
        <p className="whitespace-nowrap text-sm text-slate-600">{formatDate(jobDescription.updatedAt)}</p>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (jobDescription) => (
        <div className="flex flex-wrap justify-end gap-3">
          <Link href={`/job-descriptions/${jobDescription.id}`} className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">View</Link>
          <Link href={`/job-descriptions/${jobDescription.id}/edit`} className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">Edit</Link>
          {jobDescription.isActive ? (
            <button type="button" onClick={() => onDeactivate(jobDescription)} className="text-sm font-semibold text-amber-600 transition hover:text-amber-700">Deactivate</button>
          ) : null}
          <button type="button" onClick={() => onDelete(jobDescription)} className="text-sm font-semibold text-red-600 transition hover:text-red-700">Delete</button>
        </div>
      ),
    },
  ];
}

export function JobDescriptionList() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jobToDeactivate, setJobToDeactivate] = useState<JobDescription | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobDescription | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const loadJobDescriptions = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getJobDescriptions({ page, limit: PAGE_SIZE, search });
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
  }, [page, search]);

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

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      setIsMutating(true);
      await deleteJobDescription(jobToDelete.id);
      showToast.success('Job description deleted successfully');
      setJobToDelete(null);
      await loadJobDescriptions();
    } catch (error) {
      showToast.error('Failed to delete job description', {
        description: error instanceof Error ? error.message : 'Something went wrong while deleting the JD.',
      });
    } finally {
      setIsMutating(false);
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
        action={<button type="button" onClick={() => void loadJobDescriptions()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Job description list</h2>
        <p className="mt-1 text-sm text-slate-500">{meta.total} job description{meta.total === 1 ? '' : 's'} found.</p>
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

      {jobDescriptions.length === 0 ? (
        <EmptyState
          title="No job descriptions found"
          description="Create the first job description or adjust your search keyword."
          action={<Link href="/job-descriptions/new" className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Create Job Description</Link>}
        />
      ) : (
        <DataTable data={jobDescriptions} columns={buildColumns(setJobToDeactivate, setJobToDelete)} getRowKey={(jobDescription) => jobDescription.id} />
      )}

      <ConfirmDialog
        open={Boolean(jobToDeactivate)}
        title="Deactivate job description?"
        description="Inactive job descriptions cannot be used for new applications. Existing records remain available."
        confirmLabel="Deactivate JD"
        variant="warning"
        isLoading={isMutating}
        onCancel={() => setJobToDeactivate(null)}
        onConfirm={() => void handleDeactivate()}
      />

      <ConfirmDialog
        open={Boolean(jobToDelete)}
        title="Delete job description?"
        description="This action removes the job description if the backend allows it. This cannot be undone."
        confirmLabel="Delete JD"
        isLoading={isMutating}
        onCancel={() => setJobToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}
