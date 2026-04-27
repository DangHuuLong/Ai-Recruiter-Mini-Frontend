'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { DetailPageLayout, DetailSection } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useCandidateDetail } from '@/features/candidates/hooks/use-candidate-detail';
import type {
  CandidateDetailProps,
  DetailItemProps,
  DetailLinkItemProps,
} from '@/features/candidates/types/candidate-detail-ui.type';
import { getDisplayValue } from '@/lib/utils/display-value.util';
import { CandidateResumeList } from '@/features/candidates/components/candidate-resume-list';

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {getDisplayValue(value)}
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
          target="_blank"
          rel="noreferrer"
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

export function CandidateDetail({ candidateId }: CandidateDetailProps) {
  const { candidate, isLoading, errorMessage, refetchCandidate } =
    useCandidateDetail(candidateId);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    showToast.error('Failed to load candidate detail', {
      description: errorMessage,
    });
  }, [errorMessage]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading candidate detail..."
        description="Please wait while the candidate profile is being loaded."
      />
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Failed to load candidate detail"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => {
              void refetchCandidate();
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Try again
          </button>
        }
      />
    );
  }

  if (!candidate) {
    return (
      <EmptyState
        title="Candidate not found"
        description="The candidate profile could not be found."
        action={
          <Link
            href="/candidates"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Back to Candidates
          </Link>
        }
      />
    );
  }

  return (
    <DetailPageLayout
      title={candidate.fullName}
      description="View candidate profile information, contact details, and related links."
      backHref="/candidates"
      backLabel="Back to Candidates"
    >
      <DetailSection
        title="Basic information"
        description="Core candidate profile information."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <DetailItem label="Full name" value={candidate.fullName} />
          <DetailItem label="Location" value={candidate.location} />
        </div>
      </DetailSection>

      <DetailSection
        title="Contact information"
        description="Primary contact channels for this candidate."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <DetailItem label="Email" value={candidate.primaryEmail} />
          <DetailItem label="Phone" value={candidate.primaryPhone} />
        </div>
      </DetailSection>

      <DetailSection
        title="Online profiles"
        description="Candidate profile links collected during candidate creation."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <DetailLinkItem label="LinkedIn" href={candidate.linkedinUrl} />
          <DetailLinkItem label="GitHub" href={candidate.githubUrl} />
          <DetailLinkItem label="Portfolio" href={candidate.portfolioUrl} />
        </div>
      </DetailSection>

      <DetailSection
        title="Resumes"
        description="Resume records linked to this candidate."
      >
        <CandidateResumeList candidateId={candidate.id} />
      </DetailSection>
    </DetailPageLayout>
  );
}