'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { dashboardNavigationItems } from '@/config/navigation.config';
import { ROUTES } from '@/config/routes.config';
import { cn } from '@/lib/utils/cn';
import { isNavigationItemActive } from '@/lib/utils/navigation';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-sidebar shrink-0 border-r border-slate-800 bg-bg-sidebar lg:block">
      <div className="flex h-header items-center border-b border-slate-800 px-5">
        <Link href={ROUTES.DASHBOARD} className="text-base font-semibold text-white">
          AI Recruiter
        </Link>
      </div>

      <nav className="space-y-1 px-3 py-4">
        {dashboardNavigationItems.map((item) => {
          const isActive = isNavigationItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-button px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}