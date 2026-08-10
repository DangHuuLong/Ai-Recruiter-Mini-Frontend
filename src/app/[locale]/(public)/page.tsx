import { FileTextIcon, ShieldCheckIcon, SparklesIcon, UploadIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import { AnimatedGlowBackground } from '@/components/decorative/animated-glow-background';
import { ROUTES } from '@/config/routes.config';

export default async function PublicLandingPage() {
  const t = await getTranslations('publicLanding');

  const STEPS = [
    {
      icon: UploadIcon,
      title: t('steps.uploadTitle'),
      description: t('steps.uploadDescription'),
    },
    {
      icon: FileTextIcon,
      title: t('steps.addJdTitle'),
      description: t('steps.addJdDescription'),
    },
    {
      icon: SparklesIcon,
      title: t('steps.scoreTitle'),
      description: t('steps.scoreDescription'),
    },
  ];

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col justify-between overflow-hidden">
      <AnimatedGlowBackground />

      <section className="relative mx-auto w-full max-w-5xl px-4 pt-10 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
          {t('heroTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg">
          {t('heroSubtitle')}
        </p>
        <Link
          href={ROUTES.PUBLIC_TRY}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-on-primary transition hover:bg-primary-hover"
        >
          {t('ctaTry')}
        </Link>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-outline bg-surface-lowest/90 p-5 shadow-card backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                  <step.icon className="size-4.5" />
                </span>
                <span className="text-xs font-bold text-on-surface-muted">
                  {t('steps.step', { number: index + 1 })}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-on-surface">{step.title}</h3>
              <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative border-t border-outline bg-surface-variant/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-4 py-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-on-surface">
            <ShieldCheckIcon className="size-4.5 text-success" />
            {t('filesNeverStored')}
          </div>
          <p className="text-xs text-on-surface-variant">{t('limitNotice')}</p>
        </div>
      </section>
    </div>
  );
}
