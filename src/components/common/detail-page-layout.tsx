import type { ReactNode } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

type DetailPageLayoutProps = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DetailPageLayout({
  title,
  description,
  backHref,
  backLabel = 'Back',
  actions,
  children,
  className,
}: DetailPageLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="space-y-4">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              ← {backLabel}
            </Link>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>

              {description ? (
                <p className="text-sm leading-6 text-slate-600">
                  {description}
                </p>
              ) : null}
            </div>

            {actions ? (
              <div className="flex flex-wrap items-center gap-2">{actions}</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-5">{children}</div>
    </div>
  );
}