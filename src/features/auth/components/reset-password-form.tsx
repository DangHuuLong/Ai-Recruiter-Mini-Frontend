'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckIcon, LockIcon, TriangleAlertIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
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
      const message = error instanceof ApiError ? error.message : 'Unable to reset password. Please try again.';
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
        <h2 className="mt-5 text-xl font-bold text-on-surface">Password updated</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          You can now log in using your new password.
        </p>
        <Button className="mt-6" onClick={() => router.replace(ROUTES.LOGIN)}>
          Return to login
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
        <h2 className="mt-5 text-xl font-bold text-on-surface">Invalid link</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          This password reset link is invalid or has expired.
        </p>
        <Button className="mt-6" onClick={() => router.push(ROUTES.FORGOT_PASSWORD)}>
          Request a new link
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-on-surface">Reset your password</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Enter a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="newPassword"
          type="password"
          label="New password"
          autoComplete="new-password"
          placeholder="••••••••"
          hint="Minimum 8 characters"
          icon={<LockIcon className="size-4.5" />}
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          icon={<LockIcon className="size-4.5" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update password'}
        </Button>
      </form>
    </div>
  );
}
