import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { ReactNode } from 'react';

import { ROUTES } from '@/config/routes.config';
import { AuthFooterLinks } from '@/features/auth/components/auth-footer-links';

type AuthCenteredShellProps = {
  children: ReactNode;
};

export function AuthCenteredShell({ children }: AuthCenteredShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-10">
      <Link href={ROUTES.ROOT} className="mb-6 flex items-center gap-2.5">
        <span className="relative size-14">
          <Image src="/images/logo.svg" alt="AI Recruiter logo" fill className="object-contain" />
        </span>
        <span className="text-lg font-bold text-on-surface">AI Recruiter</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-outline bg-surface-lowest p-8 shadow-card">
        {children}
      </div>

      <AuthFooterLinks />
    </main>
  );
}
