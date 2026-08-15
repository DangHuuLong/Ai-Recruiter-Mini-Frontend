'use client';

import { InfoIcon } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { createApplication } from '@/features/applications/api/application.api';
import type { CreateApplicationPayload } from '@/features/applications/types/application.type';
import { getCandidates, getCandidateResumesByCandidateId } from '@/features/candidates/api/candidate.api';
import type { Candidate } from '@/features/candidates/types/candidate.type';
import { getJobDescriptions } from '@/features/job-descriptions/api/job-description.api';
import type { JobDescription } from '@/features/job-descriptions/types/job-description.type';
import type { Resume } from '@/features/resumes/types/resume.type';

const fieldClassName =
  'h-11 w-full rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30';

const labelClassName = 'text-xs font-semibold uppercase tracking-wide text-on-surface-variant';

export function ApplicationForm() {
  const t = useTranslations('applications.form');
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [candidateId, setCandidateId] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [jobDescriptionId, setJobDescriptionId] = useState('');
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeJobDescriptions = useMemo(() => {
    return jobDescriptions.filter((jobDescription) => jobDescription.isActive);
  }, [jobDescriptions]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoadingOptions(true);
        setErrorMessage(null);
        const [candidateResponse, jobDescriptionResponse] = await Promise.all([
          getCandidates({ page: 1, limit: 100 }),
          getJobDescriptions({ page: 1, limit: 100 }),
        ]);

        setCandidates(candidateResponse.data);
        setJobDescriptions(jobDescriptionResponse.data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t('loadOptionsFailedFallback');
        setErrorMessage(message);
        showToast.error(t('loadOptionsFailedFallback'), {
          description: message,
        });
      } finally {
        setIsLoadingOptions(false);
      }
    };

    void loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!candidateId) {
      setResumes([]);
      setResumeId('');
      return;
    }

    const loadResumes = async () => {
      try {
        setIsLoadingResumes(true);
        setResumeId('');
        const candidateResumes = await getCandidateResumesByCandidateId(candidateId);
        setResumes(candidateResumes);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t('loadOptionsFailedFallback');
        setResumes([]);
        showToast.error(t('loadOptionsFailedFallback'), {
          description: message,
        });
      } finally {
        setIsLoadingResumes(false);
      }
    };

    void loadResumes();
  }, [candidateId, t]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!candidateId || !resumeId || !jobDescriptionId) {
      showToast.warning(t('missingSelectionTitle'), {
        description: t('missingSelectionDescription'),
      });
      return;
    }

    const payload: CreateApplicationPayload = {
      candidateId,
      resumeId,
      jobDescriptionId,
      source: source.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      const application = await createApplication(payload);
      showToast.success(t('createSuccessTitle'));
      router.push(`/applications/${application.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('createFailedFallback');
      showToast.error(t('createFailedTitle'), {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingOptions) {
    return (
      <LoadingState
        title={t('loadingFormTitle')}
        description={t('loadingFormDescription')}
      />
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title={t('unableToLoadTitle')}
        description={errorMessage}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary-container p-4">
        <InfoIcon className="size-5 shrink-0 text-on-primary-container" />
        <p className="text-sm text-on-primary-container">
          <span className="font-semibold">{t('workflowNoteTitle')}</span> {t('workflowNoteBody')}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <label className="space-y-2">
          <span className={labelClassName}>{t('candidateLabel')}</span>
          <select
            value={candidateId}
            onChange={(event) => setCandidateId(event.target.value)}
            className={fieldClassName}
          >
            <option value="">{t('selectCandidate')}</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.fullName}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>{t('resumeLabel')}</span>
          <select
            value={resumeId}
            onChange={(event) => setResumeId(event.target.value)}
            disabled={!candidateId || isLoadingResumes}
            className={fieldClassName}
          >
            <option value="">
              {isLoadingResumes ? t('loadingResumes') : t('selectResume')}
            </option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.fileAsset?.fileName || resume.id} - {resume.parseStatus}
              </option>
            ))}
          </select>
          {candidateId && !isLoadingResumes && resumes.length === 0 ? (
            <p className="text-xs font-medium text-warning">{t('noResumeYet')}</p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>{t('jobDescriptionLabel')}</span>
          <select
            value={jobDescriptionId}
            onChange={(event) => setJobDescriptionId(event.target.value)}
            className={fieldClassName}
          >
            <option value="">{t('selectActiveJd')}</option>
            {activeJobDescriptions.map((jobDescription) => (
              <option key={jobDescription.id} value={jobDescription.id}>
                {jobDescription.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="space-y-2">
          <span className={labelClassName}>{t('sourceLabel')}</span>
          <input
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder={t('sourcePlaceholder')}
            className={fieldClassName}
          />
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>{t('notesLabel')}</span>
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t('notesPlaceholder')}
            className={fieldClassName}
          />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-outline pt-5">
        <button
          type="button"
          onClick={() => router.push('/applications')}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
        >
          {t('cancel')}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? t('creating') : t('create')}
        </button>
      </div>
    </form>
  );
}
