'use client';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/config/routes.config';
import {
  MOCK_BATCHES,
  STATUS_CLASSES,
  STATUS_LABELS,
} from '@/features/batch-scoring/mock/batch-scoring-mock-data';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format-date';

export function BatchList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Scoring Batches</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Run AI matching across many candidates and job descriptions at once.
          </p>
        </div>
        <Link
          href={ROUTES.BATCH_SCORING_CREATE}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
        >
          <PlusIcon className="size-4" />
          New batch
        </Link>
      </div>

      {MOCK_BATCHES.length === 0 ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-12 text-center shadow-card">
          <p className="text-sm font-semibold text-on-surface">No batches yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Create your first batch to start scoring candidates against job descriptions.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-surface-variant">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Batch name
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Status
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Progress
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  CVs
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  JDs
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {MOCK_BATCHES.map((batch) => (
                <tr key={batch.id} className="transition-colors hover:bg-surface-variant/60">
                  <td className="px-5 py-4">
                    <Link
                      href={`${ROUTES.BATCH_SCORING}/${batch.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {batch.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        STATUS_CLASSES[batch.status],
                      )}
                    >
                      {STATUS_LABELS[batch.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">
                    {batch.completedPairCount}/{batch.totalPairCount} pairs
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{batch.totalCvCount}</td>
                  <td className="px-5 py-4 text-on-surface-variant">{batch.totalJdCount}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-on-surface-variant">
                    {formatDate(batch.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
