'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon, MailIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes.config';
import { resendVerification } from '@/features/auth/api/auth.api';
import {
  resendVerificationSchema,
  type ResendVerificationFormValues,
} from '@/features/auth/validations/auth.validation';
import { ApiError } from '@/lib/api/api-error';

export function ResendVerificationForm() {
  const t = useTranslations('auth.resendVerification');
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: searchParams.get('email') ?? '' },
  });

  const onSubmit = async (values: ResendVerificationFormValues) => {
    try {
      setIsSubmitting(true);
      await resendVerification(values);
      setIsSent(true);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : t('errorFallback');
      showToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </form>

      {isSent ? (
        <div className="mt-5 rounded-lg border border-info bg-surface-variant p-3.5 text-sm text-on-surface-variant">
          {t('sentNotice')}
        </div>
      ) : null}

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
