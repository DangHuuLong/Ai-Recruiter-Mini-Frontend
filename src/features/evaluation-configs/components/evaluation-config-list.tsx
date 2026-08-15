'use client';

import { PencilIcon, PlusIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  ActionIconButton,
  BulkActionBar,
  ConfirmDialog,
  DataTable,
  ListControls,
  type DataTableColumn,
  type DataTableSort,
  type DataTableSortOrder,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import {
  bulkDeleteEvaluationConfigs,
  deleteEvaluationConfig,
  getEvaluationConfigs,
} from '@/features/evaluation-configs/api/evaluation-config.api';
import type { EvaluationConfig, EvaluationConfigQuery } from '@/features/evaluation-configs/types/evaluation-config.type';
import { getJobDescriptions } from '@/features/job-descriptions/api/job-description.api';
import type { PaginationMeta } from '@/lib/api/api-types';
import { formatDate } from '@/lib/utils/format-date';

const PAGE_SIZE = 10;

function buildColumns(
  t: ReturnType<typeof useTranslations<'evaluationConfigs'>>,
  jobDescriptionTitles: Record<string, string>,
  onDelete: (config: EvaluationConfig) => void,
): DataTableColumn<EvaluationConfig>[] {
  return [
    {
      key: 'name',
      header: t('list.columns.name'),
      sortKey: 'name',
      render: (config) => (
        <div>
          <p className="font-semibold text-on-surface">{config.name}</p>
          {config.description ? (
            <p className="mt-0.5 max-w-sm truncate text-xs text-on-surface-muted">{config.description}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'scope',
      header: t('list.columns.scope'),
      render: (config) => (
        <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          {config.jobDescriptionId
            ? (jobDescriptionTitles[config.jobDescriptionId] ?? t('list.scopeJobDescriptionFallback'))
            : t('list.scopeOrganizationDefault')}
        </span>
      ),
    },
    {
      key: 'isDefault',
      header: t('list.columns.default'),
      render: (config) =>
        config.isDefault ? (
          <StarIcon className="size-4 fill-warning text-warning" />
        ) : (
          <span className="text-on-surface-muted">—</span>
        ),
    },
    {
      key: 'updatedAt',
      header: t('list.columns.lastUpdated'),
      sortKey: 'updatedAt',
      render: (config) => (
        <p className="whitespace-nowrap text-on-surface-variant">{formatDate(config.updatedAt)}</p>
      ),
    },
    {
      key: 'action',
      header: t('list.columns.actions'),
      className: 'text-right',
      render: (config) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <ActionIconButton
            href={`${ROUTES.EVALUATION_CONFIGS}/${config.id}/edit`}
            icon={<PencilIcon className="size-4" />}
            label={t('list.actions.edit')}
          />
          <ActionIconButton
            icon={<Trash2Icon className="size-4" />}
            label={t('list.actions.delete')}
            variant="danger"
            onClick={() => onDelete(config)}
          />
        </div>
      ),
    },
  ];
}

export function EvaluationConfigList() {
  const t = useTranslations('evaluationConfigs');
  const [configs, setConfigs] = useState<EvaluationConfig[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jobDescriptionTitles, setJobDescriptionTitles] = useState<Record<string, string>>({});

  const [configToDelete, setConfigToDelete] = useState<EvaluationConfig | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const loadConfigs = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getEvaluationConfigs({
        page,
        limit: PAGE_SIZE,
        sortBy: (sort?.key as EvaluationConfigQuery['sortBy']) ?? 'createdAt',
        sortOrder: sort?.order ?? 'desc',
      });
      setConfigs(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('list.errorFallback');
      setErrorMessage(message);
      showToast.error(t('list.errorFallback'), { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  useEffect(() => {
    getJobDescriptions({ limit: 100 })
      .then((response) => {
        const titles: Record<string, string> = {};
        for (const jd of response.data) titles[jd.id] = jd.title;
        setJobDescriptionTitles(titles);
      })
      .catch(() => setJobDescriptionTitles({}));
  }, []);

  const handleSortChange = (key: string, order: DataTableSortOrder) => {
    setSort({ key, order });
    setPage(1);
  };

  const handleDelete = async () => {
    if (!configToDelete) return;

    try {
      setIsDeleting(true);
      await deleteEvaluationConfig(configToDelete.id);
      showToast.success(t('list.deleteSuccessTitle'), { description: configToDelete.name });
      setConfigToDelete(null);
      await loadConfigs();
    } catch (error) {
      showToast.error(t('list.deleteFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.deleteFailedFallback'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsBulkDeleting(true);
      const results = await bulkDeleteEvaluationConfigs(Array.from(selectedIds));
      const succeeded = results.filter((result) => result.success).length;
      const failed = results.length - succeeded;
      if (failed === 0) {
        showToast.success(t('list.bulkDeleteSuccess', { count: succeeded }));
      } else {
        showToast.warning(t('list.bulkDeletePartial', { succeeded, failed }), {
          description: results.find((result) => !result.success)?.error,
        });
      }
      setSelectedIds(new Set());
      setIsBulkConfirmOpen(false);
      await loadConfigs();
    } catch (error) {
      showToast.error(t('list.bulkDeleteFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.bulkDeleteFailedFallback'),
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  if (isLoading && configs.length === 0) {
    return <LoadingState title={t('list.loadingTitle')} description={t('list.loadingDescription')} />;
  }

  if (errorMessage && configs.length === 0) {
    return (
      <EmptyState
        title={t('list.errorTitle')}
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadConfigs()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('list.tryAgain')}
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('list.title')}</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{t('list.subtitle')}</p>
        </div>
        <Link
          href={ROUTES.EVALUATION_CONFIG_CREATE}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
        >
          <PlusIcon className="size-4" />
          {t('list.newConfig')}
        </Link>
      </div>

      <ListControls pagination={{ ...meta, onPageChange: setPage }} />

      <BulkActionBar count={selectedIds.size} onClear={() => setSelectedIds(new Set())}>
        <button
          type="button"
          onClick={() => setIsBulkConfirmOpen(true)}
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl bg-error px-4 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          <Trash2Icon className="size-4" />
          {t('list.deleteSelected')}
        </button>
      </BulkActionBar>

      {configs.length === 0 ? (
        <EmptyState
          title={t('list.emptyTitle')}
          description={t('list.emptyDescription')}
        />
      ) : (
        <DataTable
          data={configs}
          columns={buildColumns(t, jobDescriptionTitles, setConfigToDelete)}
          getRowKey={(config) => config.id}
          sort={sort}
          onSortChange={handleSortChange}
          selection={{ selectedIds, onChange: setSelectedIds }}
        />
      )}

      <ConfirmDialog
        open={Boolean(configToDelete)}
        title={t('list.deleteConfirmTitle')}
        description={t('list.deleteConfirmDescription')}
        confirmLabel={t('list.deleteConfirmAction')}
        isLoading={isDeleting}
        onCancel={() => setConfigToDelete(null)}
        onConfirm={() => void handleDelete()}
      />

      <ConfirmDialog
        open={isBulkConfirmOpen}
        title={t('list.bulkDeleteConfirmTitle', { count: selectedIds.size })}
        description={t('list.bulkDeleteConfirmDescription')}
        confirmLabel={t('list.bulkDeleteConfirmAction')}
        isLoading={isBulkDeleting}
        onCancel={() => setIsBulkConfirmOpen(false)}
        onConfirm={() => void handleBulkDelete()}
      />
    </div>
  );
}
