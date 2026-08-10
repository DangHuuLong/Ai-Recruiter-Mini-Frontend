'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PencilIcon, PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  ActionIconButton,
  DataTable,
  ListControls,
  type DataTableColumn,
  type DataTableSort,
  type DataTableSortOrder,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { createUser, getUsers, updateUser } from '@/features/users/api/user.api';
import { ROLE_LABEL_KEYS, type OrgUserRole, type User, type UserQuery } from '@/features/users/types/user.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { ApiError } from '@/lib/api/api-error';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format-date';

const PAGE_SIZE = 10;

const ORG_USER_ROLES: OrgUserRole[] = ['ADMIN', 'RECRUITER', 'HIRING_MANAGER'];

function getInitials(name: string | null, email: string) {
  const source = name?.trim() || email;
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function buildColumns(
  t: ReturnType<typeof useTranslations<'users.list'>>,
  tCommon: ReturnType<typeof useTranslations<'common'>>,
  role: OrgUserRole | '',
  status: string,
  currentUserId: string | undefined,
  onEdit: (user: User) => void,
): DataTableColumn<User>[] {
  const roleFilterOptions = ORG_USER_ROLES.map((r) => ({
    label: tCommon(`roleLabels.${ROLE_LABEL_KEYS[r]}`),
    value: r,
  }));

  const statusFilterOptions = [
    { label: t('statusActive'), value: 'true' },
    { label: t('statusInactive'), value: 'false' },
  ];

  return [
    {
      key: 'member',
      header: t('columns.member'),
      sortKey: 'fullName',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
            {getInitials(user.fullName, user.email)}
          </div>
          <div>
            <p className="font-semibold text-on-surface">
              {user.fullName ?? user.email}
              {user.id === currentUserId ? (
                <span className="ml-1.5 text-xs font-normal text-on-surface-muted">{t('youSuffix')}</span>
              ) : null}
            </p>
            <p className="text-xs text-on-surface-muted">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: t('columns.role'),
      filter: { key: 'role', options: roleFilterOptions, activeValue: role },
      render: (user) => (
        <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          {tCommon(`roleLabels.${ROLE_LABEL_KEYS[user.role]}`)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('columns.status'),
      filter: { key: 'isActive', options: statusFilterOptions, activeValue: status },
      render: (user) => (
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            user.isActive ? 'bg-success-container text-success' : 'bg-surface-variant text-on-surface-muted',
          )}
        >
          {user.isActive ? t('statusActive') : t('statusInactive')}
        </span>
      ),
    },
    {
      key: 'joined',
      header: t('columns.joined'),
      sortKey: 'createdAt',
      render: (user) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">{formatDate(user.createdAt)}</p>
      ),
    },
    {
      key: 'action',
      header: t('columns.actions'),
      className: 'text-right',
      render: (user) => (
        <div className="flex justify-end">
          <ActionIconButton icon={<PencilIcon className="size-4" />} label={t('actions.edit')} onClick={() => onEdit(user)} />
        </div>
      ),
    },
  ];
}

export function UserList() {
  const t = useTranslations('users.list');
  const tCommon = useTranslations('common');
  const currentUserId = useAuthStore((state) => state.user?.id);

  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<OrgUserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteRole, setInviteRole] = useState<OrgUserRole>('RECRUITER');

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<OrgUserRole>('RECRUITER');
  const [editIsActive, setEditIsActive] = useState(true);
  const [isOnlyActiveAdmin, setIsOnlyActiveAdmin] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getUsers({
        page,
        limit: PAGE_SIZE,
        search,
        role: roleFilter || undefined,
        isActive: statusFilter === '' ? undefined : statusFilter === 'true',
        sortBy: (sort?.key as UserQuery['sortBy']) ?? 'createdAt',
        sortOrder: sort?.order ?? 'desc',
      });
      setUsers(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('errorFallback');
      setErrorMessage(message);
      showToast.error(t('errorFallback'), { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, roleFilter, statusFilter, sort]);

  const handleSortChange = (key: string, order: DataTableSortOrder) => {
    setSort({ key, order });
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'role') {
      setRoleFilter(value as OrgUserRole | '');
      setPage(1);
    }
    if (key === 'isActive') {
      setStatusFilter(value);
      setPage(1);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || invitePassword.length < 8) {
      showToast.error(t('toast.inviteValidation'));
      return;
    }

    try {
      setIsInviting(true);
      await createUser({
        email: inviteEmail.trim(),
        password: invitePassword,
        fullName: inviteName.trim() || undefined,
        role: inviteRole,
      });
      showToast.success(t('toast.inviteSuccess'), { description: inviteEmail });
      setIsInviteOpen(false);
      setInviteName('');
      setInviteEmail('');
      setInvitePassword('');
      setInviteRole('RECRUITER');
      await loadUsers();
    } catch (error) {
      showToast.error(t('toast.inviteFailedTitle'), {
        description: error instanceof ApiError ? error.message : t('toast.inviteFailedFallback'),
      });
    } finally {
      setIsInviting(false);
    }
  };

  const openEdit = async (user: User) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
    setIsOnlyActiveAdmin(false);

    // Mirrors the backend's own check: an ADMIN who is the org's only active admin can't be
    // demoted or deactivated. Only worth checking when the target is currently an active admin.
    if (user.role === 'ADMIN' && user.isActive) {
      try {
        const response = await getUsers({ role: 'ADMIN', isActive: true, limit: 1 });
        setIsOnlyActiveAdmin(response.meta.total <= 1);
      } catch {
        // Non-fatal — the server still enforces this on save even if this check fails.
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      setIsSavingEdit(true);
      await updateUser(editingUser.id, { role: editRole, isActive: editIsActive });
      showToast.success(t('toast.editSuccess'), { description: editingUser.email });
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      showToast.error(t('toast.editFailedTitle'), {
        description: error instanceof ApiError ? error.message : t('toast.editFailedFallback'),
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const isSelf = editingUser?.id === currentUserId;
  const roleLocked = isSelf || isOnlyActiveAdmin;
  const activeLocked = isSelf || isOnlyActiveAdmin;

  if (isLoading && users.length === 0) {
    return <LoadingState title={t('loadingTitle')} description={t('loadingDescription')} />;
  }

  if (errorMessage && users.length === 0) {
    return (
      <EmptyState
        title={t('errorTitle')}
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('tryAgain')}
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{t('subtitle')}</p>
        </div>
        <Button className="w-auto gap-2 px-4" onClick={() => setIsInviteOpen(true)}>
          <PlusIcon className="size-4" />
          {t('inviteMember')}
        </Button>
      </div>

      <ListControls
        search={{
          value: search,
          placeholder: t('searchPlaceholder'),
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
        }}
        pagination={{ ...meta, onPageChange: setPage }}
      />

      {users.length === 0 ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
        />
      ) : (
        <DataTable
          data={users}
          columns={buildColumns(t, tCommon, roleFilter, statusFilter, currentUserId, (user) => void openEdit(user))}
          getRowKey={(user) => user.id}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      )}

      <AnimatePresence>
        {isInviteOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-surface-lowest p-6 shadow-panel"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-on-surface">{t('invitePanel.title')}</h2>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="cursor-pointer rounded-full p-1.5 text-on-surface-muted transition-colors hover:bg-surface-variant hover:text-on-surface"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <Input label={t('invitePanel.fullNameLabel')} value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
                <Input
                  label={t('invitePanel.emailLabel')}
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Input
                  label={t('invitePanel.passwordLabel')}
                  type="password"
                  hint={t('invitePanel.passwordHint')}
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                />
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    {t('invitePanel.roleLabel')}
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as OrgUserRole)}
                    className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                  >
                    {ORG_USER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {tCommon(`roleLabels.${ROLE_LABEL_KEYS[role]}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button className="mt-6" isLoading={isInviting} onClick={() => void handleInvite()}>
                {t('invitePanel.submit')}
              </Button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {editingUser ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-surface-lowest p-6 shadow-panel"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-on-surface">{t('editPanel.title')}</h2>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="cursor-pointer rounded-full p-1.5 text-on-surface-muted transition-colors hover:bg-surface-variant hover:text-on-surface"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              <p className="mt-4 text-sm font-semibold text-on-surface">
                {editingUser.fullName ?? editingUser.email}
              </p>
              <p className="text-xs text-on-surface-muted">{editingUser.email}</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    {t('editPanel.roleLabel')}
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as OrgUserRole)}
                    disabled={roleLocked}
                    className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
                  >
                    {ORG_USER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {tCommon(`roleLabels.${ROLE_LABEL_KEYS[role]}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <label
                  className={cn(
                    'flex items-center gap-2 text-sm text-on-surface',
                    activeLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    disabled={activeLocked}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="size-4 rounded border-outline text-primary disabled:cursor-not-allowed"
                  />
                  {t('editPanel.activeLabel')}
                </label>

                {isSelf ? (
                  <p className="rounded-lg border border-outline bg-surface-variant p-3 text-xs text-on-surface-variant">
                    {t('editPanel.selfNote')}
                  </p>
                ) : isOnlyActiveAdmin ? (
                  <p className="rounded-lg border border-warning bg-warning-container p-3 text-xs text-on-surface">
                    {t('editPanel.lastAdminNote')}
                  </p>
                ) : null}
              </div>

              <Button className="mt-6" isLoading={isSavingEdit} onClick={() => void handleSaveEdit()}>
                {t('editPanel.submit')}
              </Button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
