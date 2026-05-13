'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type ListSearchProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

type ListControlsProps = {
  search: ListSearchProps;
  pagination?: PaginationProps;
  children?: ReactNode;
  className?: string;
};

export function ListControls({ search, pagination, children, className }: ListControlsProps) {
  const canGoPrevious = Boolean(pagination && pagination.page > 1);
  const canGoNext = Boolean(pagination && pagination.page < pagination.totalPages);

  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full max-w-md">
          <label htmlFor="list-search" className="sr-only">
            Search
          </label>
          <input
            id="list-search"
            value={search.value}
            onChange={(event) => search.onChange(event.target.value)}
            placeholder={search.placeholder ?? 'Search...'}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
      </div>

      {pagination ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-800">{pagination.page}</span> of{' '}
            <span className="font-semibold text-slate-800">{pagination.totalPages || 1}</span> ·{' '}
            <span className="font-semibold text-slate-800">{pagination.total}</span> total
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
