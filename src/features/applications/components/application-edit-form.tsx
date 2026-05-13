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
        action={<button type="button" onClick={() => void loadApplication()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-950">Edit application</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update application source and notes. Status changes stay on the detail page status form.
        </p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Source</span>
            <input
              value={source}
              onChange={(event) => setSource(event.target.value)}
              disabled={isSaving}
              placeholder="LinkedIn, Referral, Job Board..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Linked records</p>
            <p className="mt-1 text-sm text-slate-700">Candidate: {application.candidate?.fullName || application.candidateId}</p>
            <p className="mt-1 text-sm text-slate-700">JD: {application.jobDescription?.title || application.jobDescriptionId}</p>
          </div>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={isSaving}
            rows={8}
            placeholder="Internal application notes..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => router.push(`/applications/${applicationId}`)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
