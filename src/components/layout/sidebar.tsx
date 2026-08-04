'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { usePathname } from '@/i18n/navigation';

import { navigationGroups } from '@/config/navigation.config';
import { getDefaultRouteForRole, getRequiredRoles } from '@/config/route-access.config';
import { ROUTES } from '@/config/routes.config';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { cn } from '@/lib/utils/cn';
import { isNavigationItemActive } from '@/lib/utils/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user?.role);

  const visibleGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !role || getRequiredRoles(item.href).includes(role)),
    }))
    .filter((group) => group.items.length > 0);

  const homeHref = role ? getDefaultRouteForRole(role) : ROUTES.DASHBOARD;

  return (
    <aside className="hidden min-h-dvh w-72 shrink-0 border-r border-outline bg-surface-lowest lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-outline px-5">
        <Link href={homeHref} className="flex items-center gap-3">
          <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-outline bg-surface-lowest">
            <Image src="/images/logo.svg" alt="" fill className="object-contain p-1" />
          </span>

          <span>
            <span className="block text-base font-bold tracking-tight text-on-surface">
              AI Recruiter
            </span>
            <span className="block text-xs font-medium text-on-surface-muted">
              Enterprise Talent Hub
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {visibleGroups.map((group, groupIndex) => (
          <div key={group.label ?? `group-${groupIndex}`}>
            {group.label ? (
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-on-surface-muted">
                {group.label}
              </p>
            ) : null}

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = isNavigationItemActive(pathname, item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                      isActive
                        ? 'bg-primary-container font-bold text-on-primary-container'
                        : 'font-medium text-on-surface-variant hover:bg-surface-variant hover:text-on-surface',
                    )}
                  >
                    {Icon ? <Icon className="size-4.5 shrink-0" /> : null}
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
