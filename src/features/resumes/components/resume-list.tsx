'use client';

import { EyeIcon, FileTextIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  ActionIconButton,
  ConfirmDialog,
  DataTable,
  ListControls,
  type DataTableColumn,
  type DataTableSort,
  type DataTableSortOrder,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { deleteResume, getResumes } from '@/features/resumes/api/resume.api';
import type { ParseStatus, Resume, ResumeQuery } from '@/features/resumes/types/resume.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { formatDate } from '@/lib/utils/format-date';

const PAGE_SIZE = 10;

const PARSE_STATUS_CLASSES: Record<ParseStatus, string> = {
  PENDING: 'bg-surface-variant text-on-surface-variant',
  PROCESSING: 'bg-info/15 text-info',
  SUCCESS: 'bg-success-container text-success',
  FAILED: 'bg-error-container text-error',
};

function buildColumns(
  t: ReturnType<typeof useTranslations<'resumes'>>,
  parseStatus: ParseStatus | '',
  onDelete: (resume: Resume) => void,
): DataTableColumn<Resume>[] {
  const parseStatusFilterOptions = [
    { label: t('parseStatusOptions.pending'), value: 'PENDING' },
    { label: t('parseStatusOptions.processing'), value: 'PROCESSING' },
    { label: t('parseStatusOptions.success'), value: 'SUCCESS' },
    { label: t('parseStatusOptions.failed'), value: 'FAILED' },
  ];

  return [
    {
      key: 'resume',
      header: t('columns.resume'),
      render: (resume) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-variant text-on-surface-variant">
            <FileTextIcon className="size-4" />
          </div>
          <div>
            <p className="max-w-[200px] truncate text-sm font-semibold text-on-surface">
              {resume.fileAsset?.fileName || resume.id}
            </p>
            <p className="font-mono text-xs text-on-surface-muted">{resume.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'candidate',
      header: t('columns.candidate'),
      render: (resume) => <p className="font-mono text-xs text-on-surface-variant">{resume.candidateId}</p>,
    },
    {
      key: 'status',
      header: t('columns.parseStatus'),
      filter: { key: 'parseStatus', options: parseStatusFilterOptions, activeValue: parseStatus },
      render: (resume) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PARSE_STATUS_CLASSES[resume.parseStatus]}`}>
          {resume.parseStatus}
        </span>
      ),
    },
    {
      key: 'parser',
      header: t('columns.parser'),
      render: (resume) => <p className="text-sm text-on-surface-variant">{resume.parserVersion || t('notProvided')}</p>,
    },
    {
      key: 'updatedAt',
      header: t('columns.updated'),
      sortKey: 'updatedAt',
      render: (resume) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">
          {resume.updatedAt ? formatDate(resume.updatedAt) : t('notRecorded')}
        </p>
      ),
    },
    {
      key: 'action',
      header: t('columns.action'),
      className: 'text-right',
      render: (resume) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <ActionIconButton href={`/resumes/${resume.id}`} icon={<EyeIcon className="size-4" />} label={t('actions.view')} />
          <ActionIconButton href={`/resumes/${resume.id}/edit`} icon={<PencilIcon className="size-4" />} label={t('actions.edit')} />
          <ActionIconButton
            icon={<Trash2Icon className="size-4" />}
            label={t('actions.delete')}
            variant="danger"
            onClick={() => onDelete(resume)}
          />
        </div>
      ),
    },
  ];
}

export function ResumeList() {
  const t = useTranslations('resumes');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [parseStatus, setParseStatus] = useState<ParseStatus | ''>('');
  const [sort, setSort] = useState<DataTableSort | null>({ key: 'createdAt', order: 'desc' });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getResumes({
        page,
        limit: PAGE_SIZE,
        search,
        parseStatus: parseStatus || undefined,
        sortBy: (sort?.key as ResumeQuery['sortBy']) ?? 'createdAt',
        sortOrder: sort?.order ?? 'desc',
      });
      setResumes(response.data);
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
    void loadResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, parseStatus, sort]);

  const handleSortChange = (key: string, order: DataTableSortOrder) => {
    setSort({ key, order });
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'parseStatus') {
      setParseStatus(value as ParseStatus | '');
      setPage(1);
    }
  };

  const handleDelete = async () => {
    if (!resumeToDelete) return;

    try {
      setIsDeleting(true);
      await deleteResume(resumeToDelete.id);
      showToast.success(t('list.deleteSuccess'));
      setResumeToDelete(null);
      await loadResumes();
    } catch (error) {
      showToast.error(t('list.deleteFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.deleteFailedFallback'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && resumes.length === 0) {
    return <LoadingState title={t('list.loadingTitle')} description={t('list.loadingDescription')} />;
  }

  if (errorMessage && resumes.length === 0) {
    return (
      <EmptyState
        title={t('list.errorTitle')}
        description={errorMessage}
        action={<button type="button" onClick={() => void loadResumes()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">{t('list.tryAgain')}</button>}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">{t('list.title')}</h2>
        <p className="mt-1 text-sm text-on-surface-muted">{t('list.countFound', { count: meta.total })}</p>
      </div>

      <ListControls
        search={{
          value: search,
          placeholder: t('list.searchPlaceholder'),
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
        }}
        pagination={{ ...meta, onPageChange: setPage }}
      />

      {resumes.length === 0 ? (
        <EmptyState title={t('list.emptyTitle')} description={t('list.emptyDescription')} />
      ) : (
        <DataTable
          data={resumes}
          columns={buildColumns(t, parseStatus, setResumeToDelete)}
          getRowKey={(resume) => resume.id}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      )}

      <ConfirmDialog
        open={Boolean(resumeToDelete)}
        title={t('list.deleteConfirmTitle')}
        description={t('list.deleteConfirmDescription')}
        confirmLabel={t('list.deleteConfirmAction')}
        isLoading={isDeleting}
        onCancel={() => setResumeToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}
