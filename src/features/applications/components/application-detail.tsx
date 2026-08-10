'use client';

import { ArrowRightIcon, BriefcaseIcon, FileTextIcon, SparklesIcon, UserIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { AvatarChip } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getApplicationById } from '@/features/applications/api/application.api';
import { ApplicationEvents } from '@/features/applications/components/application-events';
import { ApplicationStatusBadge } from '@/features/applications/components/application-status-badge';
import { ApplicationStatusForm } from '@/features/applications/components/application-status-form';
import type { Application } from '@/features/applications/types/application.type';
import { createEvaluation } from '@/features/evaluations/api/evaluation.api';
import { formatDateTime } from '@/lib/utils/format-date';

function LinkedRecordCard({
  icon: Icon,
  title,
  primaryLine,
  secondaryLine,
  href,
  linkLabel,
}: {
  icon: typeof UserIcon;
  title: string;
  primaryLine: string;
  secondaryLine?: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="rounded-xl border border-outline p-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
          <Icon className="size-4" />
        </div>
        <h2 className="text-sm font-semibold text-on-surface">{title}</h2>
      </div>
      <p className="mt-3 truncate text-sm text-on-surface-variant">{primaryLine}</p>
      {secondaryLine ? <p className="mt-1 truncate text-sm text-on-surface-muted">{secondaryLine}</p> : null}
      <Link
        href={href}
        className="mt-3 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        {linkLabel}
        <ArrowRightIcon className="size-3.5" />
      </Link>
    </div>
  );
}

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-outline bg-surface-variant px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-medium text-on-surface">{value}</p>
  </div>
);

type ApplicationDetailProps = {
  applicationId: string;
};

export function ApplicationDetail({ applicationId }: ApplicationDetailProps) {
  const t = useTranslations('applications.detail');
  const tRoot = useTranslations('applications');
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);
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
          error instanceof Error ? error.message : t('loadingDescription');
        setErrorMessage(message);
        showToast.error(t('notFoundTitle'), {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const handleCreateEvaluation = async () => {
    if (!application) {
      return;
    }

    try {
      setIsCreatingEvaluation(true);
      const evaluation = await createEvaluation({ applicationId: application.id });
      showToast.success(t('createEvaluationSuccess'));
      setEventsReloadKey((current) => current + 1);
      router.push(`/evaluations/${evaluation.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('createEvaluationFailedFallback');
      showToast.error(t('createEvaluationFailedTitle'), {
        description: message,
      });
    } finally {
      setIsCreatingEvaluation(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        title={t('loadingTitle')}
        description={t('loadingDescription')}
      />
    );
  }

  if (errorMessage || !application) {
    return (
      <EmptyState
        title={t('notFoundTitle')}
        description={errorMessage || t('notFoundFallback')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <AvatarChip
              name={application.candidate?.fullName || application.candidateId}
              seed={application.candidateId}
              size="md"
              className="size-14 text-base"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-on-surface">
                  {application.candidate?.fullName || application.candidateId}
                </h1>
                <ApplicationStatusBadge status={application.status} />
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-on-surface-variant">
                {t('applicationFor', { title: application.jobDescription?.title || application.jobDescriptionId })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateEvaluation}
            disabled={isCreatingEvaluation}
            className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SparklesIcon className="size-4" />
            {isCreatingEvaluation ? t('creatingEvaluation') : t('createEvaluation')}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard label={t('candidateId')} value={application.candidateId} />
          <InfoCard label={t('resumeId')} value={application.resumeId} />
          <InfoCard label={t('jobDescriptionId')} value={application.jobDescriptionId} />
          <InfoCard label={t('appliedAt')} value={application.appliedAt ? formatDateTime(application.appliedAt) : tRoot('notRecorded')} />
          <InfoCard label={t('source')} value={application.source || tRoot('notProvided')} />
          <InfoCard label={t('lastActivity')} value={application.lastActivityAt ? formatDateTime(application.lastActivityAt) : tRoot('notRecorded')} />
          <InfoCard
            label={t('evaluationCount')}
            value={String(application._count?.evaluations ?? 0)}
          />
          <InfoCard
            label={t('eventCount')}
            value={String(application._count?.events ?? 0)}
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <LinkedRecordCard
            icon={UserIcon}
            title={t('candidateCard')}
            primaryLine={application.candidate?.fullName || t('candidateDetailMissing')}
            secondaryLine={application.candidate?.primaryEmail ?? undefined}
            href={`/candidates/${application.candidateId}`}
            linkLabel={t('viewCandidate')}
          />

          <LinkedRecordCard
            icon={FileTextIcon}
            title={t('resumeCard')}
            primaryLine={application.resume?.fileAsset?.fileName || t('resumeDetailMissing')}
            secondaryLine={t('parseStatusLine', { status: application.resume?.parseStatus || t('unknown') })}
            href={`/resumes/${application.resumeId}`}
            linkLabel={t('viewResume')}
          />

          <LinkedRecordCard
            icon={BriefcaseIcon}
            title={t('jobDescriptionCard')}
            primaryLine={application.jobDescription?.title || t('jobDetailMissing')}
            secondaryLine={application.jobDescription?.companyName || tRoot('companyNotProvided')}
            href={`/job-descriptions/${application.jobDescriptionId}`}
            linkLabel={t('viewJd')}
          />
        </div>

        {application.notes ? (
          <div className="mt-6 rounded-xl border border-outline bg-surface-variant p-4">
            <h2 className="text-sm font-semibold text-on-surface">{t('notes')}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">
              {application.notes}
            </p>
          </div>
        ) : null}
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
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
    </div>
  );
}
