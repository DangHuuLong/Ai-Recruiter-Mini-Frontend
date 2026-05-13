'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ConfirmDialog, DataTable, ListControls, type DataTableColumn } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { deleteCandidate, getCandidates } from '@/features/candidates/api/candidate.api';
import type { Candidate } from '@/features/candidates/types/candidate.type';
import type { PaginationMeta } from '@/lib/api/api-types';

const PAGE_SIZE = 10;

function buildCandidateColumns(onDelete: (candidate: Candidate) => void): DataTableColumn<Candidate>[] {
  return [
    {
      key: 'candidate',
      header: 'Candidate',
      render: (candidate) => (
        <div>
          <p className="text-sm font-semibold text-slate-950">{candidate.fullName}</p>
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
        <p className="text-sm text-slate-600">{candidate.location || 'Not provided'}</p>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (candidate) => (
        <div className="flex flex-wrap justify-end gap-3">
          <Link href={`/candidates/${candidate.id}`} className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">
            View
          </Link>
          <Link href={`/candidates/${candidate.id}/edit`} className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            Edit
          </Link>
          <button type="button" onClick={() => onDelete(candidate)} className="text-sm font-semibold text-red-600 transition hover:text-red-700">
            Delete
          </button>
        </div>
      ),
    },
  ];
}

export function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getCandidates({ page, limit: PAGE_SIZE, search, sortBy: 'createdAt', sortOrder: 'desc' });
      setCandidates(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load candidates';
      setErrorMessage(message);
      showToast.error('Failed to load candidates', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCandidates();
  }, [page, search]);

  const handleDeleteCandidate = async () => {
    if (!candidateToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCandidate(candidateToDelete.id);
      showToast.success('Candidate deleted successfully', {
        description: `${candidateToDelete.fullName} has been removed.`,
      });
      setCandidateToDelete(null);
      await loadCandidates();
    } catch (error) {
      showToast.error('Failed to delete candidate', {
        description: error instanceof Error ? error.message : 'Something went wrong while deleting the candidate.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && candidates.length === 0) {
    return <LoadingState title="Loading candidates..." description="Please wait while candidate profiles are being loaded." />;
  }

  if (errorMessage && candidates.length === 0) {
    return (
      <EmptyState
        title="Failed to load candidates"
        description={errorMessage}
        action={<button type="button" onClick={() => void loadCandidates()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Candidate list</h2>
        <p className="mt-1 text-sm text-slate-500">{meta.total} candidate profile{meta.total === 1 ? '' : 's'} found.</p>
      </div>

      <ListControls
        search={{
          value: search,
          placeholder: 'Search by name, email, phone, or location...',
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
        }}
        pagination={{ ...meta, onPageChange: setPage }}
      />

      {candidates.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description="Create the first candidate profile or adjust your search keyword."
          action={<Link href="/candidates/new" className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Create Candidate</Link>}
        />
      ) : (
        <DataTable data={candidates} columns={buildCandidateColumns(setCandidateToDelete)} getRowKey={(candidate) => candidate.id} />
      )}

      <ConfirmDialog
        open={Boolean(candidateToDelete)}
        title="Delete candidate?"
        description="This action removes the candidate profile if it has no related resumes or applications. This cannot be undone."
        confirmLabel="Delete candidate"
        isLoading={isDeleting}
        onCancel={() => setCandidateToDelete(null)}
        onConfirm={() => void handleDeleteCandidate()}
      />
    </section>
  );
}