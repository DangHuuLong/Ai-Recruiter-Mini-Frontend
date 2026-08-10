'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

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
  search?: ListSearchProps;
  pagination?: PaginationProps;
  children?: ReactNode;
  className?: string;
};

export function ListControls({ search, pagination, children, className }: ListControlsProps) {
  const t = useTranslations('common.listControls');
  const canGoPrevious = Boolean(pagination && pagination.page > 1);
  const canGoNext = Boolean(pagination && pagination.page < pagination.totalPages);

  return (
    <div className={cn('rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {search ? (
          <div className="w-full max-w-md">
            <label htmlFor="list-search" className="sr-only">
              {t('searchLabel')}
            </label>
            <input
              id="list-search"
              value={search.value}
              onChange={(event) => search.onChange(event.target.value)}
              placeholder={search.placeholder ?? t('searchPlaceholder')}
              className="h-10 w-full rounded-xl border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            />
          </div>
        ) : null}

        {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
      </div>

      {pagination ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-outline pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-surface-muted">
            {t.rich('pageInfo', {
              page: pagination.page,
              totalPages: pagination.totalPages || 1,
              total: pagination.total,
              b: (chunks) => <span className="font-semibold text-on-surface">{chunks}</span>,
            })}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-outline bg-surface-lowest px-3 text-sm font-semibold text-on-surface transition hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('previous')}
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-outline bg-surface-lowest px-3 text-sm font-semibold text-on-surface transition hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('next')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
