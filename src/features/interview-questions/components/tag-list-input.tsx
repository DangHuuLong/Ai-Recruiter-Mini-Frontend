'use client';

import { XIcon } from 'lucide-react';
import { useState } from 'react';

type TagListInputProps = {
  label: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export function TagListInput({ label, hint, values, onChange, placeholder }: TagListInputProps) {
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (!values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft('');
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-outline bg-surface-lowest p-2">
        {values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className="inline-flex items-center gap-1 rounded-full bg-primary-container px-2.5 py-1 text-xs font-semibold text-on-primary-container"
          >
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="cursor-pointer rounded-full p-0.5 text-on-primary-container transition-colors hover:bg-error-container hover:text-error"
              aria-label={`Remove ${value}`}
            >
              <XIcon className="size-3" />
            </button>
          </span>
        ))}

        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commitDraft();
            } else if (e.key === 'Backspace' && !draft && values.length > 0) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={commitDraft}
          placeholder={placeholder ?? 'Type and press Enter'}
          className="h-7 min-w-[8rem] flex-1 border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-muted"
        />
      </div>

      {hint ? <p className="mt-1.5 text-xs text-on-surface-muted">{hint}</p> : null}
    </div>
  );
}
