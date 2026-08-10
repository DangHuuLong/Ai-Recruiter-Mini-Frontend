import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils/cn';

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const t = useTranslations('common.emptyState');
  const resolvedTitle = title ?? t('title');
  const resolvedDescription = description ?? t('description');

  return (
    <div
      className={cn(
        'flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-outline bg-surface-lowest p-8 text-center shadow-card',
        className,
      )}
    >
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-container ring-1 ring-outline">
        {icon ?? <span className="text-2xl font-semibold text-on-primary-container">○</span>}
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-base font-semibold text-on-surface">{resolvedTitle}</h3>

        {resolvedDescription ? (
          <p className="text-sm leading-6 text-on-surface-variant">{resolvedDescription}</p>
        ) : null}
      </div>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}