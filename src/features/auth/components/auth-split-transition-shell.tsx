'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { ROUTES } from '@/config/routes.config';
import { AuthBrandPanel } from '@/features/auth/components/auth-brand-panel';
import { cn } from '@/lib/utils/cn';

type SplitAuthMode = 'login' | 'register';

const BACKGROUND_IMAGE_SRC: Record<SplitAuthMode, string> = {
  login: '/images/auth-bg-login.jpg',
  register: '/images/auth-bg-register.jpg',
};

const PANEL_TRANSITION = { type: 'spring', stiffness: 300, damping: 34 } as const;

type AuthSplitTransitionShellProps = {
  children: ReactNode;
};

export function AuthSplitTransitionShell({ children }: AuthSplitTransitionShellProps) {
  const pathname = usePathname();
  const mode: SplitAuthMode = pathname === ROUTES.REGISTER ? 'register' : 'login';
  const t = useTranslations(`auth.brandPanel.${mode}`);

  return (
    <main
      className={cn(
        'no-scrollbar flex h-dvh overflow-y-auto bg-surface',
        mode === 'register' ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <motion.div layout transition={PANEL_TRANSITION} className="relative z-10 flex flex-1">
        <AuthBrandPanel
          eyebrow={t('eyebrow')}
          headline={t('headline')}
          description={t('description')}
          backgroundImageSrc={BACKGROUND_IMAGE_SRC[mode]}
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
