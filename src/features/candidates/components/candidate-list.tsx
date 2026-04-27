'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { DataTable, type DataTableColumn } from '@/components/common/data-table';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useCandidates } from '@/features/candidates/hooks/use-candidates';
import type { Candidate } from '@/features/candidates/types/candidate.type';

const candidateColumns: DataTableColumn<Candidate>[] = [
  {
    key: 'candidate',
    header: 'Candidate',
    render: (candidate) => (
      <div>
        <p className="text-sm font-semibold text-slate-950">
          {candidate.fullName}
        </p>

        <p className="mt-1 text-xs text-slate-500">ID: {candidate.id}</p>
      </div>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (candidate) => (
      <p className="max-w-xs truncate text-sm text-slate-600">
        {candidate.primaryEmail || 'Not provided'}
      </p>
    ),
  },
  {
    key: 'phone',
    header: 'Phone',
    render: (candidate) => (
      <p className="whitespace-nowrap text-sm text-slate-600">
        {candidate.primaryPhone || 'Not provided'}
      </p>
    ),
  },
  {
    key: 'location',
    header: 'Location',
    render: (candidate) => (
      <p className="text-sm text-slate-600">
        {candidate.location || 'Not provided'}
      </p>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    className: 'text-right',
    render: (candidate) => (
      <Link
        href={`/candidates/${candidate.id}`}
        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        View detail
      </Link>
    ),
  },
];

export function CandidateList() {
  const { candidates, isLoading, errorMessage, refetchCandidates } =
    useCandidates();

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    showToast.error('Failed to load candidates', {
      description: errorMessage,
    });
  }, [errorMessage]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading candidates..."
        description="Please wait while candidate profiles are being loaded."
      />
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Failed to load candidates"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => {
              void refetchCandidates();
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Try again
          </button>
        }
      />
    );
  }

  if (candidates.length === 0) {
    return (
      <EmptyState
        title="No candidates yet"
        description="Create the first candidate profile before uploading resumes or creating applications."
        action={
          <Link
            href="/candidates/new"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Create Candidate
          </Link>
        }
      />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Candidate list
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {candidates.length} candidate profile
          {candidates.length > 1 ? 's' : ''} found.
        </p>
      </div>

      <DataTable
        data={candidates}
        columns={candidateColumns}
        getRowKey={(candidate) => candidate.id}
      />
    </section>
  );
}