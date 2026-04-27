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
        'flex min-h-56 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative size-10">
        <div className="absolute inset-0 rounded-full border-2 border-blue-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-blue-600" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-950">{title}</p>

        {description ? (
          <p className="text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
}