'use client';

import { CopyIcon, FileTextIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { BulkActionBar, DataTable, ListControls, type DataTableColumn } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import {
  getAiActivityLogById,
  getAiActivityLogs,
  getAiActivityLogSummary,
  getAiActivityLogTimeseries,
} from '@/features/ai-activity-log/api/ai-activity-log.api';
import { AiActivitySummaryTiles } from '@/features/ai-activity-log/components/ai-activity-summary-tiles';
import { AiActivityTimeseriesChart } from '@/features/ai-activity-log/components/ai-activity-timeseries-chart';
import {
  FUNCTION_TYPE_LABEL_KEYS,
  STATUS_CLASSES,
  STATUS_LABEL_KEYS,
  TIER_LABEL_KEYS,
  type AiActivityLog,
  type AiActivityLogListItem,
  type AiActivityLogSummary,
  type AiCallStatus,
  type AiCallTier,
  type AiFunctionType,
  type TimeseriesBucket,
} from '@/features/ai-activity-log/types/ai-activity-log.type';
import { buildDebugReport } from '@/features/ai-activity-log/utils/build-debug-report.util';
import type { PaginationMeta } from '@/lib/api/api-types';
import { cn } from '@/lib/utils/cn';

const PAGE_SIZE = 20;

const FUNCTION_TYPES = Object.keys(FUNCTION_TYPE_LABEL_KEYS) as AiFunctionType[];
const TIERS = Object.keys(TIER_LABEL_KEYS) as AiCallTier[];
const STATUSES = Object.keys(STATUS_LABEL_KEYS) as AiCallStatus[];

function formatLatency(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function buildColumns(
  t: ReturnType<typeof useTranslations<'aiActivityLog'>>,
  functionType: AiFunctionType | '',
  tier: AiCallTier | '',
  status: AiCallStatus | '',
): DataTableColumn<AiActivityLogListItem>[] {
  const functionTypeFilterOptions = FUNCTION_TYPES.map((type) => ({
    label: t(`labels.functionType.${FUNCTION_TYPE_LABEL_KEYS[type]}`),
    value: type,
  }));
  const tierFilterOptions = TIERS.map((tierValue) => ({
    label: t(`labels.tier.${TIER_LABEL_KEYS[tierValue]}`),
    value: tierValue,
  }));
  const statusFilterOptions = STATUSES.map((statusValue) => ({
    label: t(`labels.status.${STATUS_LABEL_KEYS[statusValue]}`),
    value: statusValue,
  }));

  return [
    {
      key: 'functionType',
      header: t('dashboard.columns.function'),
      filter: { key: 'functionType', options: functionTypeFilterOptions, activeValue: functionType },
      render: (log) => (
        <Link
          href={`${ROUTES.AI_ACTIVITY_LOG}/${log.id}`}
          className="font-semibold text-primary hover:text-primary-hover"
        >
          {t(`labels.functionType.${FUNCTION_TYPE_LABEL_KEYS[log.functionType]}`)}
        </Link>
      ),
    },
    {
      key: 'tier',
      header: t('dashboard.columns.tier'),
      filter: { key: 'tier', options: tierFilterOptions, activeValue: tier },
      render: (log) => <span className="text-on-surface-variant">{t(`labels.tier.${TIER_LABEL_KEYS[log.tier]}`)}</span>,
    },
    {
      key: 'status',
      header: t('dashboard.columns.status'),
      filter: { key: 'status', options: statusFilterOptions, activeValue: status },
      render: (log) => (
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_CLASSES[log.status])}>
          {t(`labels.status.${STATUS_LABEL_KEYS[log.status]}`)}
        </span>
      ),
    },
    {
      key: 'organization',
      header: t('dashboard.columns.organization'),
      render: (log) => (
        <span className="text-xs text-on-surface-muted">{log.organizationId ?? '—'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: t('dashboard.columns.calledAt'),
      render: (log) => (
        <span className="text-on-surface-variant">{new Date(log.createdAt).toLocaleString()}</span>
      ),
    },
    {
      key: 'latency',
      header: t('dashboard.columns.responseTime'),
      render: (log) => <span className="text-on-surface-variant">{formatLatency(log.latencyMs)}</span>,
    },
  ];
}

export function AiActivityLogDashboard() {
  const t = useTranslations('aiActivityLog');
  const searchParams = useSearchParams();

  const [logs, setLogs] = useState<AiActivityLogListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [functionType, setFunctionType] = useState<AiFunctionType | ''>('');
  const [tier, setTier] = useState<AiCallTier | ''>('');
  const [status, setStatus] = useState<AiCallStatus | ''>('');
  const [batchId] = useState<string | undefined>(searchParams.get('batchId') ?? undefined);
  const [resumeId] = useState<string | undefined>(searchParams.get('resumeId') ?? undefined);
  const [jobDescriptionId] = useState<string | undefined>(searchParams.get('jobDescriptionId') ?? undefined);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [summary, setSummary] = useState<AiActivityLogSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  const [hourBuckets, setHourBuckets] = useState<TimeseriesBucket[]>([]);
  const [dayBuckets, setDayBuckets] = useState<TimeseriesBucket[]>([]);
  const [monthBuckets, setMonthBuckets] = useState<TimeseriesBucket[]>([]);
  const [isChartsLoading, setIsChartsLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reportText, setReportText] = useState<string | null>(null);
  const [isBuildingReport, setIsBuildingReport] = useState(false);

  const isFiltered = Boolean(batchId || resumeId || jobDescriptionId);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getAiActivityLogs({
        page,
        limit: PAGE_SIZE,
        functionType: functionType || undefined,
        tier: tier || undefined,
        status: status || undefined,
        batchId,
        resumeId,
        jobDescriptionId,
      });
      setLogs(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('dashboard.errorFallback');
      setErrorMessage(message);
      showToast.error(t('dashboard.errorFallback'), { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, functionType, tier, status]);

  useEffect(() => {
    void (async () => {
      try {
        setIsSummaryLoading(true);
        setSummary(await getAiActivityLogSummary());
      } catch (error) {
        showToast.error(t('dashboard.toast.summaryFailedTitle'), {
          description: error instanceof Error ? error.message : t('dashboard.toast.genericFailedFallback'),
        });
      } finally {
        setIsSummaryLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        setIsChartsLoading(true);
        const [hour, day, month] = await Promise.all([
          getAiActivityLogTimeseries({ granularity: 'hour' }),
          getAiActivityLogTimeseries({ granularity: 'day' }),
          getAiActivityLogTimeseries({ granularity: 'month' }),
        ]);
        setHourBuckets(hour);
        setDayBuckets(day);
        setMonthBuckets(month);
      } catch (error) {
        showToast.error(t('dashboard.toast.chartsFailedTitle'), {
          description: error instanceof Error ? error.message : t('dashboard.toast.genericFailedFallback'),
        });
      } finally {
        setIsChartsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'functionType') setFunctionType(value as AiFunctionType | '');
    if (key === 'tier') setTier(value as AiCallTier | '');
    if (key === 'status') setStatus(value as AiCallStatus | '');
    setPage(1);
  };

  const handleBuildReport = async () => {
    try {
      setIsBuildingReport(true);
      const fullLogs: AiActivityLog[] = await Promise.all(
        Array.from(selectedIds).map((id) => getAiActivityLogById(id)),
      );
      setReportText(buildDebugReport(fullLogs));
    } catch (error) {
      showToast.error(t('dashboard.toast.reportFailedTitle'), {
        description: error instanceof Error ? error.message : t('dashboard.toast.genericFailedFallback'),
      });
    } finally {
      setIsBuildingReport(false);
    }
  };

  const handleCopyReport = async () => {
    if (!reportText) return;
    await navigator.clipboard.writeText(reportText);
    showToast.success(t('dashboard.toast.reportCopied'));
  };

  if (isLoading && logs.length === 0 && !errorMessage) {
    return <LoadingState title={t('dashboard.loadingTitle')} description={t('dashboard.loadingDescription')} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-on-surface">{t('dashboard.title')}</h1>
          <span className="rounded-full bg-surface-variant px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
            {t('internalToolBadge')}
          </span>
        </div>
        <p className="mt-1 text-sm text-on-surface-variant">{t('dashboard.subtitle')}</p>
      </div>

      <AiActivitySummaryTiles summary={summary} isLoading={isSummaryLoading} />

      <div className="grid gap-4 lg:grid-cols-3">
        <AiActivityTimeseriesChart title={t('dashboard.charts.callsToday')} buckets={hourBuckets} isLoading={isChartsLoading} />
        <AiActivityTimeseriesChart title={t('dashboard.charts.callsThisMonth')} buckets={dayBuckets} isLoading={isChartsLoading} />
        <AiActivityTimeseriesChart title={t('dashboard.charts.callsThisYear')} buckets={monthBuckets} isLoading={isChartsLoading} />
      </div>

      {isFiltered ? (
        <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary-container px-4 py-2.5 text-sm text-on-primary-container">
          <span>{t('dashboard.filteredNotice')}</span>
          <Link href={ROUTES.AI_ACTIVITY_LOG} className="font-semibold underline">
            {t('dashboard.clearFilter')}
          </Link>
        </div>
      ) : null}

      <ListControls pagination={{ ...meta, onPageChange: setPage }} />

      <BulkActionBar count={selectedIds.size} onClear={() => setSelectedIds(new Set())}>
        <button
          type="button"
          disabled={isBuildingReport}
          onClick={() => void handleBuildReport()}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FileTextIcon className="size-3.5" />
          {isBuildingReport ? t('dashboard.buildingReport') : t('dashboard.compileReport')}
        </button>
      </BulkActionBar>

      {reportText ? (
        <div className="space-y-2 rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-surface">{t('dashboard.debugReportTitle')}</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleCopyReport()}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-outline bg-surface-lowest px-3 text-xs font-semibold text-on-surface transition hover:bg-surface-variant"
              >
                <CopyIcon className="size-3.5" />
                {t('dashboard.copy')}
              </button>
              <button
                type="button"
                onClick={() => setReportText(null)}
                className="inline-flex h-9 cursor-pointer items-center rounded-lg px-3 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-variant"
              >
                {t('dashboard.close')}
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={reportText}
            rows={12}
            className="w-full rounded-xl border border-outline bg-surface p-3 font-mono text-xs text-on-surface"
          />
        </div>
      ) : null}

      {errorMessage && logs.length === 0 ? (
        <EmptyState
          title={t('dashboard.errorTitle')}
          description={errorMessage}
          action={
            <button
              type="button"
              onClick={() => void loadLogs()}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
            >
              {t('dashboard.tryAgain')}
            </button>
          }
        />
      ) : logs.length === 0 ? (
        <EmptyState title={t('dashboard.emptyTitle')} description={t('dashboard.emptyDescription')} />
      ) : (
        <DataTable
          data={logs}
          columns={buildColumns(t, functionType, tier, status)}
          getRowKey={(log) => log.id}
          onFilterChange={handleFilterChange}
          selection={{ selectedIds, onChange: setSelectedIds }}
        />
      )}
    </div>
  );
}
