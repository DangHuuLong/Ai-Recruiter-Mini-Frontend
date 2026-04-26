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
        'rounded-card border border-border-default bg-bg-card p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-elevated sm:p-6',
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-3 border-b border-divider pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-text-primary">
            {title}
          </h2>

          {description ? (
            <p className="text-sm leading-6 text-text-muted">{description}</p>
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
