'use client';

import { PencilIcon, PlusIcon, StarIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  ActionIconButton,
  BulkActionBar,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from '@/components/common';
import { showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import {
  MOCK_EVALUATION_CONFIGS,
  type MockEvaluationConfig,
} from '@/features/evaluation-configs/mock/evaluation-config-mock-data';
import { sortMock } from '@/lib/utils/mock-delay';
import { formatDate } from '@/lib/utils/format-date';

const DEFAULT_FILTER_OPTIONS = [
  { label: 'Default', value: 'true' },
  { label: 'Not default', value: 'false' },
];

function buildColumns(
  isDefaultFilter: string,
  onDelete: (config: MockEvaluationConfig) => void,
): DataTableColumn<MockEvaluationConfig>[] {
  return [
    {
      key: 'name',
      header: 'Config name',
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
      header: 'Scope',
      render: (config) => (
        <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          {config.jobDescriptionTitle ?? 'Organization default'}
        </span>
      ),
    },
    {
      key: 'isDefault',
      header: 'Default',
      filter: { key: 'isDefault', options: DEFAULT_FILTER_OPTIONS, activeValue: isDefaultFilter },
      render: (config) =>
        config.isDefault ? (
          <StarIcon className="size-4 fill-warning text-warning" />
        ) : (
          <span className="text-on-surface-muted">—</span>
        ),
    },
    {
      key: 'updatedAt',
      header: 'Last updated',
      sortKey: 'updatedAt',
      render: (config) => (
        <p className="whitespace-nowrap text-on-surface-variant">{formatDate(config.updatedAt)}</p>
      ),
    },
    {
      key: 'action',
      header: 'Actions',
      className: 'text-right',
      render: (config) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <ActionIconButton
            href={`${ROUTES.EVALUATION_CONFIGS}/${config.id}/edit`}
            icon={<PencilIcon className="size-4" />}
            label="Edit"
          />
          <ActionIconButton
            icon={<Trash2Icon className="size-4" />}
            label="Delete"
            variant="danger"
            onClick={() => onDelete(config)}
          />
        </div>
      ),
    },
  ];
}

export function EvaluationConfigList() {
  const [configs, setConfigs] = useState<MockEvaluationConfig[]>(MOCK_EVALUATION_CONFIGS);
  const [isDefaultFilter, setIsDefaultFilter] = useState('');
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [configToDelete, setConfigToDelete] = useState<MockEvaluationConfig | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'isDefault') setIsDefaultFilter(value);
  };

  const visibleConfigs = useMemo(() => {
    let filtered = configs;
    if (isDefaultFilter) {
      filtered = filtered.filter((config) => String(config.isDefault) === isDefaultFilter);
    }
    return sortMock(filtered, sort?.key, sort?.order);
  }, [configs, isDefaultFilter, sort]);

  const handleDelete = () => {
    if (!configToDelete) return;
    setConfigs((current) => current.filter((config) => config.id !== configToDelete.id));
    showToast.success('Config deleted', { description: configToDelete.name });
    setConfigToDelete(null);
  };

  const handleBulkDelete = () => {
    const count = selectedIds.size;
    setConfigs((current) => current.filter((config) => !selectedIds.has(config.id)));
    showToast.success(`${count} config${count === 1 ? '' : 's'} deleted successfully`);
    setSelectedIds(new Set());
    setIsBulkConfirmOpen(false);
  };

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

      <BulkActionBar count={selectedIds.size} onClear={() => setSelectedIds(new Set())}>
        <button
          type="button"
          onClick={() => setIsBulkConfirmOpen(true)}
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl bg-error px-4 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          <Trash2Icon className="size-4" />
          Delete selected
        </button>
      </BulkActionBar>

      <DataTable
        data={visibleConfigs}
        columns={buildColumns(isDefaultFilter, setConfigToDelete)}
        getRowKey={(config) => config.id}
        sort={sort}
        onSortChange={(key, order) => setSort({ key, order })}
        onFilterChange={handleFilterChange}
        selection={{ selectedIds, onChange: setSelectedIds }}
      />

      <ConfirmDialog
        open={Boolean(configToDelete)}
        title="Delete config?"
        description="This action removes the evaluation config. Existing evaluations that used it keep their recorded scores."
        confirmLabel="Delete config"
        onCancel={() => setConfigToDelete(null)}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={isBulkConfirmOpen}
        title={`Delete ${selectedIds.size} config${selectedIds.size === 1 ? '' : 's'}?`}
        description="This action removes the selected evaluation configs. Existing evaluations that used them keep their recorded scores."
        confirmLabel="Delete selected"
        onCancel={() => setIsBulkConfirmOpen(false)}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
