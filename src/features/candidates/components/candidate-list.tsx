'use client';

import { EyeIcon, PencilIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  ActionIconButton,
  AvatarChip,
  BulkActionBar,
  ConfirmDialog,
  DataTable,
  ListControls,
  type DataTableColumn,
  type DataTableSort,
  type DataTableSortOrder,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { bulkDeleteCandidates, deleteCandidate, getCandidates } from '@/features/candidates/api/candidate.api';
import type { Candidate, CandidateQuery } from '@/features/candidates/types/candidate.type';
import type { PaginationMeta } from '@/lib/api/api-types';

const PAGE_SIZE = 10;

function buildCandidateColumns(onDelete: (candidate: Candidate) => void): DataTableColumn<Candidate>[] {
  return [
    {
      key: 'candidate',
      header: 'Candidate',
      sortKey: 'fullName',
      render: (candidate) => (
        <div className="flex items-center gap-3">
          <AvatarChip name={candidate.fullName} seed={candidate.id} />
          <div>
            <p className="font-semibold text-on-surface">{candidate.fullName}</p>
            <p className="font-mono text-xs text-on-surface-muted">{candidate.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortKey: 'primaryEmail',
      render: (candidate) =>
        candidate.primaryEmail ? (
          <a
            href={`mailto:${candidate.primaryEmail}`}
            className="max-w-xs truncate text-sm text-primary hover:underline"
          >
            {candidate.primaryEmail}
          </a>
        ) : (
          <p className="text-sm text-on-surface-muted">Not provided</p>
        ),
    },
    {
      key: 'phone',
      header: 'Phone',
      sortKey: 'primaryPhone',
      render: (candidate) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">
          {candidate.primaryPhone || 'Not provided'}
        </p>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortKey: 'location',
      render: (candidate) => (
        <p className="text-sm text-on-surface-variant">{candidate.location || 'Not provided'}</p>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (candidate) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <ActionIconButton href={`/candidates/${candidate.id}`} icon={<EyeIcon className="size-4" />} label="View" />
          <ActionIconButton href={`/candidates/${candidate.id}/edit`} icon={<PencilIcon className="size-4" />} label="Edit" />
          <ActionIconButton
            icon={<Trash2Icon className="size-4" />}
            label="Delete"
            variant="danger"
            onClick={() => onDelete(candidate)}
          />
        </div>
      ),
    },
  ];
}

export function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<DataTableSort | null>({ key: 'createdAt', order: 'desc' });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getCandidates({
        page,
        limit: PAGE_SIZE,
        search,
        sortBy: (sort?.key as CandidateQuery['sortBy']) ?? 'createdAt',
        sortOrder: sort?.order ?? 'desc',
      });
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
  }, [page, search, sort]);

  const handleSortChange = (key: string, order: DataTableSortOrder) => {
    setSort({ key, order });
    setPage(1);
  };

  const handleBulkDelete = async () => {
    try {
      setIsBulkDeleting(true);
      const results = await bulkDeleteCandidates(Array.from(selectedIds));
      const succeeded = results.filter((result) => result.success).length;
      const failed = results.length - succeeded;
      if (failed === 0) {
        showToast.success(`${succeeded} candidate${succeeded === 1 ? '' : 's'} deleted successfully`);
      } else {
        showToast.warning(`${succeeded} deleted, ${failed} failed`, {
          description: results.find((result) => !result.success)?.error,
        });
      }
      setSelectedIds(new Set());
      setIsBulkConfirmOpen(false);
      await loadCandidates();
    } catch (error) {
      showToast.error('Bulk delete failed', {
        description: error instanceof Error ? error.message : 'Something went wrong while deleting candidates.',
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

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
        action={
          <button
            type="button"
            onClick={() => void loadCandidates()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Try again
          </button>
        }
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
          <UsersIcon className="size-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface-variant">Total candidates</p>
          <p className="text-2xl font-bold text-on-surface">{meta.total}</p>
        </div>
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

      <BulkActionBar count={selectedIds.size} onClear={() => setSelectedIds(new Set())}>
        <button
          type="button"
          onClick={() => setIsBulkConfirmOpen(true)}
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl bg-error px-4 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          <Trash2Icon className="size-4" />
          Delete selected
        </button>
      </BulkActionBar>

      {candidates.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description="Create the first candidate profile or adjust your search keyword."
          action={
            <Link
              href="/candidates/new"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
            >
              Create Candidate
            </Link>
          }
        />
      ) : (
        <DataTable
          data={candidates}
          columns={buildCandidateColumns(setCandidateToDelete)}
          getRowKey={(candidate) => candidate.id}
          sort={sort}
          onSortChange={handleSortChange}
          selection={{ selectedIds, onChange: setSelectedIds }}
        />
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

      <ConfirmDialog
        open={isBulkConfirmOpen}
        title={`Delete ${selectedIds.size} candidate${selectedIds.size === 1 ? '' : 's'}?`}
        description="This removes each selected candidate profile that has no related resumes or applications. This cannot be undone."
        confirmLabel="Delete selected"
        isLoading={isBulkDeleting}
        onCancel={() => setIsBulkConfirmOpen(false)}
        onConfirm={() => void handleBulkDelete()}
      />
    </section>
  );
}