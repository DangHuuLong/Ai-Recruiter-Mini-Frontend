'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ConfirmDialog, DataTable, ListControls, type DataTableColumn } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { deleteResume, getResumes } from '@/features/resumes/api/resume.api';
import type { Resume } from '@/features/resumes/types/resume.type';
import type { PaginationMeta } from '@/lib/api/api-types';

const PAGE_SIZE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return 'Not recorded';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
};

function buildColumns(onDelete: (resume: Resume) => void): DataTableColumn<Resume>[] {
  return [
    {
      key: 'resume',
      header: 'Resume',
      render: (resume) => (
        <div>
          <p className="text-sm font-semibold text-slate-950">
            {resume.fileAsset?.fileName || resume.id}
          </p>
          <p className="mt-1 text-xs text-slate-500">ID: {resume.id}</p>
        </div>
      ),
    },
    {
      key: 'candidate',
      header: 'Candidate',
      render: (resume) => <p className="text-sm text-slate-600">{resume.candidateId}</p>,
    },
    {
      key: 'status',
      header: 'Parse Status',
      render: (resume) => <p className="text-sm font-semibold text-slate-700">{resume.parseStatus}</p>,
    },
    {
      key: 'parser',
      header: 'Parser',
      render: (resume) => <p className="text-sm text-slate-600">{resume.parserVersion || 'Not provided'}</p>,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (resume) => <p className="whitespace-nowrap text-sm text-slate-600">{formatDate(resume.updatedAt)}</p>,
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      render: (resume) => (
        <div className="flex flex-wrap justify-end gap-3">
          <Link href={`/resumes/${resume.id}`} className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">View</Link>
          <Link href={`/resumes/${resume.id}/edit`} className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">Edit</Link>
          <button type="button" onClick={() => onDelete(resume)} className="text-sm font-semibold text-red-600 transition hover:text-red-700">Delete</button>
        </div>
      ),
    },
  ];
}

export function ResumeList() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getResumes({ page, limit: PAGE_SIZE, search, sortBy: 'createdAt', sortOrder: 'desc' });
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
  }, [page, search]);

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
        action={<button type="button" onClick={() => void loadResumes()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Resume list</h2>
        <p className="mt-1 text-sm text-slate-500">{meta.total} resume record{meta.total === 1 ? '' : 's'} found.</p>
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
        <DataTable data={resumes} columns={buildColumns(setResumeToDelete)} getRowKey={(resume) => resume.id} />
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
