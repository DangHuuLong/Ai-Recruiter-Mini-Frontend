'use client';

import { IdCardIcon, Share2Icon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { DetailItem, DetailLinkItem, DetailPageLayout, DetailSection } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useCandidateDetail } from '@/features/candidates/hooks/use-candidate-detail';
import type { CandidateDetailProps } from '@/features/candidates/types/candidate-detail-ui.type';
import { CandidateResumeList } from '@/features/candidates/components/candidate-resume-list';

function InfoCardHeader({ icon: Icon, title }: { icon: typeof UserIcon; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
        <Icon className="size-4" />
      </div>
      <h2 className="text-sm font-semibold text-on-surface">{title}</h2>
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
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
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
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
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
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
          <InfoCardHeader icon={UserIcon} title="Basic information" />
          <div className="space-y-4">
            <DetailItem label="Full name" value={candidate.fullName} />
            <DetailItem label="Location" value={candidate.location} />
          </div>
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
          <InfoCardHeader icon={IdCardIcon} title="Contact information" />
          <div className="space-y-4">
            <DetailItem label="Email" value={candidate.primaryEmail} />
            <DetailItem label="Phone" value={candidate.primaryPhone} />
          </div>
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
          <InfoCardHeader icon={Share2Icon} title="Online profiles" />
          <div className="space-y-4">
            <DetailLinkItem label="LinkedIn" href={candidate.linkedinUrl} />
            <DetailLinkItem label="GitHub" href={candidate.githubUrl} />
            <DetailLinkItem label="Portfolio" href={candidate.portfolioUrl} />
          </div>
        </div>
      </div>

      <DetailSection
        title="Resumes"
        description="Resume records linked to this candidate."
      >
        <CandidateResumeList candidateId={candidate.id} />
      </DetailSection>
    </DetailPageLayout>
  );
}