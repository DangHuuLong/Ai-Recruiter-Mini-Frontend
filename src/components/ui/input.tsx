import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, trailing, id, ...props }, ref) => {
    return (
      <div>
        {label ? (
          <label
            htmlFor={id}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-muted">
              {icon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={id}
            className={cn(
              'h-11 w-full rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled',
              icon ? 'pl-10' : undefined,
              trailing ? 'pr-10' : undefined,
              error ? 'border-error focus:border-error focus:ring-error/20' : undefined,
              className,
            )}
            {...props}
          />

          {trailing ? (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">{trailing}</span>
          ) : null}
        </div>

        {error ? (
          <p className="mt-1.5 text-xs font-medium text-error">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-on-surface-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
