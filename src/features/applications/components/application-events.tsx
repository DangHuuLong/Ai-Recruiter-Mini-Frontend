'use client';

import { HistoryIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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

const renderEventDescription = (event: ApplicationEvent) => {
  if (event.eventType === 'STATUS_CHANGED') {
    const fromStatus = event.eventData?.fromStatus || 'UNKNOWN';
    const toStatus = event.eventData?.toStatus || 'UNKNOWN';
    const note = event.eventData?.note;

    return (
      <div className="space-y-1">
        <p className="text-sm text-on-surface-variant">
          Status changed from <span className="font-semibold">{fromStatus}</span> to{' '}
          <span className="font-semibold">{toStatus}</span>.
        </p>
        {typeof note === 'string' && note ? (
          <p className="text-sm text-on-surface-muted">Note: {note}</p>
        ) : null}
      </div>
    );
  }

  if (event.eventType === 'APPLICATION_CREATED') {
    return <p className="text-sm text-on-surface-variant">Application was created.</p>;
  }

  return (
    <p className="text-sm text-on-surface-variant">
      Event data: {JSON.stringify(event.eventData ?? {})}
    </p>
  );
};

export function ApplicationEvents({ applicationId, reloadKey }: ApplicationEventsProps) {
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
          error instanceof Error ? error.message : 'Failed to load application events';
        setErrorMessage(message);
        showToast.error('Failed to load application events', {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvents();
  }, [applicationId, reloadKey]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading application events..."
        description="Please wait while the application timeline is being loaded."
      />
    );
  }

  if (errorMessage) {
    return <EmptyState title="Failed to load events" description={errorMessage} />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title="No application events"
        description="Status changes and lifecycle events will appear here."
      />
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">Application events</h2>
        <p className="mt-1 text-sm text-on-surface-muted">
          Events are ordered by newest first.
        </p>
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
                <div className="mt-2">{renderEventDescription(event)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
