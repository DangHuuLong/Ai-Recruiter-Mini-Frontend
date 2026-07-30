'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type ConfirmDialogVariant = 'danger' | 'warning';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-outline bg-surface-lowest p-6 shadow-panel">
        <div className="space-y-2">
          <h2
            id="confirm-dialog-title"
            className="text-xl font-semibold tracking-tight text-on-surface"
          >
            {title}
          </h2>

          {description ? (
            <p className="text-sm leading-6 text-on-surface-variant">{description}</p>
          ) : null}
        </div>

        {children ? <div className="mt-4">{children}</div> : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline bg-surface-lowest px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={cn(
              'inline-flex h-10 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60',
              variant === 'danger' && 'bg-error hover:bg-error/90',
              variant === 'warning' && 'bg-warning hover:bg-warning/90',
            )}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}