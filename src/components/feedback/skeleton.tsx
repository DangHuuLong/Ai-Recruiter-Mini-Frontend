import { cn } from '@/lib/utils/cn';

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-surface-variant', className)}
      aria-hidden="true"
    />
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
      <Skeleton className="h-11 w-full rounded-xl" />

      <div className="mt-3 space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/3 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded-lg" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}