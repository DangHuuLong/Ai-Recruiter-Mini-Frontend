'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, TriangleAlertIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/components/feedback';
import { canAccessRoute, getDefaultRouteForRole } from '@/config/route-access.config';
import { ROUTES } from '@/config/routes.config';
import { login } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { loginSchema, type LoginFormValues } from '@/features/auth/validations/auth.validation';
import { ApiError } from '@/lib/api/api-error';

const UNVERIFIED_EMAIL_STATUS_CODE = 403;

export function LoginForm() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setUnverifiedEmail(null);

    try {
      setIsSubmitting(true);

      const session = await login(values);
      setSession(session);

      showToast.success(t('successToast'));
      const next = searchParams.get('next');
      const destination =
        next && canAccessRoute(next, session.user.role) ? next : getDefaultRouteForRole(session.user.role);
      router.replace(destination);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === UNVERIFIED_EMAIL_STATUS_CODE) {
        setUnverifiedEmail(values.email);
        return;
      }

      const message = error instanceof ApiError ? error.message : t('errorFallback');
      showToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t('eyebrow')}</p>
        <h2 className="mt-3 text-2xl font-bold text-on-surface">{t('title')}</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t('subtitle')}</p>
      </div>

      {unverifiedEmail ? (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-warning bg-warning-container p-3.5 text-sm text-on-surface">
          <TriangleAlertIcon className="mt-0.5 size-4.5 shrink-0 text-warning" />
          <p>
            {t('unverifiedEmailWarning')}{' '}
            <Link
              href={`${ROUTES.RESEND_VERIFICATION}?email=${encodeURIComponent(unverifiedEmail)}`}
              className="font-semibold text-primary hover:underline"
            >
              {t('resendLink')}
            </Link>
          </p>
        </div>
      ) : null}

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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
            >
              {t('passwordLabel')}
            </label>
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-xs font-semibold text-primary hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
          <Input
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            icon={<LockIcon className="size-4.5" />}
            error={errors.password?.message}
            trailing={
              <button
                type="button"
                onClick={() => setIsPasswordVisible((value) => !value)}
                className="text-on-surface-muted hover:text-on-surface"
                aria-label={isPasswordVisible ? t('hidePassword') : t('showPassword')}
              >
                {isPasswordVisible ? <EyeOffIcon className="size-4.5" /> : <EyeIcon className="size-4.5" />}
              </button>
            }
            {...register('password')}
          />
        </div>

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </form>

      <div className="mt-6 border-t border-outline-variant pt-6 text-center text-sm text-on-surface-variant">
        {t('noAccount')}{' '}
        <Link href={ROUTES.REGISTER} className="font-semibold text-primary hover:underline">
          {t('createOrg')}
        </Link>
      </div>
    </div>
  );
}
