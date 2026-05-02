'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getApplicationById } from '@/features/applications/api/application.api';
import { ApplicationEvents } from '@/features/applications/components/application-events';
import { ApplicationStatusBadge } from '@/features/applications/components/application-status-badge';
import { ApplicationStatusForm } from '@/features/applications/components/application-status-form';
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

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-medium text-slate-900">{value}</p>
  </div>
);

type ApplicationDetailProps = {
  applicationId: string;
};

export function ApplicationDetail({ applicationId }: ApplicationDetailProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [eventsReloadKey, setEventsReloadKey] = useState(0);

  useEffect(() => {
    const loadApplication = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await getApplicationById(applicationId);
        setApplication(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load application';
        setErrorMessage(message);
        showToast.error('Failed to load application', {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadApplication();
  }, [applicationId]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading application detail..."
        description="Please wait while the application detail is being loaded."
      />
    );
  }

  if (errorMessage || !application) {
    return (
      <EmptyState
        title="Application not found"
        description={errorMessage || 'Unable to load this application.'}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Application detail</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {application.candidate?.fullName || application.candidateId}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Candidate application for{' '}
              <span className="font-medium text-slate-900">
                {application.jobDescription?.title || application.jobDescriptionId}
              </span>
              .
            </p>
          </div>

          <ApplicationStatusBadge status={application.status} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Candidate ID" value={application.candidateId} />
          <DetailItem label="Resume ID" value={application.resumeId} />
          <DetailItem label="Job Description ID" value={application.jobDescriptionId} />
          <DetailItem label="Applied at" value={formatDate(application.appliedAt)} />
          <DetailItem label="Source" value={application.source || 'Not provided'} />
          <DetailItem label="Last activity" value={formatDate(application.lastActivityAt)} />
          <DetailItem
            label="Evaluation count"
            value={String(application._count?.evaluations ?? 0)}
          />
          <DetailItem
            label="Event count"
            value={String(application._count?.events ?? 0)}
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-950">Candidate</h2>
            <p className="mt-2 text-sm text-slate-700">
              {application.candidate?.fullName || 'Candidate detail not included'}
            </p>
            {application.candidate?.primaryEmail ? (
              <p className="mt-1 text-sm text-slate-500">
                {application.candidate.primaryEmail}
              </p>
            ) : null}
            <Link
              href={`/candidates/${application.candidateId}`}
              className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View candidate
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-950">Resume</h2>
            <p className="mt-2 text-sm text-slate-700">
              {application.resume?.fileAsset?.fileName || 'Resume detail not included'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Parse status: {application.resume?.parseStatus || 'Unknown'}
            </p>
            <Link
              href={`/resumes/${application.resumeId}`}
              className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View resume
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-950">Job description</h2>
            <p className="mt-2 text-sm text-slate-700">
              {application.jobDescription?.title || 'Job detail not included'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {application.jobDescription?.companyName || 'Company not provided'}
            </p>
            <Link
              href={`/job-descriptions/${application.jobDescriptionId}`}
              className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View JD
            </Link>
          </div>
        </div>

        {application.notes ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-950">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {application.notes}
            </p>
          </div>
        ) : null}
      </section>

      <ApplicationStatusForm
        application={application}
        onUpdated={(updatedApplication) => {
          setApplication(updatedApplication);
          setEventsReloadKey((current) => current + 1);
        }}
      />

      <ApplicationEvents
        applicationId={application.id}
        reloadKey={eventsReloadKey}
      />
    </div>
  );
}
