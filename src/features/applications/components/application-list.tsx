'use client';

import { ClipboardListIcon, EyeIcon, FileTextIcon, PencilIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';

import {
  ActionIconButton,
  AvatarChip,
  DataTable,
  ListControls,
  type DataTableColumn,
  type DataTableSort,
  type DataTableSortOrder,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getApplications } from '@/features/applications/api/application.api';
import { ApplicationStatusBadge } from '@/features/applications/components/application-status-badge';
import type { Application, ApplicationQuery, ApplicationStatus } from '@/features/applications/types/application.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { formatDateTime } from '@/lib/utils/format-date';

const PAGE_SIZE = 10;

const STATUS_FILTER_OPTIONS = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Applied', value: 'APPLIED' },
  { label: 'Screening', value: 'SCREENING' },
  { label: 'Shortlisted', value: 'SHORTLISTED' },
  { label: 'Interviewing', value: 'INTERVIEWING' },
  { label: 'Offer', value: 'OFFER' },
  { label: 'Hired', value: 'HIRED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
];

function buildApplicationColumns(
  status: ApplicationStatus | '',
): DataTableColumn<Application>[] {
  return [
    {
      key: 'application',
      header: 'Application',
      render: (application) => {
        const candidateName = application.candidate?.fullName || application.candidateId;
        return (
          <div className="flex items-center gap-3">
            <AvatarChip name={candidateName} seed={application.candidateId} size="sm" />
            <div>
              <p className="text-sm font-semibold text-on-surface">{candidateName}</p>
              <p className="font-mono text-xs text-on-surface-muted">{application.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'job',
      header: 'Job description',
      render: (application) => (
        <div>
          <p className="text-sm font-medium text-on-surface">
            {application.jobDescription?.title || application.jobDescriptionId}
          </p>
          <p className="mt-1 text-xs text-on-surface-muted">
            {application.jobDescription?.companyName || 'Company not provided'}
          </p>
        </div>
      ),
    },
    {
      key: 'resume',
      header: 'Resume',
      render: (application) => (
        <Link
          href={`/resumes/${application.resumeId}`}
          className="flex max-w-xs items-center gap-1.5 truncate text-sm text-primary hover:underline"
        >
          <FileTextIcon className="size-3.5 shrink-0" />
          <span className="truncate">{application.resume?.fileAsset?.fileName || application.resumeId}</span>
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      filter: { key: 'status', options: STATUS_FILTER_OPTIONS, activeValue: status },
      render: (application) => <ApplicationStatusBadge status={application.status} />,
    },
    {
      key: 'appliedAt',
      header: 'Applied at',
      sortKey: 'appliedAt',
      render: (application) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">
          {application.appliedAt ? formatDateTime(application.appliedAt) : 'Not recorded'}
        </p>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (application) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <ActionIconButton href={`/applications/${application.id}`} icon={<EyeIcon className="size-4" />} label="View" />
          <ActionIconButton
            href={`/applications/${application.id}/edit`}
            icon={<PencilIcon className="size-4" />}
            label="Edit"
          />
        </div>
      ),
    },
  ];
}

export function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getApplications({
        page,
        limit: PAGE_SIZE,
        search,
        status: status || undefined,
        sortBy: sort?.key as ApplicationQuery['sortBy'],
        sortOrder: sort?.order,
      });
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
  }, [page, search, status, sort]);

  const handleSortChange = (key: string, order: DataTableSortOrder) => {
    setSort({ key, order });
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') {
      setStatus(value as ApplicationStatus | '');
      setPage(1);
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
        action={<button type="button" onClick={() => void loadApplications()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">Try again</button>}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
          <ClipboardListIcon className="size-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface-variant">Total applications</p>
          <p className="text-2xl font-bold text-on-surface">{meta.total}</p>
        </div>
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
          action={<Link href="/applications/new" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">Create Application</Link>}
        />
      ) : (
        <DataTable
          data={applications}
          columns={buildApplicationColumns(status)}
          getRowKey={(application) => application.id}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      )}
    </section>
  );
}
