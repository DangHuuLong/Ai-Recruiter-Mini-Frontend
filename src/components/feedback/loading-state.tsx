import { cn } from '@/lib/utils/cn';

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = 'Loading...',
  description,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-border-default bg-bg-card p-6 text-center',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border-default border-t-primary" />

      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>

        {description ? (
          <p className="text-sm text-text-muted">{description}</p>
        ) : null}
      </div>
    </div>
  );
}