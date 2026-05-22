import { UserMenu } from '@/features/auth/components/user-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080511]/70 backdrop-blur-2xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="font-display text-xs font-bold uppercase tracking-[0.34em] text-[var(--color-accent)]">
            Talent Mission Control
          </p>
          <h1 className="mt-1 truncate font-display text-xl font-bold tracking-tight text-white">
            Recruitment Operating System
          </h1>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center px-8 xl:flex">
          <label className="group flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.22)] transition hover:border-[var(--color-accent)]/40 hover:bg-white/[0.08]">
            <span className="text-sm text-[var(--color-text-tertiary)]">⌘K</span>
            <input
              aria-label="Search candidates, jobs, interviews"
              placeholder="Search candidates, jobs, interviews..."
              className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-[var(--color-text-tertiary)]"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-lg text-white transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40 hover:bg-white/[0.1] hover:shadow-[0_0_34px_rgba(87,242,204,0.16)]"
            aria-label="Open notifications"
          >
            <span>✦</span>
            <span className="absolute right-2 top-2 size-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_18px_rgba(87,242,204,0.9)]" />
          </button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
