import { BellIcon, HelpCircleIcon, SearchIcon } from 'lucide-react';

import { UserMenu } from '@/features/auth/components/user-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-outline bg-surface-lowest">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden min-w-0 flex-1 xl:flex">
          <label className="flex w-full max-w-md items-center gap-2 rounded-lg border border-outline bg-surface-variant px-3.5 py-2.5 transition focus-within:border-primary">
            <SearchIcon className="size-4 shrink-0 text-on-surface-muted" />
            <input
              aria-label="Search candidates, jobs, evaluations"
              placeholder="Search candidates, jobs, evaluations..."
              className="w-full border-0 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-muted"
            />
          </label>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
            aria-label="Open notifications"
          >
            <BellIcon className="size-5" />
          </button>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
            aria-label="Help"
          >
            <HelpCircleIcon className="size-5" />
          </button>

          <div className="mx-1 h-8 w-px bg-outline" />

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
