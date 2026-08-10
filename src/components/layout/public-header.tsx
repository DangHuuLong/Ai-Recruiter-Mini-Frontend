import Image from 'next/image';
import { Link } from '@/i18n/navigation';

import { ROUTES } from '@/config/routes.config';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-outline bg-surface-lowest">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.ROOT} className="flex items-center gap-2.5">
          <span className="relative size-9">
            <Image src="/images/logo.svg" alt="AI Recruiter logo" fill className="object-contain" />
          </span>
          <span className="text-lg font-bold text-on-surface">AI Recruiter</span>
        </Link>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href={ROUTES.LOGIN}
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface"
          >
            Log in
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
