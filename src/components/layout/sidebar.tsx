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
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
            AI
          </span>

          <span>
            <span className="block text-sm font-semibold tracking-tight text-slate-950">
              AI Recruiter
            </span>

            <span className="block text-xs font-medium text-slate-500">
              Smart hiring workspace
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {dashboardNavigationItems.map((item) => {
          const isActive = isNavigationItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
              )}
            >
              {isActive ? (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
              ) : null}

              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            MVP Workspace
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Manage candidates, resumes, job descriptions and evaluations.
          </p>
        </div>
      </div>
    </aside>
  );
}