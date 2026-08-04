import { Link } from '@/i18n/navigation';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type ActionIconButtonVariant = 'default' | 'danger' | 'warning' | 'primary';

const VARIANT_CLASSES: Record<ActionIconButtonVariant, string> = {
  default: 'text-on-surface-muted hover:bg-surface-variant hover:text-on-surface',
  danger: 'text-on-surface-muted hover:bg-error-container hover:text-error',
  warning: 'text-on-surface-muted hover:bg-warning-container hover:text-warning',
  primary: 'text-on-surface-muted hover:bg-primary-container hover:text-primary',
};

type ActionIconButtonProps = {
  icon: ReactNode;
  label: string;
  variant?: ActionIconButtonVariant;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function ActionIconButton({
  icon,
  label,
  variant = 'default',
  href,
  onClick,
  disabled,
  className,
}: ActionIconButtonProps) {
  const buttonClassName = cn(
    'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT_CLASSES[variant],
    className,
  );

  return (
    <span className="group/tooltip relative inline-flex">
      {href ? (
        <Link href={href} aria-label={label} className={buttonClassName}>
          {icon}
        </Link>
      ) : (
        <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className={buttonClassName}>
          {icon}
        </button>
      )}

      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 right-0 z-10 whitespace-nowrap rounded-md bg-on-surface px-2 py-1 text-xs font-semibold text-surface-lowest opacity-0 shadow-panel transition-opacity duration-150 group-hover/tooltip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
