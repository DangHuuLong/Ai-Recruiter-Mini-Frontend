import { SparklesIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { AuthBrandPanel } from '@/features/auth/components/auth-brand-panel';

type AuthSplitShellProps = {
  eyebrow: string;
  headline: string;
  description: string;
  children: ReactNode;
};

export function AuthSplitShell({ eyebrow, headline, description, children }: AuthSplitShellProps) {
  return (
    <main className="flex min-h-screen bg-surface">
      <AuthBrandPanel eyebrow={eyebrow} headline={headline} description={description} />

      <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:max-w-xl">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-on-primary">
              <SparklesIcon className="size-4.5" />
            </span>
            <span className="text-base font-bold text-on-surface">AI Recruiter</span>
          </div>

          <div className="rounded-2xl border border-outline bg-surface-lowest p-8 shadow-card">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
