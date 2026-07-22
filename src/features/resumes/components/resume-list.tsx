'use client';

import { EyeIcon, FileTextIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

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

const PARSE_STATUS_FILTER_OPTIONS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Failed', value: 'FAILED' },
];

function buildColumns(parseStatus: ParseStatus | '', onDelete: (resume: Resume) => void): DataTableColumn<Resume>[] {
  return [
    {
      key: 'resume',
      header: 'Resume',
      sortKey: 'fileAsset.fileName',
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
      header: 'Candidate',
      sortKey: 'candidateId',
      render: (resume) => <p className="font-mono text-xs text-on-surface-variant">{resume.candidateId}</p>,
    },
    {
      key: 'status',
      header: 'Parse Status',
      filter: { key: 'parseStatus', options: PARSE_STATUS_FILTER_OPTIONS, activeValue: parseStatus },
      render: (resume) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PARSE_STATUS_CLASSES[resume.parseStatus]}`}>
          {resume.parseStatus}
        </span>
      ),
    },
    {
      key: 'parser',
      header: 'Parser',
      sortKey: 'parserVersion',
      render: (resume) => <p className="text-sm text-on-surface-variant">{resume.parserVersion || 'Not provided'}</p>,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortKey: 'updatedAt',
      render: (resume) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">
          {resume.updatedAt ? formatDate(resume.updatedAt) : 'Not recorded'}
        </p>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (resume) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <ActionIconButton href={`/resumes/${resume.id}`} icon={<EyeIcon className="size-4" />} label="View" />
          <ActionIconButton href={`/resumes/${resume.id}/edit`} icon={<PencilIcon className="size-4" />} label="Edit" />
          <ActionIconButton
            icon={<Trash2Icon className="size-4" />}
            label="Delete"
            variant="danger"
            onClick={() => onDelete(resume)}
          />
        </div>
      ),
    },
  ];
}

export function ResumeList() {
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
      const message = error instanceof Error ? error.message : 'Failed to load resumes';
      setErrorMessage(message);
      showToast.error('Failed to load resumes', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadResumes();
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
      showToast.success('Resume deleted successfully');
      setResumeToDelete(null);
      await loadResumes();
    } catch (error) {
      showToast.error('Failed to delete resume', {
        description: error instanceof Error ? error.message : 'Something went wrong while deleting the resume.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && resumes.length === 0) {
    return <LoadingState title="Loading resumes..." description="Please wait while resume records are being loaded." />;
  }

  if (errorMessage && resumes.length === 0) {
    return (
      <EmptyState
        title="Failed to load resumes"
        description={errorMessage}
        action={<button type="button" onClick={() => void loadResumes()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">Try again</button>}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">Resume list</h2>
        <p className="mt-1 text-sm text-on-surface-muted">{meta.total} resume record{meta.total === 1 ? '' : 's'} found.</p>
      </div>

      <ListControls
        search={{
          value: search,
          placeholder: 'Search by candidate, resume text, file name, or checksum...',
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
        }}
        pagination={{ ...meta, onPageChange: setPage }}
      />

      {resumes.length === 0 ? (
        <EmptyState title="No resumes found" description="Upload a resume or adjust your search keyword." />
      ) : (
        <DataTable
          data={resumes}
          columns={buildColumns(parseStatus, setResumeToDelete)}
          getRowKey={(resume) => resume.id}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      )}

      <ConfirmDialog
        open={Boolean(resumeToDelete)}
        title="Delete resume?"
        description="This action removes the resume record if the backend allows it. This cannot be undone."
        confirmLabel="Delete resume"
        isLoading={isDeleting}
        onCancel={() => setResumeToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}
