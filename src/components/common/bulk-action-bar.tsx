import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

type BulkActionBarProps = {
  count: number;
  onClear: () => void;
  children: ReactNode;
};

export function BulkActionBar({ count, onClear, children }: BulkActionBarProps) {
  const t = useTranslations('common.bulkActionBar');

  if (count === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary-container px-4 py-3 shadow-card">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-on-primary-container">
          {t('selected', { count })}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-on-primary-container transition-colors hover:bg-surface-lowest/40"
        >
          <XIcon className="size-3.5" />
          {t('clear')}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
