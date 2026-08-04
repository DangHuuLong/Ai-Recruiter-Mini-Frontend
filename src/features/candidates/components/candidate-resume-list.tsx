'use client';

import { EyeIcon, FileTextIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useMemo, useState } from 'react';

import { ActionIconButton, DataTable, type DataTableColumn, type DataTableSort } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useCandidateResumes } from '@/features/candidates/hooks/use-candidate-resumes';
import type { ParseStatus, Resume } from '@/features/resumes/types/resume.type';
import { sortByKey } from '@/lib/utils/sort';
import { formatDate } from '@/lib/utils/format-date';

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

function buildResumeColumns(parseStatus: ParseStatus | ''): DataTableColumn<Resume>[] {
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
            <p className="max-w-[220px] truncate text-sm font-semibold text-on-surface">
              {resume.fileAsset?.fileName || 'Resume record'}
            </p>
            <p className="font-mono text-xs text-on-surface-muted">{resume.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'uploaded',
      header: 'Uploaded',
      sortKey: 'uploadedAt',
      render: (resume) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">
          {formatDate(resume.uploadedAt ?? resume.createdAt)}
        </p>
      ),
    },
    {
      key: 'status',
      header: 'Parse status',
      filter: { key: 'parseStatus', options: PARSE_STATUS_FILTER_OPTIONS, activeValue: parseStatus },
      render: (resume) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PARSE_STATUS_CLASSES[resume.parseStatus]}`}
        >
          {resume.parseStatus}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (resume) => (
        <div className="flex justify-end">
          <ActionIconButton href={`/resumes/${resume.id}`} icon={<EyeIcon className="size-4" />} label="View" />
        </div>
      ),
    },
  ];
}

type CandidateResumeListProps = {
  candidateId: string;
};

export function CandidateResumeList({
  candidateId,
}: CandidateResumeListProps) {
  const { resumes, isLoading, errorMessage, refetchResumes } =
    useCandidateResumes(candidateId);
  const [parseStatus, setParseStatus] = useState<ParseStatus | ''>('');
  const [sort, setSort] = useState<DataTableSort | null>(null);

  const visibleResumes = useMemo(() => {
    let filtered = resumes;
    if (parseStatus) filtered = filtered.filter((resume) => resume.parseStatus === parseStatus);
    return sortByKey(filtered, sort?.key, sort?.order);
  }, [resumes, parseStatus, sort]);

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
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
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
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
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
        <h3 className="text-base font-semibold text-on-surface">
          Linked resumes
        </h3>

        <p className="mt-1 text-sm text-on-surface-muted">
          {resumes.length} resume record
          {resumes.length > 1 ? 's' : ''} linked to this candidate.
        </p>
      </div>

      <DataTable
        data={visibleResumes}
        columns={buildResumeColumns(parseStatus)}
        getRowKey={(resume) => resume.id}
        sort={sort}
        onSortChange={(key, order) => setSort({ key, order })}
        onFilterChange={(key, value) => {
          if (key === 'parseStatus') setParseStatus(value as ParseStatus | '');
        }}
      />
    </div>
  );
}