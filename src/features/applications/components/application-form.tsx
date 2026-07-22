'use client';

import { InfoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

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
          error instanceof Error ? error.message : 'Failed to load form options';
        setErrorMessage(message);
        showToast.error('Failed to load form options', {
          description: message,
        });
      } finally {
        setIsLoadingOptions(false);
      }
    };

    void loadOptions();
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
          error instanceof Error ? error.message : 'Failed to load candidate resumes';
        setResumes([]);
        showToast.error('Failed to load candidate resumes', {
          description: message,
        });
      } finally {
        setIsLoadingResumes(false);
      }
    };

    void loadResumes();
  }, [candidateId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!candidateId || !resumeId || !jobDescriptionId) {
      showToast.warning('Missing required selection', {
        description: 'Please select a candidate, resume, and job description.',
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
      showToast.success('Application created successfully');
      router.push(`/applications/${application.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create application';
      showToast.error('Failed to create application', {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingOptions) {
    return (
      <LoadingState
        title="Loading application form..."
        description="Please wait while candidates and job descriptions are being loaded."
      />
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Unable to load form options"
        description={errorMessage}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary-container p-4">
        <InfoIcon className="size-5 shrink-0 text-on-primary-container" />
        <p className="text-sm text-on-primary-container">
          <span className="font-semibold">Workflow requirement:</span> resume selection is locked until a candidate is
          selected — resume options are filtered to that candidate&apos;s own resumes.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <label className="space-y-2">
          <span className={labelClassName}>Candidate</span>
          <select
            value={candidateId}
            onChange={(event) => setCandidateId(event.target.value)}
            className={fieldClassName}
          >
            <option value="">Select candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.fullName}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>Resume</span>
          <select
            value={resumeId}
            onChange={(event) => setResumeId(event.target.value)}
            disabled={!candidateId || isLoadingResumes}
            className={fieldClassName}
          >
            <option value="">
              {isLoadingResumes ? 'Loading resumes...' : 'Select resume'}
            </option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.fileAsset?.fileName || resume.id} - {resume.parseStatus}
              </option>
            ))}
          </select>
          {candidateId && !isLoadingResumes && resumes.length === 0 ? (
            <p className="text-xs font-medium text-warning">
              This candidate has no resume yet.
            </p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>Job description</span>
          <select
            value={jobDescriptionId}
            onChange={(event) => setJobDescriptionId(event.target.value)}
            className={fieldClassName}
          >
            <option value="">Select active JD</option>
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
          <span className={labelClassName}>Source</span>
          <input
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder="LinkedIn, Referral, Job Board..."
            className={fieldClassName}
          />
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>Notes</span>
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Internal note"
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
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Create Application'}
        </button>
      </div>
    </form>
  );
}
