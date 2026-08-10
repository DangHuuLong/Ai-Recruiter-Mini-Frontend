'use client';

import { FileTextIcon, PlusIcon, UploadIcon, XIcon } from 'lucide-react';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils/cn';

export type InputMode = 'upload' | 'paste' | 'structured';

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-lg px-3.5 py-2 text-sm font-semibold transition',
        active
          ? 'bg-primary-container text-on-primary-container'
          : 'text-on-surface-variant hover:bg-surface-variant',
      )}
    >
      {children}
    </button>
  );
}

type BatchInputTabsProps = {
  title: string;
  maxCount: number;
  count: number;
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  texts: string[];
  onTextsChange: (texts: string[]) => void;
  pastePlaceholder: string;
  structuredForm: ReactNode;
};

export function BatchInputTabs({
  title,
  maxCount,
  count,
  mode,
  onModeChange,
  files,
  onFilesChange,
  texts,
  onTextsChange,
  pastePlaceholder,
  structuredForm,
}: BatchInputTabsProps) {
  const t = useTranslations('common.batchInput');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    onFilesChange([...files, ...selected].slice(0, maxCount));
    event.target.value = '';
  };

  return (
    <section className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-on-surface">{title}</h2>
        <span className="text-xs font-semibold text-on-surface-muted">
          {count} / {maxCount}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <TabButton active={mode === 'upload'} onClick={() => onModeChange('upload')}>
          {t('uploadFiles')}
        </TabButton>
        <TabButton active={mode === 'paste'} onClick={() => onModeChange('paste')}>
          {t('pasteText')}
        </TabButton>
        <TabButton active={mode === 'structured'} onClick={() => onModeChange('structured')}>
          {t('structuredForm')}
        </TabButton>
      </div>

      {mode === 'upload' ? (
        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFilesSelected}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= maxCount}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline py-8 text-on-surface-variant transition-colors hover:border-primary hover:bg-primary-container/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UploadIcon className="size-6" />
            <span className="text-sm font-semibold">{t('clickToUpload')}</span>
          </button>

          {files.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-outline bg-surface-variant px-3 py-2 text-sm text-on-surface"
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileTextIcon className="size-4 shrink-0 text-on-surface-muted" />
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => onFilesChange(files.filter((_, i) => i !== index))}
                    className="cursor-pointer rounded-full p-1 text-on-surface-muted transition-colors hover:bg-error-container hover:text-error"
                  >
                    <XIcon className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {mode === 'paste' ? (
        <div className="mt-4 space-y-3">
          {texts.map((text, index) => (
            <div key={index} className="relative">
              <textarea
                value={text}
                onChange={(event) =>
                  onTextsChange(texts.map((t, i) => (i === index ? event.target.value : t)))
                }
                rows={4}
                placeholder={pastePlaceholder}
                className="w-full rounded-lg border border-outline bg-surface-lowest p-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
              />
              {texts.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onTextsChange(texts.filter((_, i) => i !== index))}
                  className="absolute right-2 top-2 cursor-pointer rounded-full p-1 text-on-surface-muted transition-colors hover:bg-error-container hover:text-error"
                >
                  <XIcon className="size-4" />
                </button>
              ) : null}
            </div>
          ))}
          {texts.length < maxCount ? (
            <button
              type="button"
              onClick={() => onTextsChange([...texts, ''])}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-container hover:text-on-primary-container hover:underline"
            >
              <PlusIcon className="size-4" />
              {t('addAnother')}
            </button>
          ) : null}
        </div>
      ) : null}

      {mode === 'structured' ? structuredForm : null}
    </section>
  );
}
