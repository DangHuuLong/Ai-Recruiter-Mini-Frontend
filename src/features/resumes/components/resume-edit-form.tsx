'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { updateResume } from '@/features/resumes/api/resume.api';
import { useResumeDetail } from '@/features/resumes/hooks/use-resume-detail';

type ResumeEditFormProps = {
  resumeId: string;
};

export function ResumeEditForm({ resumeId }: ResumeEditFormProps) {
  const router = useRouter();
  const { resume, isLoading, errorMessage, refetchResume } = useResumeDetail(resumeId);
  const [candidateId, setCandidateId] = useState('');
  const [parserVersion, setParserVersion] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!resume) return;
    setCandidateId(resume.candidateId);
    setParserVersion(resume.parserVersion ?? '');
  }, [resume]);

  const handleSubmit = async () => {
    if (!candidateId.trim()) {
      showToast.warning('Candidate ID is required');
      return;
    }

    try {
      setIsSaving(true);
      await updateResume(resumeId, {
        candidateId: candidateId.trim(),
        parserVersion: parserVersion.trim() || undefined,
      });
      showToast.success('Resume metadata updated successfully');
      router.push(`/resumes/${resumeId}`);
    } catch (error) {
      showToast.error('Failed to update resume metadata', {
        description: error instanceof Error ? error.message : 'Something went wrong while updating the resume.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState title="Loading resume..." description="Please wait while resume metadata is being loaded." />;
  }

  if (errorMessage || !resume) {
    return (
      <EmptyState
        title={errorMessage ? 'Failed to load resume' : 'Resume not found'}
        description={errorMessage ?? 'The resume record could not be found.'}
        action={<button type="button" onClick={() => void refetchResume()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-950">Edit resume metadata</h2>
        <p className="mt-1 text-sm text-slate-500">Update lightweight resume metadata without changing parsed CV content.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Candidate ID</span>
            <input value={candidateId} onChange={(event) => setCandidateId(event.target.value)} disabled={isSaving} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Parser version</span>
            <input value={parserVersion} onChange={(event) => setParserVersion(event.target.value)} disabled={isSaving} placeholder="v1" className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Link href={`/resumes/${resumeId}`} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={isSaving} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
