import type { ReactNode } from 'react';

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
        'rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6',
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">
            {title}
          </h2>

          {description ? (
            <p className="text-sm leading-6 text-slate-600">{description}</p>
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