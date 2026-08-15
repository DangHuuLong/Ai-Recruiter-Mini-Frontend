import { PlusIcon, XIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

type DynamicListSectionProps<T> = {
  title: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderFields: (item: T, index: number) => ReactNode;
  addLabel: string;
};

export function DynamicListSection<T>({
  title,
  items,
  onAdd,
  onRemove,
  renderFields,
  addLabel,
}: DynamicListSectionProps<T>) {
  const t = useTranslations('common.batchInput');

  return (
    <div>
      <h3 className="text-sm font-bold text-on-surface">{title}</h3>

      <div className="mt-3 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="relative rounded-lg border border-outline bg-surface-variant p-4">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute right-3 top-3 cursor-pointer rounded-full p-1 text-on-surface-muted transition-colors hover:bg-error-container hover:text-error"
              aria-label={t('removeEntryGeneric')}
            >
              <XIcon className="size-4" />
            </button>
            <div className="grid gap-3 pr-6 sm:grid-cols-2">{renderFields(item, index)}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-container hover:text-on-primary-container hover:underline"
      >
        <PlusIcon className="size-4" />
        {addLabel}
      </button>
    </div>
  );
}
