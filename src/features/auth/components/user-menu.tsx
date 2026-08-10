'use client';

import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/config/routes.config';
import { useAuthStore } from '@/features/auth/store/auth.store';

const getInitials = (fullName?: string) => {
  if (!fullName) {
    return 'US';
  }

  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

export function UserMenu() {
  const t = useTranslations('auth.userMenu');
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    router.replace(ROUTES.LOGIN);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={ROUTES.MY_PROFILE}
        className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-surface-variant"
      >
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-on-surface">{user.fullName}</p>
          <p className="text-xs text-on-surface-muted">{user.role}</p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
          {getInitials(user.fullName)}
        </div>
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-outline px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
      >
        {t('logout')}
      </button>
    </div>
  );
}
