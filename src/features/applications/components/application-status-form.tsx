'use client';

import { RefreshCwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { showToast } from '@/components/feedback';
import { updateApplicationStatus } from '@/features/applications/api/application.api';
import type { Application, ApplicationStatus } from '@/features/applications/types/application.type';
import { APPLICATION_STATUSES } from '@/features/applications/types/application.type';

type ApplicationStatusFormProps = {
  application: Application;
  onUpdated: (application: Application) => void;
};

export function ApplicationStatusForm({
  application,
  onUpdated,
}: ApplicationStatusFormProps) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStatus(application.status);
  }, [application.status]);

  const handleUpdateStatus = async () => {
    try {
      setIsSubmitting(true);
      const updatedApplication = await updateApplicationStatus(application.id, {
        status,
        note: note.trim() || undefined,
      });

      onUpdated({
        ...application,
        ...updatedApplication,
      });
      setNote('');
      showToast.success('Application status updated successfully');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update application status';
      showToast.error('Failed to update application status', {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
          <RefreshCwIcon className="size-4" />
        </div>
        <h2 className="text-lg font-semibold text-on-surface">Update status</h2>
      </div>

      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">New status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ApplicationStatus)}
            className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
          >
            {APPLICATION_STATUSES.map((applicationStatus) => (
              <option key={applicationStatus} value={applicationStatus}>
                {applicationStatus}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Status note</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Reason for change..."
            rows={3}
            className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
          />
        </label>

        <button
          type="button"
          onClick={() => {
            void handleUpdateStatus();
          }}
          disabled={isSubmitting}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Updating...' : 'Update Status'}
        </button>

        <p className="text-xs text-on-surface-muted">Changing the status logs a permanent timeline event.</p>
      </div>
    </div>
  );
}
