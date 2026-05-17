'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES } from '@/config/routes.config';
import { selectIsAuthenticated, useAuthStore } from '@/features/auth/store/auth.store';

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    if (!isHydrated || isAuthenticated) {
      return;
    }

    const next = encodeURIComponent(pathname);
    router.replace(`${ROUTES.LOGIN}?next=${next}`);
  }, [isAuthenticated, isHydrated, pathname, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-sm">
          Đang kiểm tra phiên đăng nhập...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
