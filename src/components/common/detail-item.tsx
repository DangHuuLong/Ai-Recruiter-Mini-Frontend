import { getDisplayValue } from '@/lib/utils/display-value.util';

type DetailItemProps = {
  label: string;
  value?: string | null;
};

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-on-surface">{getDisplayValue(value)}</p>
    </div>
  );
}

type DetailLinkItemProps = {
  label: string;
  href?: string | null;
};

export function DetailLinkItem({ label, href }: DetailLinkItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">{label}</p>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block max-w-full cursor-pointer break-words text-sm font-semibold text-primary transition hover:underline"
        >
          {href}
        </a>
      ) : (
        <p className="mt-1 text-sm font-medium text-on-surface">{getDisplayValue(href)}</p>
      )}
    </div>
  );
}
