'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, ChevronLeftIcon, MailCheckIcon, MailIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes.config';
import { forgotPassword } from '@/features/auth/api/auth.api';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/validations/auth.validation';
import { ApiError } from '@/lib/api/api-error';

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgotPassword');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setIsSubmitting(true);
      await forgotPassword(values);
      setIsSent(true);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : t('errorFallback');
      showToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-container">
          <MailCheckIcon className="size-7 text-success" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-on-surface">{t('sentTitle')}</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t('sentBody')}</p>
        <Link href={ROUTES.LOGIN} className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
          {t('backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-on-surface">{t('title')}</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="email"
          type="email"
          label={t('emailLabel')}
          autoComplete="email"
          placeholder="name@company.com"
          icon={<MailIcon className="size-4.5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" isLoading={isSubmitting} className="gap-2">
          {isSubmitting ? t('submitting') : t('submit')}
          {!isSubmitting ? <ArrowRightIcon className="size-4" /> : null}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        >
          <ChevronLeftIcon className="size-4" />
          {t('backToLogin')}
        </Link>
      </p>
    </div>
  );
}
