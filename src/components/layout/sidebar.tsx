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
    <aside className="relative z-20 hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-[#0c0718]/78 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="absolute inset-y-10 right-0 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/40 to-transparent" />

      <div className="flex h-20 items-center border-b border-white/10 px-5">
        <Link href={ROUTES.DASHBOARD} className="group flex items-center gap-3">
          <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] font-display text-sm font-black text-white shadow-[0_0_35px_rgba(157,124,255,0.32)] transition group-hover:scale-105">
            <span className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/60 to-[var(--color-accent)]/35" />
            <span className="relative">AI</span>
          </span>

          <span>
            <span className="block font-display text-base font-bold tracking-tight text-white">
              AI Recruiter
            </span>

            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
              RMS Command
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-6">
        {dashboardNavigationItems.map((item, index) => {
          const isActive = isNavigationItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center overflow-hidden rounded-2xl border px-4 py-3 text-sm font-semibold transition duration-200',
                isActive
                  ? 'border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 text-white shadow-[0_0_34px_rgba(87,242,204,0.12)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.06] hover:text-white',
              )}
              style={{ animationDelay: `${index * 55}ms` }}
            >
              {isActive ? (
                <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[var(--color-accent)] shadow-[0_0_18px_rgba(87,242,204,0.9)]" />
              ) : null}

              <span className="mr-3 text-base text-[var(--color-accent)]/85">◆</span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-5">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
          <div className="absolute -right-8 -top-8 size-24 rounded-full bg-[var(--color-accent)]/20 blur-2xl" />
          <p className="relative font-display text-sm font-bold text-white">
            Hiring Signal
          </p>

          <p className="relative mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
            AI-ready workspace for candidates, resumes, job posts and scoring flows.
          </p>

          <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
          </div>
        </div>
      </div>
    </aside>
  );
}