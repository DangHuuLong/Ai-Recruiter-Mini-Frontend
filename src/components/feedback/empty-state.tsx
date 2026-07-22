import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-outline bg-surface-lowest p-8 text-center shadow-card',
        className,
      )}
    >
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-container ring-1 ring-outline">
        <span className="text-2xl font-semibold text-on-primary-container">○</span>
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-base font-semibold text-on-surface">{title}</h3>

        {description ? (
          <p className="text-sm leading-6 text-on-surface-variant">{description}</p>
        ) : null}
      </div>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}