'use client';

import { IdCardIcon, Share2Icon, UserIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { DetailItem, DetailLinkItem, DetailPageLayout, DetailSection } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useCandidateDetail } from '@/features/candidates/hooks/use-candidate-detail';
import type { CandidateDetailProps } from '@/features/candidates/types/candidate-detail-ui.type';
import { CandidateApplicationList } from '@/features/candidates/components/candidate-application-list';
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
  const t = useTranslations('candidates');
  const { candidate, isLoading, errorMessage, refetchCandidate } =
    useCandidateDetail(candidateId);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    showToast.error(t('detail.errorTitle'), {
      description: errorMessage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  if (isLoading) {
    return (
      <LoadingState
        title={t('detail.loadingTitle')}
        description={t('detail.loadingDescription')}
      />
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title={t('detail.errorTitle')}
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => {
              void refetchCandidate();
            }}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('detail.tryAgain')}
          </button>
        }
      />
    );
  }

  if (!candidate) {
    return (
      <EmptyState
        title={t('detail.notFoundTitle')}
        description={t('detail.notFoundDescription')}
        action={
          <Link
            href="/candidates"
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('backToCandidates')}
          </Link>
        }
      />
    );
  }

  return (
    <DetailPageLayout
      title={candidate.fullName}
      description={t('detail.pageDescription')}
      backHref="/candidates"
      backLabel={t('backToCandidates')}
    >
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
          <InfoCardHeader icon={UserIcon} title={t('detail.basicInfo')} />
          <div className="space-y-4">
            <DetailItem label={t('fields.fullName')} value={candidate.fullName} />
            <DetailItem label={t('fields.location')} value={candidate.location} />
          </div>
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
          <InfoCardHeader icon={IdCardIcon} title={t('detail.contactInfo')} />
          <div className="space-y-4">
            <DetailItem label={t('fields.email')} value={candidate.primaryEmail} />
            <DetailItem label={t('fields.phone')} value={candidate.primaryPhone} />
          </div>
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
          <InfoCardHeader icon={Share2Icon} title={t('detail.onlineProfiles')} />
          <div className="space-y-4">
            <DetailLinkItem label={t('detail.linkedin')} href={candidate.linkedinUrl} />
            <DetailLinkItem label={t('detail.github')} href={candidate.githubUrl} />
            <DetailLinkItem label={t('detail.portfolio')} href={candidate.portfolioUrl} />
          </div>
        </div>
      </div>

      <DetailSection
        title={t('detail.resumesSection')}
        description={t('detail.resumesSectionDescription')}
      >
        <CandidateResumeList candidateId={candidate.id} />
      </DetailSection>

      <DetailSection
        title={t('detail.applicationsSection')}
        description={t('detail.applicationsSectionDescription')}
      >
        <CandidateApplicationList candidateId={candidate.id} />
      </DetailSection>
    </DetailPageLayout>
  );
}