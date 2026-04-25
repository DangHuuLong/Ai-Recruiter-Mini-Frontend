'use client';

import { ReactNode } from 'react';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-modal border border-border-default bg-bg-card p-5 shadow-modal">
        <div className="space-y-2">
          <h2
            id="confirm-dialog-title"
            className="text-lg font-semibold text-text-primary"
          >
            {title}
          </h2>

          {description ? (
            <p className="text-sm text-text-muted">{description}</p>
          ) : null}
        </div>

        {children ? <div className="mt-4">{children}</div> : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="rounded-button border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={cn(
              'rounded-button px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60',
              variant === 'danger' && 'bg-error',
              variant === 'warning' && 'bg-warning text-text-primary',
            )}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}