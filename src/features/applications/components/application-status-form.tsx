'use client';

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
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Update status</h2>
        <p className="mt-1 text-sm text-slate-500">
          Changing the status creates an application event when the value changes.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr_auto] lg:items-end">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ApplicationStatus)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {APPLICATION_STATUSES.map((applicationStatus) => (
              <option key={applicationStatus} value={applicationStatus}>
                {applicationStatus}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Status note</span>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Moved to screening after initial review"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <button
          type="button"
          onClick={() => {
            void handleUpdateStatus();
          }}
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
}
