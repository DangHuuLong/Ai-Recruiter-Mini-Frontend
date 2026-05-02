'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { DataTable, type DataTableColumn } from '@/components/common/data-table';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getApplications } from '@/features/applications/api/application.api';
import { ApplicationStatusBadge } from '@/features/applications/components/application-status-badge';
import type { Application } from '@/features/applications/types/application.type';

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not recorded';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const applicationColumns: DataTableColumn<Application>[] = [
  {
    key: 'application',
    header: 'Application',
    render: (application) => (
      <div>
        <p className="text-sm font-semibold text-slate-950">
          {application.candidate?.fullName || application.candidateId}
        </p>
        <p className="mt-1 text-xs text-slate-500">ID: {application.id}</p>
      </div>
    ),
  },
  {
    key: 'job',
    header: 'Job description',
    render: (application) => (
      <div>
        <p className="text-sm font-medium text-slate-800">
          {application.jobDescription?.title || application.jobDescriptionId}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {application.jobDescription?.companyName || 'Company not provided'}
        </p>
      </div>
    ),
  },
  {
    key: 'resume',
    header: 'Resume',
    render: (application) => (
      <p className="max-w-xs truncate text-sm text-slate-600">
        {application.resume?.fileAsset?.fileName || application.resumeId}
      </p>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (application) => <ApplicationStatusBadge status={application.status} />,
  },
  {
    key: 'appliedAt',
    header: 'Applied at',
    render: (application) => (
      <p className="whitespace-nowrap text-sm text-slate-600">
        {formatDate(application.appliedAt)}
      </p>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    className: 'text-right',
    render: (application) => (
      <Link
        href={`/applications/${application.id}`}
        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        View detail
      </Link>
    ),
  },
];

export function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getApplications({ page: 1, limit: 20 });
      setApplications(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load applications';
      setErrorMessage(message);
      showToast.error('Failed to load applications', {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading applications..."
        description="Please wait while applications are being loaded."
      />
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Failed to load applications"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => {
              void loadApplications();
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Try again
          </button>
        }
      />
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        description="Create an application by linking a candidate, one of their resumes, and an active job description."
        action={
          <Link
            href="/applications/new"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Create Application
          </Link>
        }
      />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Application list
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {applications.length} application
          {applications.length > 1 ? 's' : ''} found.
        </p>
      </div>

      <DataTable
        data={applications}
        columns={applicationColumns}
        getRowKey={(application) => application.id}
      />
    </section>
  );
}
