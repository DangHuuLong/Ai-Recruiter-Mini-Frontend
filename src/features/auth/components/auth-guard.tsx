'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';

import { ROUTES } from '@/config/routes.config';
import { getRequiredRoles } from '@/config/route-access.config';
import { AccessDenied } from '@/features/auth/components/access-denied';
import { selectIsAuthenticated, useAuthStore } from '@/features/auth/store/auth.store';

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isHydrated || isAuthenticated) {
      return;
    }

    const next = encodeURIComponent(pathname);
    router.replace(`${ROUTES.LOGIN}?next=${next}`);
  }, [isAuthenticated, isHydrated, pathname, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="rounded-2xl border border-outline bg-surface-lowest px-6 py-5 text-sm font-medium text-on-surface-variant shadow-card">
          Checking your session...
        </div>
      </div>
    );
  }

  if (user && !getRequiredRoles(pathname).includes(user.role)) {
    return <AccessDenied role={user.role} />;
  }

  return <>{children}</>;
}
