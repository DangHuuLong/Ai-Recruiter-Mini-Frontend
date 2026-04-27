'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { DetailPageLayout, DetailSection } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useResumeDetail } from '@/features/resumes/hooks/use-resume-detail';
import type {
  DetailItemProps,
  DetailLinkItemProps,
  ResumeDetailProps,
} from '@/features/resumes/types/resume-detail-ui.type';
import { getDisplayValue } from '@/lib/utils/display-value.util';

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {getDisplayValue(value ? String(value) : null)}
      </p>
    </div>
  );
}

function DetailLinkItem({ label, href }: DetailLinkItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      {href ? (
        <a
          href={href}
          className="mt-1 block max-w-full break-words text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
        >
          {href}
        </a>
      ) : (
        <p className="mt-1 text-sm font-medium text-slate-900">
          {getDisplayValue(href)}
        </p>
      )}
    </div>
  );
}

export function ResumeDetail({ resumeId }: ResumeDetailProps) {
  const { resume, isLoading, errorMessage, refetchResume } =
    useResumeDetail(resumeId);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    showToast.error('Failed to load resume detail', {
      description: errorMessage,
    });
  }, [errorMessage]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading resume detail..."
        description="Please wait while the resume record is being loaded."
      />
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Failed to load resume detail"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => {
              void refetchResume();
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Try again
          </button>
        }
      />
    );
  }

  if (!resume) {
    return (
      <EmptyState
        title="Resume not found"
        description="The resume record could not be found."
        action={
          <Link
            href="/resumes"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Back to Resumes
          </Link>
        }
      />
    );
  }

  return (
    <DetailPageLayout
      title="Resume detail"
      description="View resume record information, parsing status, and linked candidate data."
      backHref="/resumes"
      backLabel="Back to Resumes"
    >
      <DetailSection
        title="Resume information"
        description="Core information for this resume record."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <DetailItem label="Resume ID" value={resume.id} />
          <DetailItem label="Candidate ID" value={resume.candidateId} />
          <DetailItem label="Parse status" value={resume.parseStatus} />
          <DetailItem label="File asset ID" value={resume.fileAssetId} />
        </div>
      </DetailSection>

      <DetailSection
        title="Linked candidate"
        description="Candidate profile associated with this resume."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <DetailLinkItem
            label="Candidate detail"
            href={`/candidates/${resume.candidateId}`}
          />
        </div>
      </DetailSection>

      <DetailSection
        title="Parsed data"
        description="Structured resume data returned by the parsing pipeline."
      >
        {resume.parsedData ? (
          <pre className="max-h-96 overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
            {JSON.stringify(resume.parsedData, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-slate-600">
            No parsed data is available yet.
          </p>
        )}
      </DetailSection>
    </DetailPageLayout>
  );
}