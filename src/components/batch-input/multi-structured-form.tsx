import { PlusIcon, XIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type MultiStructuredFormProps<T> = {
  entryLabel: string;
  items: T[];
  emptyItem: T;
  maxCount: number;
  onChange: (items: T[]) => void;
  renderForm: (value: T, onChange: (value: T) => void) => ReactNode;
};

export function MultiStructuredForm<T>({
  entryLabel,
  items,
  emptyItem,
  maxCount,
  onChange,
  renderForm,
}: MultiStructuredFormProps<T>) {
  return (
    <div className="mt-4 space-y-5">
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-outline bg-surface-variant/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-on-surface">
              {entryLabel} {index + 1}
            </h4>
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="cursor-pointer rounded-full p-1 text-on-surface-muted transition-colors hover:bg-error-container hover:text-error"
                aria-label={`Remove ${entryLabel.toLowerCase()} ${index + 1}`}
              >
                <XIcon className="size-4" />
              </button>
            ) : null}
          </div>
          {renderForm(item, (updated) =>
            onChange(items.map((current, i) => (i === index ? updated : current))),
          )}
        </div>
      ))}

      {items.length < maxCount ? (
        <button
          type="button"
          onClick={() => onChange([...items, emptyItem])}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-container hover:text-on-primary-container hover:underline"
        >
          <PlusIcon className="size-4" />
          Add another {entryLabel.toLowerCase()}
        </button>
      ) : null}
    </div>
  );
}
