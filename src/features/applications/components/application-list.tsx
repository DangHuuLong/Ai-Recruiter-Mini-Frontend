'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ConfirmDialog, DataTable, ListControls, type DataTableColumn } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { deleteApplication, getApplications } from '@/features/applications/api/application.api';
import { ApplicationStatusBadge } from '@/features/applications/components/application-status-badge';
import type { Application } from '@/features/applications/types/application.type';
import type { PaginationMeta } from '@/lib/api/api-types';

const PAGE_SIZE = 10;

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not recorded';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

function buildApplicationColumns(onDelete: (application: Application) => void): DataTableColumn<Application>[] {
  return [
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
        <div className="flex flex-wrap justify-end gap-3">
          <Link href={`/applications/${application.id}`} className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">
            View
          </Link>
          <Link href={`/applications/${application.id}/edit`} className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            Edit
          </Link>
          <button type="button" onClick={() => onDelete(application)} className="text-sm font-semibold text-red-600 transition hover:text-red-700">
            Delete
          </button>
        </div>
      ),
    },
  ];
}

export function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getApplications({ page, limit: PAGE_SIZE, search });
      setApplications(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load applications';
      setErrorMessage(message);
      showToast.error('Failed to load applications', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, [page, search]);

  const handleDeleteApplication = async () => {
    if (!applicationToDelete) return;

    try {
      setIsDeleting(true);
      await deleteApplication(applicationToDelete.id);
      showToast.success('Application deleted successfully');
      setApplicationToDelete(null);
      await loadApplications();
    } catch (error) {
      showToast.error('Failed to delete application', {
        description: error instanceof Error ? error.message : 'Something went wrong while deleting the application.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && applications.length === 0) {
    return <LoadingState title="Loading applications..." description="Please wait while applications are being loaded." />;
  }

  if (errorMessage && applications.length === 0) {
    return (
      <EmptyState
        title="Failed to load applications"
        description={errorMessage}
        action={<button type="button" onClick={() => void loadApplications()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Application list</h2>
        <p className="mt-1 text-sm text-slate-500">{meta.total} application{meta.total === 1 ? '' : 's'} found.</p>
      </div>

      <ListControls
        search={{
          value: search,
          placeholder: 'Search by candidate, JD, resume, source, or notes...',
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
        }}
        pagination={{ ...meta, onPageChange: setPage }}
      />

      {applications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="Create an application or adjust your search keyword."
          action={<Link href="/applications/new" className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Create Application</Link>}
        />
      ) : (
        <DataTable data={applications} columns={buildApplicationColumns(setApplicationToDelete)} getRowKey={(application) => application.id} />
      )}

      <ConfirmDialog
        open={Boolean(applicationToDelete)}
        title="Delete application?"
        description="This action removes the application record and cannot be undone."
        confirmLabel="Delete application"
        isLoading={isDeleting}
        onCancel={() => setApplicationToDelete(null)}
        onConfirm={() => void handleDeleteApplication()}
      />
    </section>
  );
}
