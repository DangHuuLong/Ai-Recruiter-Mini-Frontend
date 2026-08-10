'use client';

import { HistoryIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getApplicationEvents } from '@/features/applications/api/application.api';
import type { ApplicationEvent } from '@/features/applications/types/application.type';
import { formatDateTime } from '@/lib/utils/format-date';

type ApplicationEventsProps = {
  applicationId: string;
  reloadKey?: string | number;
};

function eventIcon(eventType: string) {
  if (eventType === 'STATUS_CHANGED') return RefreshCwIcon;
  if (eventType === 'APPLICATION_CREATED') return PlusIcon;
  return HistoryIcon;
}

function EventDescription({ event, t }: { event: ApplicationEvent; t: ReturnType<typeof useTranslations<'applications.events'>> }) {
  if (event.eventType === 'STATUS_CHANGED') {
    const fromStatus = event.eventData?.fromStatus || 'UNKNOWN';
    const toStatus = event.eventData?.toStatus || 'UNKNOWN';
    const note = event.eventData?.note;

    return (
      <div className="space-y-1">
        <p className="text-sm text-on-surface-variant">
          {t.rich('statusChanged', {
            from: fromStatus,
            to: toStatus,
            b: (chunks) => <span className="font-semibold">{chunks}</span>,
          })}
        </p>
        {typeof note === 'string' && note ? (
          <p className="text-sm text-on-surface-muted">{t('note', { note })}</p>
        ) : null}
      </div>
    );
  }

  if (event.eventType === 'APPLICATION_CREATED') {
    return <p className="text-sm text-on-surface-variant">{t('applicationCreated')}</p>;
  }

  return (
    <p className="text-sm text-on-surface-variant">
      {t('eventData', { data: JSON.stringify(event.eventData ?? {}) })}
    </p>
  );
}

export function ApplicationEvents({ applicationId, reloadKey }: ApplicationEventsProps) {
  const t = useTranslations('applications.events');
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await getApplicationEvents(applicationId);
        setEvents(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t('errorTitle');
        setErrorMessage(message);
        showToast.error(t('errorTitle'), {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId, reloadKey]);

  if (isLoading) {
    return (
      <LoadingState
        title={t('loadingTitle')}
        description={t('loadingDescription')}
      />
    );
  }

  if (errorMessage) {
    return <EmptyState title={t('errorTitle')} description={errorMessage} />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title={t('emptyTitle')}
        description={t('emptyDescription')}
      />
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">{t('title')}</h2>
        <p className="mt-1 text-sm text-on-surface-muted">{t('subtitle')}</p>
      </div>

      <div className="relative space-y-5">
        <div className="absolute top-4 bottom-4 left-4 w-px bg-outline" aria-hidden />
        {events.map((event) => {
          const Icon = eventIcon(event.eventType);
          return (
            <div key={event.id} className="relative flex gap-4 pl-0">
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container ring-4 ring-surface-lowest">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1 rounded-xl border border-outline bg-surface-variant p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex w-fit rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-primary-container">
                    {event.eventType.replaceAll('_', ' ')}
                  </span>
                  <p className="text-xs font-medium text-on-surface-muted">
                    {formatDateTime(event.createdAt)}
                  </p>
                </div>
                <div className="mt-2"><EventDescription event={event} t={t} /></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
