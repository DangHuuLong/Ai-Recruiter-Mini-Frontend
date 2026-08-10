'use client';

import { PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { AuthUser } from '@/features/auth/types/auth.type';
import { getCurrentUser, updateCurrentUserFullName } from '@/features/users/api/user.api';
import { ROLE_LABEL_KEYS } from '@/features/users/types/user.type';

function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function MyProfile() {
  const t = useTranslations('users.profile');
  const tCommon = useTranslations('common');
  const updateStoreUser = useAuthStore((state) => state.updateUser);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullNameDraft, setFullNameDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getCurrentUser();
      setUser(data);
      setFullNameDraft(data.fullName);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('errorTitle'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canEditName = user?.role === 'ADMIN';

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const updated = await updateCurrentUserFullName(fullNameDraft.trim());
      setUser(updated);
      updateStoreUser(updated);
      setIsEditing(false);
      showToast.success(t('updateSuccess'));
    } catch (error) {
      showToast.error(t('updateFailedTitle'), {
        description: error instanceof Error ? error.message : t('updateFailedFallback'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState title={t('loadingTitle')} description={t('loadingDescription')} />;
  }

  if (errorMessage || !user) {
    return <EmptyState title={t('errorTitle')} description={errorMessage ?? t('errorFallback')} />;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{t('subtitle')}</p>
      </div>

      <div className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-on-primary">
            {getInitials(user.fullName)}
          </div>
          <h2 className="mt-4 text-xl font-bold text-on-surface">{user.fullName}</h2>
          <span className="mt-2 inline-flex rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
            {tCommon(`roleLabels.${ROLE_LABEL_KEYS[user.role]}`)}
          </span>
        </div>

        <div className="mt-6 space-y-4 border-t border-outline pt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">{t('emailLabel')}</p>
            <p className="mt-1 rounded-xl border border-outline bg-surface-variant px-3 py-2.5 text-sm text-on-surface-variant">
              {user.email}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">{t('fullNameLabel')}</p>
              {canEditName && !isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setFullNameDraft(user.fullName);
                    setIsEditing(true);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
                >
                  <PencilIcon className="size-3.5" />
                  {t('edit')}
                </button>
              ) : null}
            </div>

            {isEditing ? (
              <div className="mt-1 space-y-2">
                <input
                  value={fullNameDraft}
                  onChange={(event) => setFullNameDraft(event.target.value)}
                  disabled={isSaving}
                  className="h-11 w-full rounded-xl border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      setFullNameDraft(user.fullName);
                      setIsEditing(false);
                    }}
                    className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-outline px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="button"
                    disabled={isSaving || !fullNameDraft.trim()}
                    onClick={() => void handleSave()}
                    className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled"
                  >
                    {isSaving ? t('saving') : t('save')}
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1 rounded-xl border border-outline px-3 py-2.5 text-sm text-on-surface">
                {user.fullName}
                {!canEditName ? (
                  <span className="ml-2 text-xs font-medium text-on-surface-muted">
                    {t('contactAdminNote')}
                  </span>
                ) : null}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3 rounded-xl border border-primary/20 bg-primary-container p-4 text-sm text-on-primary-container">
          <p>{t.rich('passwordNote', { b: (chunks) => <span className="font-semibold">{chunks}</span> })}</p>
        </div>
      </div>
    </div>
  );
}
