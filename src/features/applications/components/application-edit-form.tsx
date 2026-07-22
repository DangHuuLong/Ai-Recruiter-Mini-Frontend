'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import {
  getApplicationById,
  updateApplication,
} from '@/features/applications/api/application.api';
import type { Application } from '@/features/applications/types/application.type';

type ApplicationEditFormProps = {
  applicationId: string;
};

export function ApplicationEditForm({ applicationId }: ApplicationEditFormProps) {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadApplication = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getApplicationById(applicationId);
      setApplication(data);
      setSource(data.source ?? '');
      setNotes(data.notes ?? '');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load application';
      setErrorMessage(message);
      showToast.error('Failed to load application', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApplication();
  }, [applicationId]);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      await updateApplication(applicationId, {
        source: source.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      showToast.success('Application updated successfully');
      router.push(`/applications/${applicationId}`);
    } catch (error) {
      showToast.error('Failed to update application', {
        description: error instanceof Error ? error.message : 'Something went wrong while updating the application.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState title="Loading application..." description="Please wait while application data is being loaded." />;
  }

  if (errorMessage || !application) {
    return (
      <EmptyState
        title={errorMessage ? 'Failed to load application' : 'Application not found'}
        description={errorMessage ?? 'The application could not be found.'}
        action={<button type="button" onClick={() => void loadApplication()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">Try again</button>}
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
      <div className="border-b border-outline px-6 py-5">
        <h2 className="text-lg font-semibold text-on-surface">Edit application</h2>
        <p className="mt-1 text-sm text-on-surface-muted">
          Update application source and notes. Status changes stay on the detail page status form.
        </p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Source</span>
            <input
              value={source}
              onChange={(event) => setSource(event.target.value)}
              disabled={isSaving}
              placeholder="LinkedIn, Referral, Job Board..."
              className="h-11 w-full rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            />
          </label>

          <div className="rounded-xl border border-outline bg-surface-variant px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">Linked records</p>
            <p className="mt-1 text-sm text-on-surface-variant">Candidate: {application.candidate?.fullName || application.candidateId}</p>
            <p className="mt-1 text-sm text-on-surface-variant">JD: {application.jobDescription?.title || application.jobDescriptionId}</p>
          </div>
        </div>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={isSaving}
            rows={8}
            placeholder="Internal application notes..."
            className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
          />
        </label>

        <div className="flex justify-end gap-3 border-t border-outline pt-5">
          <button
            type="button"
            onClick={() => router.push(`/applications/${applicationId}`)}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
