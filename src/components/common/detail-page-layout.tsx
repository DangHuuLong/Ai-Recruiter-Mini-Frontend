import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

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
  backLabel,
  actions,
  children,
  className,
}: DetailPageLayoutProps) {
  const t = useTranslations('common');

  return (
    <div className={cn('space-y-6', className)}>
      <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card sm:p-6">
        <div className="space-y-4">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex cursor-pointer items-center text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              ← {backLabel ?? t('back')}
            </Link>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-2xl font-bold text-on-surface">
                {title}
              </h1>

              {description ? (
                <p className="text-sm leading-6 text-on-surface-variant">
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