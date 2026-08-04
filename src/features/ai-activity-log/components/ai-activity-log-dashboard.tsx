'use client';

import { CopyIcon, FileTextIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  FUNCTION_TYPE_LABELS,
  STATUS_CLASSES,
  STATUS_LABELS,
  TIER_LABELS,
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

const FUNCTION_TYPE_FILTER_OPTIONS = (Object.keys(FUNCTION_TYPE_LABELS) as AiFunctionType[]).map((type) => ({
  label: FUNCTION_TYPE_LABELS[type],
  value: type,
}));

const TIER_FILTER_OPTIONS = (Object.keys(TIER_LABELS) as AiCallTier[]).map((tier) => ({
  label: TIER_LABELS[tier],
  value: tier,
}));

const STATUS_FILTER_OPTIONS = (Object.keys(STATUS_LABELS) as AiCallStatus[]).map((status) => ({
  label: STATUS_LABELS[status],
  value: status,
}));

function formatLatency(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function buildColumns(
  functionType: AiFunctionType | '',
  tier: AiCallTier | '',
  status: AiCallStatus | '',
): DataTableColumn<AiActivityLogListItem>[] {
  return [
    {
      key: 'functionType',
      header: 'Function',
      filter: { key: 'functionType', options: FUNCTION_TYPE_FILTER_OPTIONS, activeValue: functionType },
      render: (log) => (
        <Link
          href={`${ROUTES.AI_ACTIVITY_LOG}/${log.id}`}
          className="font-semibold text-primary hover:text-primary-hover"
        >
          {FUNCTION_TYPE_LABELS[log.functionType]}
        </Link>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      filter: { key: 'tier', options: TIER_FILTER_OPTIONS, activeValue: tier },
      render: (log) => <span className="text-on-surface-variant">{TIER_LABELS[log.tier]}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      filter: { key: 'status', options: STATUS_FILTER_OPTIONS, activeValue: status },
      render: (log) => (
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_CLASSES[log.status])}>
          {STATUS_LABELS[log.status]}
        </span>
      ),
    },
    {
      key: 'organization',
      header: 'Organization',
      render: (log) => (
        <span className="text-xs text-on-surface-muted">{log.organizationId ?? '—'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Called at',
      render: (log) => (
        <span className="text-on-surface-variant">{new Date(log.createdAt).toLocaleString()}</span>
      ),
    },
    {
      key: 'latency',
      header: 'Response time',
      render: (log) => <span className="text-on-surface-variant">{formatLatency(log.latencyMs)}</span>,
    },
  ];
}

export function AiActivityLogDashboard() {
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
      const message = error instanceof Error ? error.message : 'Failed to load AI activity logs';
      setErrorMessage(message);
      showToast.error('Failed to load AI activity logs', { description: message });
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
        showToast.error('Failed to load summary stats', {
          description: error instanceof Error ? error.message : 'Something went wrong.',
        });
      } finally {
        setIsSummaryLoading(false);
      }
    })();
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
        showToast.error('Failed to load activity charts', {
          description: error instanceof Error ? error.message : 'Something went wrong.',
        });
      } finally {
        setIsChartsLoading(false);
      }
    })();
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
      showToast.error('Failed to build report', {
        description: error instanceof Error ? error.message : 'Something went wrong.',
      });
    } finally {
      setIsBuildingReport(false);
    }
  };

  const handleCopyReport = async () => {
    if (!reportText) return;
    await navigator.clipboard.writeText(reportText);
    showToast.success('Report copied to clipboard');
  };

  if (isLoading && logs.length === 0 && !errorMessage) {
    return <LoadingState title="Loading AI activity log..." description="Please wait while data is being loaded." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-on-surface">AI Activity Log</h1>
          <span className="rounded-full bg-surface-variant px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
            Internal tool
          </span>
        </div>
        <p className="mt-1 text-sm text-on-surface-variant">
          Every call to the AI parsing/scoring functions, with full input/output, for quality review.
        </p>
      </div>

      <AiActivitySummaryTiles summary={summary} isLoading={isSummaryLoading} />

      <div className="grid gap-4 lg:grid-cols-3">
        <AiActivityTimeseriesChart title="Calls today (by hour)" buckets={hourBuckets} isLoading={isChartsLoading} />
        <AiActivityTimeseriesChart title="Calls this month (by day)" buckets={dayBuckets} isLoading={isChartsLoading} />
        <AiActivityTimeseriesChart title="Calls this year (by month)" buckets={monthBuckets} isLoading={isChartsLoading} />
      </div>

      {isFiltered ? (
        <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary-container px-4 py-2.5 text-sm text-on-primary-container">
          <span>Showing calls related to a specific batch/resume/job description.</span>
          <Link href={ROUTES.AI_ACTIVITY_LOG} className="font-semibold underline">
            Clear filter
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
          {isBuildingReport ? 'Building report...' : 'Compile report'}
        </button>
      </BulkActionBar>

      {reportText ? (
        <div className="space-y-2 rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-surface">Debug report</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleCopyReport()}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-outline bg-surface-lowest px-3 text-xs font-semibold text-on-surface transition hover:bg-surface-variant"
              >
                <CopyIcon className="size-3.5" />
                Copy
              </button>
              <button
                type="button"
                onClick={() => setReportText(null)}
                className="inline-flex h-9 cursor-pointer items-center rounded-lg px-3 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-variant"
              >
                Close
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
          title="Failed to load AI activity logs"
          description={errorMessage}
          action={
            <button
              type="button"
              onClick={() => void loadLogs()}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
            >
              Try again
            </button>
          }
        />
      ) : logs.length === 0 ? (
        <EmptyState title="No calls match these filters" description="Try clearing a filter." />
      ) : (
        <DataTable
          data={logs}
          columns={buildColumns(functionType, tier, status)}
          getRowKey={(log) => log.id}
          onFilterChange={handleFilterChange}
          selection={{ selectedIds, onChange: setSelectedIds }}
        />
      )}
    </div>
  );
}
