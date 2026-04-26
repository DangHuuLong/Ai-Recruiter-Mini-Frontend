import { ReactNode } from 'react';

import { EmptyState } from '@/components/feedback';
import { cn } from '@/lib/utils/cn';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
  className?: string;
};

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  emptyMessage = 'No data available.',
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-card border border-border-default bg-bg-card shadow-card',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-divider">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.08em] text-text-muted',
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-divider bg-white">
            {data.map((item) => (
              <tr
                key={getRowKey(item)}
                className="transition-colors hover:bg-primary-soft"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-5 py-4 align-middle text-text-primary',
                      column.className,
                    )}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
