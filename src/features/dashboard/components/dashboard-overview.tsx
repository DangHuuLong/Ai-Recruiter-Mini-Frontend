'use client';

import {
  AlertTriangleIcon,
  BriefcaseIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  FilePlusIcon,
  Grid3x3Icon,
  HistoryIcon,
  RotateCcwIcon,
  TrendingUpIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { AvatarChip } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import { ApplicationStatusBadge } from '@/features/applications/components/application-status-badge';
import {
  loadDashboardOverview,
  type DashboardOverviewData,
} from '@/features/dashboard/utils/dashboard-stats.util';
import { STATUS_LABELS } from '@/features/batch-scoring/types/batch-scoring.type';
import { formatRelativeTime } from '@/lib/utils/format-date';

const EVALUATION_STATUS_CLASSES: Record<string, string> = {
  PENDING: 'bg-surface-variant text-on-surface-variant',
  PROCESSING: 'bg-info/15 text-info',
  COMPLETED: 'bg-success-container text-success',
  FAILED: 'bg-error-container text-error',
};

export function DashboardOverview() {
  const t = useTranslations('dashboard');
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const QUICK_ACTIONS = [
    { label: t('quickActions.addCandidate'), href: ROUTES.CANDIDATE_CREATE, icon: UserPlusIcon },
    { label: t('quickActions.createJobDescription'), href: ROUTES.JOB_DESCRIPTION_CREATE, icon: FilePlusIcon },
    { label: t('quickActions.newApplication'), href: ROUTES.APPLICATION_CREATE, icon: ClipboardListIcon },
    { label: t('quickActions.startBatchScoring'), href: ROUTES.BATCH_SCORING_CREATE, icon: Grid3x3Icon },
  ];

  const load = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const overview = await loadDashboardOverview();
      setData(overview);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('error.fallback');
      setErrorMessage(message);
      showToast.error(t('error.fallback'), { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !data) {
    return <LoadingState title={t('loading.title')} description={t('loading.description')} />;
  }

  if (errorMessage && !data) {
    return (
      <EmptyState
        title={t('error.title')}
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('error.tryAgain')}
          </button>
        }
      />
    );
  }

  if (!data) return null;

  const { kpis, funnel, recentEvaluations, batchesInProgress, skillGap, recentActivity } = data;

  const applicationsTrend =
    kpis.applicationsLastMonth > 0
      ? Math.round(((kpis.applicationsThisMonth - kpis.applicationsLastMonth) / kpis.applicationsLastMonth) * 100)
      : null;

  const maxFunnelCount = Math.max(...funnel.map((entry) => entry.count), 1);
  const maxSkillGapCount = skillGap[0]?.missingCount ?? 1;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <UsersIcon className="size-5" />
            </div>
            <p className="text-sm font-semibold text-on-surface-variant">{t('kpis.totalCandidates')}</p>
          </div>
          <p className="mt-3 text-3xl font-bold text-on-surface">{kpis.totalCandidates}</p>
          <p className="mt-1 text-xs text-on-surface-muted">{t('kpis.databaseEntries')}</p>
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <BriefcaseIcon className="size-5" />
            </div>
            <p className="text-sm font-semibold text-on-surface-variant">{t('kpis.activeJobDescriptions')}</p>
          </div>
          <p className="mt-3 text-3xl font-bold text-on-surface">{kpis.activeJobDescriptions}</p>
          <p className="mt-1 text-xs text-on-surface-muted">{t('kpis.currentlyOpen')}</p>
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <ClipboardListIcon className="size-5" />
            </div>
            <p className="text-sm font-semibold text-on-surface-variant">{t('kpis.applicationsThisMonth')}</p>
          </div>
          <p className="mt-3 text-3xl font-bold text-on-surface">{kpis.applicationsThisMonth}</p>
          {applicationsTrend !== null ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-success">
              <TrendingUpIcon className="size-3.5" />
              {t('kpis.trendVsLastMonth', {
                sign: applicationsTrend >= 0 ? '+' : '',
                percent: applicationsTrend,
              })}
            </p>
          ) : (
            <p className="mt-1 text-xs text-on-surface-muted">{t('kpis.noDataLastMonth')}</p>
          )}
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <ClipboardCheckIcon className="size-5" />
            </div>
            <p className="text-sm font-semibold text-on-surface-variant">{t('kpis.avgScore')}</p>
          </div>
          <p className="mt-3 text-3xl font-bold text-on-surface">
            {kpis.averageEvaluationScore ?? '—'}
            <span className="text-base font-normal text-on-surface-muted"> / 100</span>
          </p>
          <p className="mt-1 text-xs text-on-surface-muted">
            {t('kpis.acrossEvaluations', { count: kpis.completedEvaluationCount })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-on-surface">{t('pipeline.title')}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">{t('pipeline.subtitle')}</p>
              </div>
              <Link
                href={ROUTES.APPLICATIONS}
                className="shrink-0 cursor-pointer text-sm font-semibold text-primary transition hover:underline"
              >
                {t('pipeline.viewAll')}
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {funnel.map((entry) => (
                <div key={entry.status}>
                  <div className="flex items-center justify-between text-sm">
                    <ApplicationStatusBadge status={entry.status} />
                    <span className="font-semibold text-on-surface">{entry.count}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(entry.count / maxFunnelCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-bold text-on-surface">{t('recentEvaluations.title')}</h2>
              <Link
                href={ROUTES.EVALUATIONS}
                className="shrink-0 cursor-pointer text-sm font-semibold text-primary transition hover:underline"
              >
                {t('recentEvaluations.viewAll')}
              </Link>
            </div>

            {recentEvaluations.length === 0 ? (
              <p className="mt-4 text-sm text-on-surface-muted">{t('recentEvaluations.empty')}</p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentEvaluations.map((evaluation) => {
                  const candidateName =
                    evaluation.application?.candidate?.fullName ?? t('recentEvaluations.unknownCandidate');
                  return (
                    <Link
                      key={evaluation.id}
                      href={`${ROUTES.EVALUATIONS}/${evaluation.id}`}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline p-3 transition hover:bg-surface-variant"
                    >
                      <AvatarChip name={candidateName} seed={evaluation.applicationId} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-on-surface">{candidateName}</p>
                        <p className="truncate text-xs text-on-surface-muted">
                          {evaluation.application?.jobDescription?.title ?? t('recentEvaluations.jobDescriptionFallback')}
                        </p>
                      </div>
                      {evaluation.status === 'FAILED' ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-error-container px-2.5 py-1 text-xs font-semibold text-error">
                          <RotateCcwIcon className="size-3" />
                          {t('recentEvaluations.failed')}
                        </span>
                      ) : (
                        <>
                          <p className="shrink-0 text-sm font-bold text-on-surface">
                            {typeof evaluation.overallScore === 'number' ? Math.round(evaluation.overallScore) : '—'}
                            <span className="font-normal text-on-surface-muted">/100</span>
                          </p>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${EVALUATION_STATUS_CLASSES[evaluation.status]}`}
                          >
                            {evaluation.status}
                          </span>
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-bold text-on-surface">{t('batchesInProgress.title')}</h2>
              <Link
                href={ROUTES.BATCH_SCORING}
                className="shrink-0 cursor-pointer text-sm font-semibold text-primary transition hover:underline"
              >
                {t('batchesInProgress.viewAll')}
              </Link>
            </div>

            {batchesInProgress.length === 0 ? (
              <p className="mt-4 text-sm text-on-surface-muted">{t('batchesInProgress.empty')}</p>
            ) : (
              <div className="mt-4 space-y-4">
                {batchesInProgress.map((batch) => (
                  <Link
                    key={batch.id}
                    href={`${ROUTES.BATCH_SCORING}/${batch.id}`}
                    className="block cursor-pointer rounded-xl border border-outline p-3 transition hover:bg-surface-variant"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-on-surface">{batch.name}</span>
                      <span className="text-on-surface-muted">
                        {t('batchesInProgress.pairsLabel', {
                          completed: batch.completedPairCount,
                          total: batch.totalPairCount,
                        })}{' '}
                        · {STATUS_LABELS[batch.status]}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(batch.completedPairCount / batch.totalPairCount) * 100}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">{t('quickActions.title')}</h2>
            <div className="mt-3 space-y-2">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline px-3 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
                >
                  <action.icon className="size-4 text-primary" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="size-4 text-warning" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">{t('skillGap.title')}</h2>
            </div>
            {skillGap.length === 0 ? (
              <p className="mt-3 text-sm text-on-surface-muted">{t('skillGap.empty')}</p>
            ) : (
              <div className="mt-3 space-y-3">
                {skillGap.map((entry) => (
                  <div key={entry.skillName}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-on-surface">{entry.skillName}</span>
                      <span className="text-on-surface-muted">{entry.missingCount}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
                      <div
                        className="h-full rounded-full bg-error"
                        style={{ width: `${(entry.missingCount / maxSkillGapCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HistoryIcon className="size-4 text-on-surface-variant" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">{t('recentActivity.title')}</h2>
              </div>
              <Link
                href={ROUTES.AUDIT_LOG}
                className="shrink-0 cursor-pointer text-xs font-semibold text-primary transition hover:underline"
              >
                {t('recentActivity.viewLog')}
              </Link>
            </div>
            {recentActivity.length === 0 ? (
              <p className="mt-3 text-sm text-on-surface-muted">{t('recentActivity.empty')}</p>
            ) : (
              <div className="mt-3 space-y-3">
                {recentActivity.map((log) => (
                  <div key={log.id} className="text-sm">
                    <p className="text-on-surface">
                      <span className="font-semibold">
                        {log.actor?.fullName ?? log.actor?.email ?? t('recentActivity.someone')}
                      </span>{' '}
                      {log.action.toLowerCase().replaceAll('_', ' ')} {log.resourceType}
                      {log.resourceId ? ` #${log.resourceId}` : ''}
                    </p>
                    <p className="text-xs text-on-surface-muted">{formatRelativeTime(log.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
