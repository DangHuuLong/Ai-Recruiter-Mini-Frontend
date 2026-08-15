'use client';

import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { DetailItem, DetailPageLayout, DetailSection } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import { getAiActivityLogById } from '@/features/ai-activity-log/api/ai-activity-log.api';
import {
  FUNCTION_TYPE_LABEL_KEYS,
  STATUS_CLASSES,
  STATUS_LABEL_KEYS,
  TIER_LABEL_KEYS,
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
  const t = useTranslations('aiActivityLog.detail');
  const tLabels = useTranslations('aiActivityLog.labels');
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
        const message = error instanceof Error ? error.message : t('errorTitle');
        setErrorMessage(message);
        showToast.error(t('errorTitle'), { description: message });
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return <LoadingState title={t('loadingTitle')} description={t('loadingDescription')} />;
  }

  if (errorMessage || !log) {
    return (
      <EmptyState
        title={t('errorTitle')}
        description={errorMessage ?? t('notFoundFallback')}
      />
    );
  }

  const relatedHref = relatedCallsHref(log);

  return (
    <DetailPageLayout
      title={tLabels(`functionType.${FUNCTION_TYPE_LABEL_KEYS[log.functionType]}`)}
      description={t('calledAtDescription', { date: new Date(log.createdAt).toLocaleString(), latency: log.latencyMs })}
      backHref={ROUTES.AI_ACTIVITY_LOG}
      backLabel={t('backLabel')}
      actions={
        relatedHref ? (
          <Link
            href={relatedHref}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-outline bg-surface-lowest px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
          >
            {t('viewRelatedCalls')}
          </Link>
        ) : undefined
      }
    >
      <DetailSection title={t('overview')}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label={t('tier')} value={tLabels(`tier.${TIER_LABEL_KEYS[log.tier]}`)} />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">{t('status')}</p>
            <span className={cn('mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_CLASSES[log.status])}>
              {tLabels(`status.${STATUS_LABEL_KEYS[log.status]}`)}
            </span>
          </div>
          <DetailItem label={t('organization')} value={log.organizationId} />
          <DetailItem label={t('batch')} value={log.batchId} />
          <DetailItem label={t('evaluation')} value={log.evaluationId} />
          <DetailItem label={t('resume')} value={log.resumeId} />
          <DetailItem label={t('jobDescription')} value={log.jobDescriptionId} />
          <DetailItem label={t('responseTime')} value={`${log.latencyMs}ms`} />
        </div>

        {log.errorMessage ? (
          <div className="mt-4 rounded-xl border border-error/30 bg-error-container p-4 text-sm text-error">
            {log.errorMessage}
          </div>
        ) : null}
      </DetailSection>

      <DetailSection title={t('input')} className="mt-6">
        <pre className="max-h-[32rem] overflow-auto rounded-xl border border-outline bg-surface p-4 text-xs text-on-surface">
          {JSON.stringify(log.input, null, 2)}
        </pre>
      </DetailSection>

      <DetailSection title={t('output')} className="mt-6">
        {log.output === null || log.output === undefined ? (
          <p className="text-sm text-on-surface-muted">{t('noOutput')}</p>
        ) : (
          <pre className="max-h-[32rem] overflow-auto rounded-xl border border-outline bg-surface p-4 text-xs text-on-surface">
            {JSON.stringify(log.output, null, 2)}
          </pre>
        )}
      </DetailSection>
    </DetailPageLayout>
  );
}
