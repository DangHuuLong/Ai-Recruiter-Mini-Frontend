'use client';

import { PlusIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';

import { showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import { MOCK_EVALUATION_CONFIGS } from '@/features/evaluation-configs/mock/evaluation-config-mock-data';
import { formatDate } from '@/lib/utils/format-date';

export function EvaluationConfigList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Evaluation Configs</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Custom scoring criteria weights for job descriptions or the whole organization.
          </p>
        </div>
        <Link
          href={ROUTES.EVALUATION_CONFIG_CREATE}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
        >
          <PlusIcon className="size-4" />
          New config
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-variant">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Config name
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Scope
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Default
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Last updated
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline">
            {MOCK_EVALUATION_CONFIGS.map((config) => (
              <tr key={config.id} className="transition-colors hover:bg-surface-variant/60">
                <td className="px-5 py-4">
                  <p className="font-semibold text-on-surface">{config.name}</p>
                  {config.description ? (
                    <p className="mt-0.5 max-w-sm truncate text-xs text-on-surface-muted">
                      {config.description}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
                    {config.jobDescriptionTitle ?? 'Organization default'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {config.isDefault ? (
                    <StarIcon className="size-4 fill-warning text-warning" />
                  ) : (
                    <span className="text-on-surface-muted">—</span>
                  )}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-on-surface-variant">
                  {formatDate(config.updatedAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`${ROUTES.EVALUATION_CONFIGS}/${config.id}/edit`}
                      className="cursor-pointer text-sm font-semibold text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => showToast.success('Config deleted', { description: config.name })}
                      className="cursor-pointer text-sm font-semibold text-error hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
