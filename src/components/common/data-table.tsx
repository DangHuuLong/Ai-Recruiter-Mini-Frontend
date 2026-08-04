'use client';

import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { EmptyState } from '@/components/feedback';
import { cn } from '@/lib/utils/cn';

export type DataTableSortOrder = 'asc' | 'desc';

export type DataTableFilterOption = {
  label: string;
  value: string;
};

export type DataTableColumnFilter = {
  /** Query param name this filter maps to, e.g. "status" or "parseStatus". */
  key: string;
  options: DataTableFilterOption[];
  /** Currently selected value, or '' for "All". */
  activeValue: string;
};

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => ReactNode;
  /** Query param name this column sorts by. Presence enables the sort menu. */
  sortKey?: string;
  /** Presence enables the "filter by value" section of the column menu. */
  filter?: DataTableColumnFilter;
};

export type DataTableSort = {
  key: string;
  order: DataTableSortOrder;
};

export type DataTableSelection = {
  selectedIds: Set<string>;
  onChange: (selectedIds: Set<string>) => void;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
  className?: string;
  sort?: DataTableSort | null;
  onSortChange?: (key: string, order: DataTableSortOrder) => void;
  onFilterChange?: (key: string, value: string) => void;
  /** Enables a checkbox column for selecting rows (e.g. for bulk actions). */
  selection?: DataTableSelection;
};

function SelectAllCheckbox({ checked, indeterminate, onChange }: { checked: boolean; indeterminate: boolean; onChange: () => void }) {
  const t = useTranslations('common.dataTable');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={t('selectAllRows')}
      className="size-4 cursor-pointer rounded border-outline text-primary focus:ring-2 focus:ring-focus-ring/50"
    />
  );
}

function ColumnHeaderMenu<T>({
  column,
  sort,
  onSortChange,
  onFilterChange,
}: {
  column: DataTableColumn<T>;
  sort?: DataTableSort | null;
  onSortChange?: (key: string, order: DataTableSortOrder) => void;
  onFilterChange?: (key: string, value: string) => void;
}) {
  const t = useTranslations('common.dataTable');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isActiveSort = (order: DataTableSortOrder) =>
    Boolean(column.sortKey) && sort?.key === column.sortKey && sort?.order === order;

  const isActive = Boolean(
    (column.sortKey && sort?.key === column.sortKey) ||
      (column.filter && column.filter.activeValue),
  );

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          'inline-flex cursor-pointer items-center gap-1 rounded-md px-1 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-surface-lowest',
          isActive ? 'text-primary' : 'text-on-surface-variant',
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {column.header}
        <ChevronDownIcon className="size-3.5" />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-xl border border-outline bg-surface-lowest py-1.5 normal-case shadow-panel">
          {column.sortKey ? (
            <div className="px-1.5 pb-1.5">
              <button
                type="button"
                onClick={() => {
                  onSortChange?.(column.sortKey!, 'asc');
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-surface-variant',
                  isActiveSort('asc') ? 'text-primary' : 'text-on-surface',
                )}
              >
                <ArrowUpIcon className="size-3.5" />
                {t('sortAscending')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSortChange?.(column.sortKey!, 'desc');
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-surface-variant',
                  isActiveSort('desc') ? 'text-primary' : 'text-on-surface',
                )}
              >
                <ArrowDownIcon className="size-3.5" />
                {t('sortDescending')}
              </button>
            </div>
          ) : null}

          {column.filter
            ? (() => {
                const filter = column.filter!;
                return (
                  <div className={cn('px-1.5 pt-1.5', column.sortKey && 'border-t border-outline')}>
                    <p className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wide text-on-surface-muted">
                      {t('filterLabel')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onFilterChange?.(filter.key, '');
                        setIsOpen(false);
                      }}
                      className={cn(
                        'flex w-full cursor-pointer items-center rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-surface-variant',
                        filter.activeValue === '' ? 'text-primary' : 'text-on-surface',
                      )}
                    >
                      {t('filterAll')}
                    </button>
                    {filter.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onFilterChange?.(filter.key, option.value);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'flex w-full cursor-pointer items-center rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-surface-variant',
                          filter.activeValue === option.value ? 'text-primary' : 'text-on-surface',
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                );
              })()
            : null}
        </div>
      ) : null}
    </div>
  );
}

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  emptyMessage,
  className,
  sort,
  onSortChange,
  onFilterChange,
  selection,
}: DataTableProps<T>) {
  const t = useTranslations('common.dataTable');

  if (data.length === 0) {
    return <EmptyState title={emptyMessage ?? t('noData')} />;
  }

  const rowIds = selection ? data.map(getRowKey) : [];
  const selectedOnPage = rowIds.filter((id) => selection!.selectedIds.has(id));
  const allSelected = selection ? rowIds.length > 0 && selectedOnPage.length === rowIds.length : false;
  const someSelected = selection ? selectedOnPage.length > 0 && !allSelected : false;

  const toggleAll = () => {
    if (!selection) return;
    const next = new Set(selection.selectedIds);
    if (allSelected) {
      rowIds.forEach((id) => next.delete(id));
    } else {
      rowIds.forEach((id) => next.add(id));
    }
    selection.onChange(next);
  };

  const toggleRow = (id: string) => {
    if (!selection) return;
    const next = new Set(selection.selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    selection.onChange(next);
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-variant">
            <tr>
              {selection ? (
                <th scope="col" className="w-10 px-5 py-3.5">
                  <SelectAllCheckbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
                </th>
              ) : null}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant',
                    column.className,
                  )}
                >
                  {column.sortKey || column.filter ? (
                    <ColumnHeaderMenu
                      column={column}
                      sort={sort}
                      onSortChange={onSortChange}
                      onFilterChange={onFilterChange}
                    />
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-outline">
            {data.map((item) => {
              const rowId = getRowKey(item);
              const isSelected = Boolean(selection?.selectedIds.has(rowId));

              return (
                <tr
                  key={rowId}
                  className={cn('transition-colors hover:bg-surface-variant/60', isSelected && 'bg-primary-container/30')}
                >
                  {selection ? (
                    <td className="px-5 py-4 align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(rowId)}
                        aria-label={t('selectRow')}
                        className="size-4 cursor-pointer rounded border-outline text-primary focus:ring-2 focus:ring-focus-ring/50"
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-5 py-4 align-middle text-on-surface',
                        column.className,
                      )}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
