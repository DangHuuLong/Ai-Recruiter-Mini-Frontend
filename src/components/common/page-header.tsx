import { Link } from '@/i18n/navigation';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function PageHeader({ title, description, actions, backHref, backLabel = 'Back' }: PageHeaderProps) {
  return (
    <div className="space-y-3">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex cursor-pointer text-sm font-semibold text-primary transition hover:underline"
        >
          ← {backLabel}
        </Link>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{title}</h1>

          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-on-surface-variant">{description}</p>
          ) : null}
        </div>

        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
