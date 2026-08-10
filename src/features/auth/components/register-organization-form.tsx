'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BuildingIcon, LockIcon, MailIcon, MailCheckIcon, UserIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes.config';
import { registerOrganization } from '@/features/auth/api/auth.api';
import {
  registerOrganizationSchema,
  type RegisterOrganizationFormValues,
} from '@/features/auth/validations/auth.validation';
import { ApiError } from '@/lib/api/api-error';

export function RegisterOrganizationForm() {
  const t = useTranslations('auth.register');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterOrganizationFormValues>({
    resolver: zodResolver(registerOrganizationSchema),
    defaultValues: { organizationName: '', adminFullName: '', adminEmail: '', adminPassword: '' },
  });

  const onSubmit = async (values: RegisterOrganizationFormValues) => {
    try {
      setIsSubmitting(true);
      await registerOrganization(values);
      setRegisteredEmail(values.adminEmail);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : t('errorFallback');
      showToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registeredEmail) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-container">
          <MailCheckIcon className="size-7 text-success" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-on-surface">{t('checkEmailTitle')}</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          {t.rich('checkEmailBody', {
            email: registeredEmail,
            b: (chunks) => <span className="font-semibold text-on-surface">{chunks}</span>,
          })}
        </p>
        <Link
          href={`${ROUTES.RESEND_VERIFICATION}?email=${encodeURIComponent(registeredEmail)}`}
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          {t('resendLink')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t('eyebrow')}</p>
        <h2 className="mt-3 text-2xl font-bold text-on-surface">{t('title')}</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="organizationName"
          label={t('orgNameLabel')}
          placeholder="e.g., Acme Corp"
          icon={<BuildingIcon className="size-4.5" />}
          error={errors.organizationName?.message}
          {...register('organizationName')}
        />

        <Input
          id="adminFullName"
          label={t('adminNameLabel')}
          placeholder="John Doe"
          icon={<UserIcon className="size-4.5" />}
          error={errors.adminFullName?.message}
          {...register('adminFullName')}
        />

        <Input
          id="adminEmail"
          type="email"
          label={t('adminEmailLabel')}
          autoComplete="email"
          placeholder="name@company.com"
          icon={<MailIcon className="size-4.5" />}
          error={errors.adminEmail?.message}
          {...register('adminEmail')}
        />

        <Input
          id="adminPassword"
          type="password"
          label={t('adminPasswordLabel')}
          autoComplete="new-password"
          placeholder="••••••••"
          hint={t('adminPasswordHint')}
          icon={<LockIcon className="size-4.5" />}
          error={errors.adminPassword?.message}
          {...register('adminPassword')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </form>

      <div className="mt-6 border-t border-outline-variant pt-6 text-center text-sm text-on-surface-variant">
        {t('alreadyHaveAccount')}{' '}
        <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
          {t('login')}
        </Link>
      </div>
    </div>
  );
}
