'use client';

import { CopyIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { JobSkillManager } from '@/features/job-descriptions/components/job-skill-manager';
import { ParsedJobDescriptionPanel } from '@/features/job-descriptions/components/parsed-job-description-panel';
import { useJobDescriptionDetail } from '@/features/job-descriptions/hooks/use-job-description-detail';
import type { JobSkill } from '@/features/job-descriptions/types/job-description.type';

type JobDescriptionDetailProps = { id: string };

function statusClassName(status: string) {
  switch (status) {
    case 'SUCCESS':
      return 'bg-success-container text-success';
    case 'FAILED':
      return 'bg-error-container text-error';
    case 'PROCESSING':
      return 'bg-warning-container text-on-surface';
    default:
      return 'bg-surface-variant text-on-surface-variant';
  }
}

export function JobDescriptionDetail({ id }: JobDescriptionDetailProps) {
  const {
    jobDescription,
    isLoading,
    isParsing,
    errorMessage,
    refetchJobDescription,
    parseCurrentJobDescription,
    setJobDescription,
  } = useJobDescriptionDetail(id);

  useEffect(() => {
    if (!errorMessage) return;
    showToast.error('Failed to load job description', { description: errorMessage });
  }, [errorMessage]);

  const handleParse = async () => {
    try {
      const parsedJobDescription = await parseCurrentJobDescription();
      showToast.success('Job description parsed successfully', {
        description: `${parsedJobDescription.title} parsed and job skills synced.`,
      });
    } catch (error) {
      showToast.error('Failed to parse job description', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleSkillsChange = (skills: JobSkill[]) => {
    if (!jobDescription) return;
    setJobDescription({
      ...jobDescription,
      skills,
      _count: jobDescription._count ? { ...jobDescription._count, skills: skills.length } : jobDescription._count,
    });
  };

  if (isLoading) {
    return <LoadingState title="Loading job description..." description="Please wait while the job description detail is being loaded." />;
  }

  if (errorMessage || !jobDescription) {
    return (
      <EmptyState
        title="Job description not found"
        description={errorMessage ?? 'The requested job description could not be loaded.'}
        action={<button type="button" onClick={() => void refetchJobDescription()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">Try again</button>}
      />
    );
  }

  const skills = jobDescription.skills ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/job-descriptions" className="cursor-pointer text-sm font-semibold text-primary hover:underline">← Back to job descriptions</Link>
          <h1 className="mt-3 text-2xl font-bold text-on-surface">{jobDescription.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">{jobDescription.companyName || 'No company'} · {jobDescription.location || 'No location'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName(jobDescription.parseStatus)}`}>{jobDescription.parseStatus}</span>
            {jobDescription.employmentType ? <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">{jobDescription.employmentType}</span> : null}
            {jobDescription.seniority ? <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">{jobDescription.seniority}</span> : null}
          </div>
          {jobDescription.parsingError ? <p className="mt-3 rounded-xl bg-error-container px-3 py-2 text-sm text-error">{jobDescription.parsingError}</p> : null}
        </div>

        <button type="button" onClick={() => void handleParse()} disabled={isParsing} className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled">
          <SparklesIcon className="size-4" />
          {isParsing ? 'Parsing...' : 'Parse JD'}
        </button>
      </div>

      <section className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">Raw JD Text</h2>
            <p className="mt-1 text-sm text-on-surface-muted">Original job description content stored by the backend.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-on-surface-muted">Parser version: {jobDescription.parserVersion || 'Not parsed yet'}</span>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(jobDescription.rawText);
                showToast.success('Raw JD text copied to clipboard');
              }}
              className="cursor-pointer rounded-lg p-1.5 text-on-surface-muted transition-colors hover:bg-surface-variant hover:text-on-surface"
              aria-label="Copy raw JD text"
            >
              <CopyIcon className="size-4" />
            </button>
          </div>
        </div>
        <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-2xl border border-outline bg-surface-variant p-5 text-sm leading-6 text-on-surface-variant">{jobDescription.rawText}</pre>
      </section>

      <ParsedJobDescriptionPanel parsedData={jobDescription.parsedData} />
      <JobSkillManager jobDescriptionId={jobDescription.id} skills={skills} onSkillsChange={handleSkillsChange} />
    </div>
  );
}
