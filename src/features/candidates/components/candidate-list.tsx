'use client';

import { EyeIcon, PencilIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

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

function buildCandidateColumns(
  t: ReturnType<typeof useTranslations<'candidates'>>,
  onDelete: (candidate: Candidate) => void,
): DataTableColumn<Candidate>[] {
  return [
    {
      key: 'candidate',
      header: t('columns.candidate'),
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
      header: t('columns.email'),
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
          <p className="text-sm text-on-surface-muted">{t('notProvided')}</p>
        ),
    },
    {
      key: 'phone',
      header: t('columns.phone'),
      render: (candidate) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">
          {candidate.primaryPhone || t('notProvided')}
        </p>
      ),
    },
    {
      key: 'location',
      header: t('columns.location'),
      render: (candidate) => (
        <p className="text-sm text-on-surface-variant">{candidate.location || t('notProvided')}</p>
      ),
    },
    {
      key: 'action',
      header: t('columns.action'),
      className: 'text-right',
      render: (candidate) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <ActionIconButton
            href={`/candidates/${candidate.id}`}
            icon={<EyeIcon className="size-4" />}
            label={t('actions.view')}
          />
          <ActionIconButton
            href={`/candidates/${candidate.id}/edit`}
            icon={<PencilIcon className="size-4" />}
            label={t('actions.edit')}
          />
          <ActionIconButton
            icon={<Trash2Icon className="size-4" />}
            label={t('actions.delete')}
            variant="danger"
            onClick={() => onDelete(candidate)}
          />
        </div>
      ),
    },
  ];
}

export function CandidateList() {
  const t = useTranslations('candidates');
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
      const message = error instanceof Error ? error.message : t('list.errorFallback');
      setErrorMessage(message);
      showToast.error(t('list.errorFallback'), { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        showToast.success(t('list.deletedSuccess', { count: succeeded }));
      } else {
        showToast.warning(t('list.deletedPartial', { succeeded, failed }), {
          description: results.find((result) => !result.success)?.error,
        });
      }
      setSelectedIds(new Set());
      setIsBulkConfirmOpen(false);
      await loadCandidates();
    } catch (error) {
      showToast.error(t('list.bulkDeleteFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.bulkDeleteFailedFallback'),
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
      showToast.success(t('list.deleteSuccessTitle'), {
        description: t('list.deleteSuccessDescription', { name: candidateToDelete.fullName }),
      });
      setCandidateToDelete(null);
      await loadCandidates();
    } catch (error) {
      showToast.error(t('list.deleteFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.deleteFailedFallback'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && candidates.length === 0) {
    return <LoadingState title={t('list.loadingTitle')} description={t('list.loadingDescription')} />;
  }

  if (errorMessage && candidates.length === 0) {
    return (
      <EmptyState
        title={t('list.errorTitle')}
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadCandidates()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('list.tryAgain')}
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
          <p className="text-sm font-semibold text-on-surface-variant">{t('totalCandidates')}</p>
          <p className="text-2xl font-bold text-on-surface">{meta.total}</p>
        </div>
      </div>

      <ListControls
        search={{
          value: search,
          placeholder: t('searchPlaceholder'),
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
          {t('deleteSelected')}
        </button>
      </BulkActionBar>

      {candidates.length === 0 ? (
        <EmptyState
          title={t('list.emptyTitle')}
          description={t('list.emptyDescription')}
          action={
            <Link
              href="/candidates/new"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
            >
              {t('createCandidate')}
            </Link>
          }
        />
      ) : (
        <DataTable
          data={candidates}
          columns={buildCandidateColumns(t, setCandidateToDelete)}
          getRowKey={(candidate) => candidate.id}
          sort={sort}
          onSortChange={handleSortChange}
          selection={{ selectedIds, onChange: setSelectedIds }}
        />
      )}

      <ConfirmDialog
        open={Boolean(candidateToDelete)}
        title={t('list.deleteConfirmTitle')}
        description={t('list.deleteConfirmDescription')}
        confirmLabel={t('list.deleteConfirmAction')}
        isLoading={isDeleting}
        onCancel={() => setCandidateToDelete(null)}
        onConfirm={() => void handleDeleteCandidate()}
      />

      <ConfirmDialog
        open={isBulkConfirmOpen}
        title={t('list.bulkDeleteConfirmTitle', { count: selectedIds.size })}
        description={t('list.bulkDeleteConfirmDescription')}
        confirmLabel={t('list.bulkDeleteConfirmAction')}
        isLoading={isBulkDeleting}
        onCancel={() => setIsBulkConfirmOpen(false)}
        onConfirm={() => void handleBulkDelete()}
      />
    </section>
  );
}