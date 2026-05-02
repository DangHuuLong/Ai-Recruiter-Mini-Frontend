'use client';

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
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'FAILED':
      return 'bg-red-50 text-red-700 ring-red-200';
    case 'PROCESSING':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    default:
      return 'bg-slate-50 text-slate-600 ring-slate-200';
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
        action={<button type="button" onClick={() => void refetchJobDescription()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  const skills = jobDescription.skills ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/job-descriptions" className="text-sm font-semibold text-blue-600 hover:text-blue-700">← Back to job descriptions</Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{jobDescription.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{jobDescription.companyName || 'No company'} · {jobDescription.location || 'No location'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClassName(jobDescription.parseStatus)}`}>{jobDescription.parseStatus}</span>
            {jobDescription.employmentType ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{jobDescription.employmentType}</span> : null}
            {jobDescription.seniority ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{jobDescription.seniority}</span> : null}
          </div>
          {jobDescription.parsingError ? <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{jobDescription.parsingError}</p> : null}
        </div>

        <button type="button" onClick={() => void handleParse()} disabled={isParsing} className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
          {isParsing ? 'Parsing...' : 'Parse JD'}
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Raw JD Text</h2>
            <p className="mt-1 text-sm text-slate-500">Original job description content stored by the backend.</p>
          </div>
          <div className="text-sm text-slate-500">Parser version: {jobDescription.parserVersion || 'Not parsed yet'}</div>
        </div>
        <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-950 p-5 text-sm leading-6 text-slate-50">{jobDescription.rawText}</pre>
      </section>

      <ParsedJobDescriptionPanel parsedData={jobDescription.parsedData} />
      <JobSkillManager jobDescriptionId={jobDescription.id} skills={skills} onSkillsChange={handleSkillsChange} />
    </div>
  );
}
