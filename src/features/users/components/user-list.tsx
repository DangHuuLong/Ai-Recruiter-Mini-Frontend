'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

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
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format-date';

function getInitials(name: string | null, email: string) {
  const source = name?.trim() || email;
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function UserList() {
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);

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

      <div className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-variant">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Member
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Role
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Status
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Joined
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-surface-variant/60">
                <td className="px-5 py-4">
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
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
                    {ROLE_LABELS[user.role]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-semibold',
                      user.isActive
                        ? 'bg-success-container text-success'
                        : 'bg-surface-variant text-on-surface-muted',
                    )}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-on-surface-variant">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => openEdit(user)}
                    className="cursor-pointer text-sm font-semibold text-primary hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
