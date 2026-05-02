'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { DataTable, type DataTableColumn } from '@/components/common/data-table';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useJobDescriptions } from '@/features/job-descriptions/hooks/use-job-descriptions';
import type { JobDescription } from '@/features/job-descriptions/types/job-description.type';

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

const columns: DataTableColumn<JobDescription>[] = [
  {
    key: 'title',
    header: 'Job Description',
    render: (jobDescription) => (
      <div>
        <p className="text-sm font-semibold text-slate-950">{jobDescription.title}</p>
        <p className="mt-1 text-xs text-slate-500">{jobDescription.companyName || 'No company'}</p>
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
      <Link href={`/job-descriptions/${jobDescription.id}`} className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">
        View detail
      </Link>
    ),
  },
];

export function JobDescriptionList() {
  const { jobDescriptions, isLoading, errorMessage, refetchJobDescriptions } = useJobDescriptions();

  useEffect(() => {
    if (!errorMessage) return;
    showToast.error('Failed to load job descriptions', { description: errorMessage });
  }, [errorMessage]);

  if (isLoading) {
    return <LoadingState title="Loading job descriptions..." description="Please wait while job descriptions are being loaded." />;
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Failed to load job descriptions"
        description={errorMessage}
        action={<button type="button" onClick={() => void refetchJobDescriptions()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  if (jobDescriptions.length === 0) {
    return (
      <EmptyState
        title="No job descriptions yet"
        description="Create the first job description before creating applications or evaluations."
        action={<Link href="/job-descriptions/new" className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Create Job Description</Link>}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Job description list</h2>
        <p className="mt-1 text-sm text-slate-500">{jobDescriptions.length} job description{jobDescriptions.length > 1 ? 's' : ''} found.</p>
      </div>
      <DataTable data={jobDescriptions} columns={columns} getRowKey={(jobDescription) => jobDescription.id} />
    </section>
  );
}
