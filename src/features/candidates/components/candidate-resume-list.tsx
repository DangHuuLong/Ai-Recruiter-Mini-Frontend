'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { DataTable, type DataTableColumn } from '@/components/common/data-table';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useCandidateResumes } from '@/features/candidates/hooks/use-candidate-resumes';
import type { Resume } from '@/features/resumes/types/resume.type';
import { getDisplayValue } from '@/lib/utils/display-value.util';

type CandidateResumeListProps = {
  candidateId: string;
};

const resumeColumns: DataTableColumn<Resume>[] = [
  {
    key: 'resume',
    header: 'Resume',
    render: (resume) => (
      <div>
        <p className="text-sm font-semibold text-slate-950">
          Resume record
        </p>

        <p className="mt-1 text-xs text-slate-500">ID: {resume.id}</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Parse status',
    render: (resume) => (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
        {getDisplayValue(resume.parseStatus)}
      </span>
    ),
  },
  {
    key: 'candidate',
    header: 'Candidate ID',
    render: (resume) => (
      <p className="max-w-xs truncate text-sm text-slate-600">
        {getDisplayValue(resume.candidateId)}
      </p>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    className: 'text-right',
    render: (resume) => (
      <Link
        href={`/resumes/${resume.id}`}
        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        View detail
      </Link>
    ),
  },
];

export function CandidateResumeList({
  candidateId,
}: CandidateResumeListProps) {
  const { resumes, isLoading, errorMessage, refetchResumes } =
    useCandidateResumes(candidateId);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    showToast.error('Failed to load candidate resumes', {
      description: errorMessage,
    });
  }, [errorMessage]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading candidate resumes..."
        description="Please wait while this candidate's resumes are being loaded."
      />
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Failed to load candidate resumes"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => {
              void refetchResumes();
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Try again
          </button>
        }
      />
    );
  }

  if (resumes.length === 0) {
    return (
      <EmptyState
        title="No resumes linked"
        description="This candidate does not have any uploaded resumes yet."
        action={
          <Link
            href="/resumes"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Upload Resume
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-950">
          Linked resumes
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {resumes.length} resume record
          {resumes.length > 1 ? 's' : ''} linked to this candidate.
        </p>
      </div>

      <DataTable
        data={resumes}
        columns={resumeColumns}
        getRowKey={(resume) => resume.id}
      />
    </div>
  );
}