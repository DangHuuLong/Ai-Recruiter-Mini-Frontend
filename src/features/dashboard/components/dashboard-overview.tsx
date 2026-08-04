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

const QUICK_ACTIONS = [
  { label: 'Add candidate', href: ROUTES.CANDIDATE_CREATE, icon: UserPlusIcon },
  { label: 'Create job description', href: ROUTES.JOB_DESCRIPTION_CREATE, icon: FilePlusIcon },
  { label: 'New application', href: ROUTES.APPLICATION_CREATE, icon: ClipboardListIcon },
  { label: 'Start batch scoring', href: ROUTES.BATCH_SCORING_CREATE, icon: Grid3x3Icon },
];

export function DashboardOverview() {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const overview = await loadDashboardOverview();
      setData(overview);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load dashboard data';
      setErrorMessage(message);
      showToast.error('Failed to load dashboard data', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (isLoading && !data) {
    return <LoadingState title="Loading dashboard..." description="Please wait while your dashboard data is being loaded." />;
  }

  if (errorMessage && !data) {
    return (
      <EmptyState
        title="Failed to load dashboard"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Try again
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
        <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Hiring at a glance — pipeline health, AI scoring activity, and recent team actions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <UsersIcon className="size-5" />
            </div>
            <p className="text-sm font-semibold text-on-surface-variant">Total Candidates</p>
          </div>
          <p className="mt-3 text-3xl font-bold text-on-surface">{kpis.totalCandidates}</p>
          <p className="mt-1 text-xs text-on-surface-muted">Database entries</p>
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <BriefcaseIcon className="size-5" />
            </div>
            <p className="text-sm font-semibold text-on-surface-variant">Active Job Descriptions</p>
          </div>
          <p className="mt-3 text-3xl font-bold text-on-surface">{kpis.activeJobDescriptions}</p>
          <p className="mt-1 text-xs text-on-surface-muted">Currently open for applications</p>
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <ClipboardListIcon className="size-5" />
            </div>
            <p className="text-sm font-semibold text-on-surface-variant">Applications This Month</p>
          </div>
          <p className="mt-3 text-3xl font-bold text-on-surface">{kpis.applicationsThisMonth}</p>
          {applicationsTrend !== null ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-success">
              <TrendingUpIcon className="size-3.5" />
              {applicationsTrend >= 0 ? '+' : ''}
              {applicationsTrend}% vs last month
            </p>
          ) : (
            <p className="mt-1 text-xs text-on-surface-muted">No data for last month</p>
          )}
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <ClipboardCheckIcon className="size-5" />
            </div>
            <p className="text-sm font-semibold text-on-surface-variant">Avg. Evaluation Score</p>
          </div>
          <p className="mt-3 text-3xl font-bold text-on-surface">
            {kpis.averageEvaluationScore ?? '—'}
            <span className="text-base font-normal text-on-surface-muted"> / 100</span>
          </p>
          <p className="mt-1 text-xs text-on-surface-muted">Across {kpis.completedEvaluationCount} completed evaluations</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-on-surface">Application Pipeline</h2>
                <p className="mt-1 text-sm text-on-surface-variant">Real-time status distribution across all applications.</p>
              </div>
              <Link
                href={ROUTES.APPLICATIONS}
                className="shrink-0 cursor-pointer text-sm font-semibold text-primary transition hover:underline"
              >
                View all
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
              <h2 className="text-base font-bold text-on-surface">Recent Evaluations</h2>
              <Link
                href={ROUTES.EVALUATIONS}
                className="shrink-0 cursor-pointer text-sm font-semibold text-primary transition hover:underline"
              >
                View all
              </Link>
            </div>

            {recentEvaluations.length === 0 ? (
              <p className="mt-4 text-sm text-on-surface-muted">No evaluations yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentEvaluations.map((evaluation) => {
                  const candidateName = evaluation.application?.candidate?.fullName ?? 'Unknown candidate';
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
                          {evaluation.application?.jobDescription?.title ?? 'Job description'}
                        </p>
                      </div>
                      {evaluation.status === 'FAILED' ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-error-container px-2.5 py-1 text-xs font-semibold text-error">
                          <RotateCcwIcon className="size-3" />
                          Failed
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
              <h2 className="text-base font-bold text-on-surface">Scoring Batches in Progress</h2>
              <Link
                href={ROUTES.BATCH_SCORING}
                className="shrink-0 cursor-pointer text-sm font-semibold text-primary transition hover:underline"
              >
                View all
              </Link>
            </div>

            {batchesInProgress.length === 0 ? (
              <p className="mt-4 text-sm text-on-surface-muted">No batches currently processing.</p>
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
                        {batch.completedPairCount}/{batch.totalPairCount} pairs · {STATUS_LABELS[batch.status]}
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
            <h2 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">Quick actions</h2>
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
              <h2 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">Skill gap highlights</h2>
            </div>
            {skillGap.length === 0 ? (
              <p className="mt-3 text-sm text-on-surface-muted">No missing skills recorded yet.</p>
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
                <h2 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">Recent activity</h2>
              </div>
              <Link
                href={ROUTES.AUDIT_LOG}
                className="shrink-0 cursor-pointer text-xs font-semibold text-primary transition hover:underline"
              >
                View log
              </Link>
            </div>
            {recentActivity.length === 0 ? (
              <p className="mt-3 text-sm text-on-surface-muted">No recent activity.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {recentActivity.map((log) => (
                  <div key={log.id} className="text-sm">
                    <p className="text-on-surface">
                      <span className="font-semibold">{log.actor?.fullName ?? log.actor?.email ?? 'Someone'}</span>{' '}
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
