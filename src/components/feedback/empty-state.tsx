import { ReactNode } from 'react';

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
        'flex min-h-40 flex-col items-center justify-center rounded-lg border border-border-default bg-bg-card p-6 text-center',
        className,
      )}
    >
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-bg-muted">
        <span className="text-lg text-text-muted">—</span>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>

        {description ? (
          <p className="text-sm text-text-muted">{description}</p>
        ) : null}
      </div>

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}