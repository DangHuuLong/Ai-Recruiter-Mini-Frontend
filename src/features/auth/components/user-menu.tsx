'use client';

import { useRouter } from 'next/navigation';

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
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
        <p className="text-xs text-slate-500">{user.role}</p>
      </div>

      <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {getInitials(user.fullName)}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
      >
        Đăng xuất
      </button>
    </div>
  );
}
