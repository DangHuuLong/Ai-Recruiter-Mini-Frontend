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
        'flex min-h-56 flex-col items-center justify-center gap-4 rounded-card border border-border-default bg-white/80 p-8 text-center shadow-card backdrop-blur',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative size-10">
        <div className="absolute inset-0 rounded-full border-2 border-primary-light" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-text-primary">{title}</p>

        {description ? (
          <p className="text-sm text-text-muted">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
