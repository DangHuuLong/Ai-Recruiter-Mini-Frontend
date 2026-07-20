'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { ROUTES } from '@/config/routes.config';
import { AuthBrandPanel } from '@/features/auth/components/auth-brand-panel';
import { cn } from '@/lib/utils/cn';

type SplitAuthMode = 'login' | 'register';

type SplitAuthCopy = {
  eyebrow: string;
  headline: string;
  description: string;
  backgroundImageSrc: string;
};

const MODE_CONFIG: Record<SplitAuthMode, SplitAuthCopy> = {
  login: {
    eyebrow: 'Recruit smarter',
    headline: 'Welcome back to AI Recruiter.',
    description:
      'Connect with top talent using our AI matching engine. Track candidates, resumes, job descriptions, applications and scoring in one workspace.',
    backgroundImageSrc: '/images/auth-bg-login.jpg',
  },
  register: {
    eyebrow: 'Get started',
    headline: 'The intelligent layer for your hiring team.',
    description:
      'Score candidates, predict fit, and automate high-volume screening with your own AI recruitment workspace.',
    backgroundImageSrc: '/images/auth-bg-register.jpg',
  },
};

const PANEL_TRANSITION = { type: 'spring', stiffness: 300, damping: 34 } as const;

type AuthSplitTransitionShellProps = {
  children: ReactNode;
};

export function AuthSplitTransitionShell({ children }: AuthSplitTransitionShellProps) {
  const pathname = usePathname();
  const mode: SplitAuthMode = pathname === ROUTES.REGISTER ? 'register' : 'login';
  const copy = MODE_CONFIG[mode];

  return (
    <main
      className={cn(
        'no-scrollbar flex h-screen overflow-y-auto bg-surface',
        mode === 'register' ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <motion.div layout transition={PANEL_TRANSITION} className="relative z-10 flex flex-1">
        <AuthBrandPanel
          eyebrow={copy.eyebrow}
          headline={copy.headline}
          description={copy.description}
          backgroundImageSrc={copy.backgroundImageSrc}
        />
      </motion.div>

      <motion.div
        layout
        transition={PANEL_TRANSITION}
        className="relative z-0 flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:max-w-xl"
      >
        <div className="w-full max-w-md">
          <Link href={ROUTES.ROOT} className="mb-6 flex w-fit items-center gap-2.5 lg:hidden">
            <span className="relative size-12">
              <Image src="/images/logo.svg" alt="AI Recruiter logo" fill className="object-contain" />
            </span>
            <span className="text-base font-bold text-on-surface">AI Recruiter</span>
          </Link>

          <div className="rounded-2xl border border-outline bg-surface-lowest p-8 shadow-card">
            {children}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
