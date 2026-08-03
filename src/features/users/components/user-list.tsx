'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PencilIcon, PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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
import { ROLE_LABELS, type OrgUserRole, type User, type UserQuery } from '@/features/users/types/user.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { ApiError } from '@/lib/api/api-error';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format-date';

const PAGE_SIZE = 10;

const ROLE_FILTER_OPTIONS = (Object.keys(ROLE_LABELS) as OrgUserRole[]).map((role) => ({
  label: ROLE_LABELS[role],
  value: role,
}));

const STATUS_FILTER_OPTIONS = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];

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
  role: OrgUserRole | '',
  status: string,
  currentUserId: string | undefined,
  onEdit: (user: User) => void,
): DataTableColumn<User>[] {
  return [
    {
      key: 'member',
      header: 'Member',
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
                <span className="ml-1.5 text-xs font-normal text-on-surface-muted">(You)</span>
              ) : null}
            </p>
            <p className="text-xs text-on-surface-muted">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      filter: { key: 'role', options: ROLE_FILTER_OPTIONS, activeValue: role },
      render: (user) => (
        <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          {ROLE_LABELS[user.role] ?? user.role}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      filter: { key: 'isActive', options: STATUS_FILTER_OPTIONS, activeValue: status },
      render: (user) => (
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            user.isActive ? 'bg-success-container text-success' : 'bg-surface-variant text-on-surface-muted',
          )}
        >
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'joined',
      header: 'Joined',
      sortKey: 'createdAt',
      render: (user) => (
        <p className="whitespace-nowrap text-sm text-on-surface-variant">{formatDate(user.createdAt)}</p>
      ),
    },
    {
      key: 'action',
      header: 'Actions',
      className: 'text-right',
      render: (user) => (
        <div className="flex justify-end">
          <ActionIconButton icon={<PencilIcon className="size-4" />} label="Edit" onClick={() => onEdit(user)} />
        </div>
      ),
    },
  ];
}

export function UserList() {
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
      const message = error instanceof Error ? error.message : 'Failed to load team members';
      setErrorMessage(message);
      showToast.error('Failed to load team members', { description: message });
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
      showToast.error('Email and a password of at least 8 characters are required');
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
      showToast.success('Invitation sent', { description: inviteEmail });
      setIsInviteOpen(false);
      setInviteName('');
      setInviteEmail('');
      setInvitePassword('');
      setInviteRole('RECRUITER');
      await loadUsers();
    } catch (error) {
      showToast.error('Failed to invite member', {
        description: error instanceof ApiError ? error.message : 'Something went wrong while sending the invitation.',
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
      showToast.success('Member updated', { description: editingUser.email });
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      showToast.error('Failed to update member', {
        description: error instanceof ApiError ? error.message : 'Something went wrong while saving changes.',
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const isSelf = editingUser?.id === currentUserId;
  const roleLocked = isSelf || isOnlyActiveAdmin;
  const activeLocked = isSelf || isOnlyActiveAdmin;

  if (isLoading && users.length === 0) {
    return <LoadingState title="Loading team members..." description="Please wait while your team is being loaded." />;
  }

  if (errorMessage && users.length === 0) {
    return (
      <EmptyState
        title="Failed to load team members"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Team members</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Manage who has access to your organization&apos;s workspace.
          </p>
        </div>
        <Button className="w-auto gap-2 px-4" onClick={() => setIsInviteOpen(true)}>
          <PlusIcon className="size-4" />
          Invite member
        </Button>
      </div>

      <ListControls
        search={{
          value: search,
          placeholder: 'Search by name or email...',
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
        }}
        pagination={{ ...meta, onPageChange: setPage }}
      />

      {users.length === 0 ? (
        <EmptyState
          title="No team members found"
          description="Invite the first member or adjust your search/filter."
        />
      ) : (
        <DataTable
          data={users}
          columns={buildColumns(roleFilter, statusFilter, currentUserId, (user) => void openEdit(user))}
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
                <h2 className="text-lg font-bold text-on-surface">Invite member</h2>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="cursor-pointer rounded-full p-1.5 text-on-surface-muted transition-colors hover:bg-surface-variant hover:text-on-surface"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <Input label="Full name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
                <Input
                  label="Email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Input
                  label="Temporary password"
                  type="password"
                  hint="At least 8 characters"
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                />
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as OrgUserRole)}
                    className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                  >
                    {(Object.keys(ROLE_LABELS) as OrgUserRole[]).map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button className="mt-6" isLoading={isInviting} onClick={() => void handleInvite()}>
                Send invitation
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
                <h2 className="text-lg font-bold text-on-surface">Edit member</h2>
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
                    Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as OrgUserRole)}
                    disabled={roleLocked}
                    className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
                  >
                    {(Object.keys(ROLE_LABELS) as OrgUserRole[]).map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
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
                  Active
                </label>

                {isSelf ? (
                  <p className="rounded-lg border border-outline bg-surface-variant p-3 text-xs text-on-surface-variant">
                    You can&apos;t change your own role or deactivate yourself.
                  </p>
                ) : isOnlyActiveAdmin ? (
                  <p className="rounded-lg border border-warning bg-warning-container p-3 text-xs text-on-surface">
                    This is the last active admin — promote another member first.
                  </p>
                ) : null}
              </div>

              <Button className="mt-6" isLoading={isSavingEdit} onClick={() => void handleSaveEdit()}>
                Save changes
              </Button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
