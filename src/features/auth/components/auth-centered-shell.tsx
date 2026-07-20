import { SparklesIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { AuthFooterLinks } from '@/features/auth/components/auth-footer-links';

type AuthCenteredShellProps = {
  children: ReactNode;
};

export function AuthCenteredShell({ children }: AuthCenteredShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-on-primary">
          <SparklesIcon className="size-4.5" />
        </span>
        <span className="text-base font-bold text-on-surface">AI Recruiter</span>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-outline bg-surface-lowest p-8 shadow-card">
        {children}
      </div>

      <AuthFooterLinks />
    </main>
  );
}
