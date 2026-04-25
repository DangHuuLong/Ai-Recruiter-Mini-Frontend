import { ReactNode } from 'react';
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
      <div className="space-y-4">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex text-sm font-medium text-text-muted hover:text-text-primary"
          >
            ← {backLabel}
          </Link>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              {title}
            </h1>

            {description ? (
              <p className="text-sm text-text-muted">{description}</p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}