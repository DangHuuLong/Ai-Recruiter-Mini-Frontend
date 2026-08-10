'use client';

import { ArrowRightIcon, InfoIcon } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getApplications } from '@/features/applications/api/application.api';
import type { Application } from '@/features/applications/types/application.type';
import { createEvaluation } from '@/features/evaluations/api/evaluation.api';

export function EvaluationForm() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationId, setApplicationId] = useState('');
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoadingOptions(true);
        setErrorMessage(null);
        const response = await getApplications({
          page: 1,
          limit: 100,
          sortBy: 'lastActivityAt',
          sortOrder: 'desc',
        });
        setApplications(response.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load applications';
        setErrorMessage(message);
        showToast.error('Failed to load applications', { description: message });
      } finally {
        setIsLoadingOptions(false);
      }
    };

    void loadApplications();
  }, []);

  const handleSubmit = async () => {
    if (!applicationId) {
      showToast.warning('Please select an application');
      return;
    }

    try {
      setIsSubmitting(true);
      const evaluation = await createEvaluation({ applicationId });
      showToast.success('Evaluation created successfully');
      router.push(`/evaluations/${evaluation.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create evaluation';
      showToast.error('Failed to create evaluation', { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingOptions) {
    return (
      <LoadingState
        title="Loading applications..."
        description="Please wait while applications are being loaded."
      />
    );
  }

  if (errorMessage) {
    return <EmptyState title="Unable to load applications" description={errorMessage} />;
  }

  const selectedApplication = applications.find((application) => application.id === applicationId);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      className="space-y-6 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card"
    >
      <div>
        <label htmlFor="applicationId" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          Application
        </label>
        <select
          id="applicationId"
          value={applicationId}
          onChange={(event) => setApplicationId(event.target.value)}
          disabled={isSubmitting}
          className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
        >
          <option value="">Select an application</option>
          {applications.map((application) => (
            <option key={application.id} value={application.id}>
              {application.candidate?.fullName || application.candidateId} ·{' '}
              {application.jobDescription?.title || application.jobDescriptionId} · {application.status}
            </option>
          ))}
        </select>
        {applications.length === 0 ? (
          <p className="mt-1.5 text-xs font-medium text-warning">
            No applications available. Create an application first.
          </p>
        ) : null}
      </div>

      {selectedApplication ? (
        <div className="rounded-xl border border-outline bg-surface-variant px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">Selected application</p>
          <p className="mt-1 text-sm text-on-surface">
            {selectedApplication.candidate?.fullName || selectedApplication.candidateId}
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {selectedApplication.jobDescription?.title || selectedApplication.jobDescriptionId}
          </p>
        </div>
      ) : null}

      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary-container p-4">
        <InfoIcon className="size-5 shrink-0 text-on-primary-container" />
        <p className="text-sm text-on-primary-container">
          <span className="font-semibold">Scoring runs asynchronously</span> — you&apos;ll be redirected to the
          evaluation detail page once the job is queued, and results will appear as soon as the pipeline finishes.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-outline pt-5">
        <button
          type="button"
          onClick={() => router.push('/evaluations')}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || applications.length === 0}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled"
        >
          {isSubmitting ? 'Creating...' : 'Create evaluation'}
          {!isSubmitting ? <ArrowRightIcon className="size-4" /> : null}
        </button>
      </div>
    </form>
  );
}
