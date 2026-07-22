'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PencilIcon, PlusIcon, XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ActionIconButton, DataTable, type DataTableColumn, type DataTableSort, type DataTableSortOrder } from '@/components/common';
import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  isLastActiveAdmin,
  MOCK_CURRENT_USER_ID,
  MOCK_USERS,
  ROLE_LABELS,
  type MockUser,
  type UserRole,
} from '@/features/users/mock/user-mock-data';
import { sortMock } from '@/lib/utils/mock-delay';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format-date';

const ROLE_FILTER_OPTIONS = (Object.keys(ROLE_LABELS) as UserRole[]).map((role) => ({
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
  role: UserRole | '',
  status: string,
  onEdit: (user: MockUser) => void,
): DataTableColumn<MockUser>[] {
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
              {user.id === MOCK_CURRENT_USER_ID ? (
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
          {ROLE_LABELS[user.role]}
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
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState<DataTableSort | null>(null);

  const handleSortChange = (key: string, order: DataTableSortOrder) => {
    setSort({ key, order });
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'role') setRoleFilter(value as UserRole | '');
    if (key === 'isActive') setStatusFilter(value);
  };

  const visibleUsers = useMemo(() => {
    let filtered = users;
    if (roleFilter) filtered = filtered.filter((user) => user.role === roleFilter);
    if (statusFilter) filtered = filtered.filter((user) => String(user.isActive) === statusFilter);
    return sortMock(filtered, sort?.key, sort?.order);
  }, [users, roleFilter, statusFilter, sort]);

  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('RECRUITER');

  const [editRole, setEditRole] = useState<UserRole>('RECRUITER');
  const [editIsActive, setEditIsActive] = useState(true);

  const openEdit = (user: MockUser) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim() || invitePassword.length < 8) {
      showToast.error('Email and a password of at least 8 characters are required');
      return;
    }
    showToast.success('Invitation sent', { description: inviteEmail });
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInvitePassword('');
    setInviteRole('RECRUITER');
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    setUsers((current) =>
      current.map((u) => (u.id === editingUser.id ? { ...u, role: editRole, isActive: editIsActive } : u)),
    );
    showToast.success('Member updated', { description: editingUser.email });
    setEditingUser(null);
  };

  const isSelf = editingUser?.id === MOCK_CURRENT_USER_ID;
  const isOnlyActiveAdmin = editingUser ? isLastActiveAdmin(editingUser, users) : false;
  const roleLocked = isSelf || isOnlyActiveAdmin;
  const activeLocked = isSelf || isOnlyActiveAdmin;

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

      <DataTable
        data={visibleUsers}
        columns={buildColumns(roleFilter, statusFilter, openEdit)}
        getRowKey={(user) => user.id}
        sort={sort}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />

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
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                  >
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button className="mt-6" onClick={handleInvite}>
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
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    disabled={roleLocked}
                    className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
                  >
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
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

              <Button className="mt-6" onClick={handleSaveEdit}>
                Save changes
              </Button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
