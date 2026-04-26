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
        'flex min-h-56 flex-col items-center justify-center rounded-card border border-dashed border-border-default bg-white/80 p-8 text-center shadow-card backdrop-blur',
        className,
      )}
    >
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-accent-light shadow-sm">
        <span className="text-2xl font-semibold text-primary">○</span>
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-base font-bold text-text-primary">{title}</h3>

        {description ? (
          <p className="text-sm leading-6 text-text-muted">{description}</p>
        ) : null}
      </div>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
