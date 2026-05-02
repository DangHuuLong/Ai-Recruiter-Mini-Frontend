'use client';

import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getApplicationEvents } from '@/features/applications/api/application.api';
import type { ApplicationEvent } from '@/features/applications/types/application.type';

type ApplicationEventsProps = {
  applicationId: string;
  reloadKey?: string | number;
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const renderEventDescription = (event: ApplicationEvent) => {
  if (event.eventType === 'STATUS_CHANGED') {
    const fromStatus = event.eventData?.fromStatus || 'UNKNOWN';
    const toStatus = event.eventData?.toStatus || 'UNKNOWN';
    const note = event.eventData?.note;

    return (
      <div className="space-y-1">
        <p className="text-sm text-slate-700">
          Status changed from <span className="font-semibold">{fromStatus}</span> to{' '}
          <span className="font-semibold">{toStatus}</span>.
        </p>
        {typeof note === 'string' && note ? (
          <p className="text-sm text-slate-500">Note: {note}</p>
        ) : null}
      </div>
    );
  }

  if (event.eventType === 'APPLICATION_CREATED') {
    return <p className="text-sm text-slate-700">Application was created.</p>;
  }

  return (
    <p className="text-sm text-slate-700">
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
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Application events</h2>
        <p className="mt-1 text-sm text-slate-500">
          Events are ordered by newest first.
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {event.eventType}
                </p>
                <p className="mt-1 text-xs text-slate-500">ID: {event.id}</p>
              </div>
              <p className="text-xs font-medium text-slate-500">
                {formatDate(event.createdAt)}
              </p>
            </div>
            <div className="mt-3">{renderEventDescription(event)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
