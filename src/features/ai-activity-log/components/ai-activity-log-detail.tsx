'use client';

import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';

import { DetailItem, DetailPageLayout, DetailSection } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import { getAiActivityLogById } from '@/features/ai-activity-log/api/ai-activity-log.api';
import {
  FUNCTION_TYPE_LABELS,
  STATUS_CLASSES,
  STATUS_LABELS,
  TIER_LABELS,
  type AiActivityLog,
} from '@/features/ai-activity-log/types/ai-activity-log.type';
import { cn } from '@/lib/utils/cn';

type AiActivityLogDetailProps = {
  id: string;
};

function relatedCallsHref(log: AiActivityLog): string | null {
  const params = new URLSearchParams();
  if (log.batchId) params.set('batchId', log.batchId);
  if (log.resumeId) params.set('resumeId', log.resumeId);
  if (log.jobDescriptionId) params.set('jobDescriptionId', log.jobDescriptionId);

  return params.toString() ? `${ROUTES.AI_ACTIVITY_LOG}?${params.toString()}` : null;
}

export function AiActivityLogDetail({ id }: AiActivityLogDetailProps) {
  const [log, setLog] = useState<AiActivityLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        setLog(await getAiActivityLogById(id));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load AI activity log';
        setErrorMessage(message);
        showToast.error('Failed to load AI activity log', { description: message });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) {
    return <LoadingState title="Loading log..." description="Please wait while the log entry is being loaded." />;
  }

  if (errorMessage || !log) {
    return (
      <EmptyState
        title="Failed to load AI activity log"
        description={errorMessage ?? 'Log not found.'}
      />
    );
  }

  const relatedHref = relatedCallsHref(log);

  return (
    <DetailPageLayout
      title={FUNCTION_TYPE_LABELS[log.functionType]}
      description={`Called ${new Date(log.createdAt).toLocaleString()} · took ${log.latencyMs}ms`}
      backHref={ROUTES.AI_ACTIVITY_LOG}
      backLabel="Back to AI Activity Log"
      actions={
        relatedHref ? (
          <Link
            href={relatedHref}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-outline bg-surface-lowest px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
          >
            View related calls
          </Link>
        ) : undefined
      }
    >
      <DetailSection title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="Tier" value={TIER_LABELS[log.tier]} />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">Status</p>
            <span className={cn('mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_CLASSES[log.status])}>
              {STATUS_LABELS[log.status]}
            </span>
          </div>
          <DetailItem label="Organization" value={log.organizationId} />
          <DetailItem label="Batch" value={log.batchId} />
          <DetailItem label="Evaluation" value={log.evaluationId} />
          <DetailItem label="Resume" value={log.resumeId} />
          <DetailItem label="Job Description" value={log.jobDescriptionId} />
          <DetailItem label="Response time" value={`${log.latencyMs}ms`} />
        </div>

        {log.errorMessage ? (
          <div className="mt-4 rounded-xl border border-error/30 bg-error-container p-4 text-sm text-error">
            {log.errorMessage}
          </div>
        ) : null}
      </DetailSection>

      <DetailSection title="Input" className="mt-6">
        <pre className="max-h-[32rem] overflow-auto rounded-xl border border-outline bg-surface p-4 text-xs text-on-surface">
          {JSON.stringify(log.input, null, 2)}
        </pre>
      </DetailSection>

      <DetailSection title="Output" className="mt-6">
        {log.output === null || log.output === undefined ? (
          <p className="text-sm text-on-surface-muted">No output — this call failed.</p>
        ) : (
          <pre className="max-h-[32rem] overflow-auto rounded-xl border border-outline bg-surface p-4 text-xs text-on-surface">
            {JSON.stringify(log.output, null, 2)}
          </pre>
        )}
      </DetailSection>
    </DetailPageLayout>
  );
}
