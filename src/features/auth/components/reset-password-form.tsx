'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckIcon, LockIcon, TriangleAlertIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes.config';
import { resetPassword } from '@/features/auth/api/auth.api';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/validations/auth.validation';
import { ApiError } from '@/lib/api/api-error';

export function ResetPasswordForm() {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;

    try {
      setIsSubmitting(true);
      await resetPassword({ token, newPassword: values.newPassword });
      setIsDone(true);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : t('errorFallback');
      showToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-container">
          <CircleCheckIcon className="size-7 text-success" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-on-surface">{t('doneTitle')}</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t('doneBody')}</p>
        <Button className="mt-6" onClick={() => router.replace(ROUTES.LOGIN)}>
          {t('returnToLogin')}
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-error-container">
          <TriangleAlertIcon className="size-7 text-error" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-on-surface">{t('invalidTitle')}</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t('invalidBody')}</p>
        <Button className="mt-6" onClick={() => router.push(ROUTES.FORGOT_PASSWORD)}>
          {t('requestNewLink')}
        </Button>
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
          id="newPassword"
          type="password"
          label={t('newPasswordLabel')}
          autoComplete="new-password"
          placeholder="••••••••"
          hint={t('newPasswordHint')}
          icon={<LockIcon className="size-4.5" />}
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <Input
          id="confirmPassword"
          type="password"
          label={t('confirmPasswordLabel')}
          autoComplete="new-password"
          placeholder="••••••••"
          icon={<LockIcon className="size-4.5" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </form>
    </div>
  );
}
