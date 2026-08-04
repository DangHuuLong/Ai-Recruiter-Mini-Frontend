'use client';

import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { ApplicationStatusBadge } from '@/features/applications/components/application-status-badge';
import { getCandidateApplications } from '@/features/applications/api/application.api';
import type { Application } from '@/features/applications/types/application.type';
import { formatDate } from '@/lib/utils/format-date';

type CandidateApplicationListProps = {
  candidateId: string;
};

export function CandidateApplicationList({ candidateId }: CandidateApplicationListProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getCandidateApplications(candidateId);
      setApplications(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load applications';
      setErrorMessage(message);
      showToast.error('Failed to load candidate applications', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading applications..."
        description="Please wait while this candidate's applications are being loaded."
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
            onClick={() => void loadApplications()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
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
        title="Not applied to any job description yet"
        description="Applications this candidate submits will show up here."
        action={
          <Link
            href="/applications/new"
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Create Application
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((application) => (
        <Link
          key={application.id}
          href={`/applications/${application.id}`}
          className="flex cursor-pointer flex-col gap-2 rounded-xl border border-outline bg-surface-lowest p-4 transition hover:border-primary hover:bg-surface-variant sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-on-surface">
              {application.jobDescription?.title || application.jobDescriptionId}
            </p>
            <p className="mt-0.5 truncate text-xs text-on-surface-muted">
              {application.jobDescription?.companyName || 'Company not provided'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <p className="whitespace-nowrap text-xs text-on-surface-muted">
              Applied {application.appliedAt ? formatDate(application.appliedAt) : 'Not recorded'}
            </p>
            <ApplicationStatusBadge status={application.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
