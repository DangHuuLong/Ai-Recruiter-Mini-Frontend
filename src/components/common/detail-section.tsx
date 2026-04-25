import { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type DetailSectionProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DetailSection({
  title,
  description,
  actions,
  children,
  className,
}: DetailSectionProps) {
  return (
    <section
      className={cn(
        'rounded-lg border border-border-default bg-bg-card p-4',
        className,
      )}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-text-primary">
            {title}
          </h2>

          {description ? (
            <p className="text-sm text-text-muted">{description}</p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {children}
    </section>
  );
}