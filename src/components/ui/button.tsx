import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-hover disabled:bg-disabled',
  secondary:
    'border border-outline bg-surface-lowest text-on-surface hover:bg-surface-variant disabled:text-disabled',
  ghost: 'text-on-surface-variant hover:bg-surface-variant disabled:text-disabled',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed',
          VARIANT_CLASSES[variant],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
