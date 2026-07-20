'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon, MailIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
      const message = error instanceof ApiError ? error.message : 'Unable to send email. Please try again.';
      showToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-on-surface">Resend verification email</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Enter your account email to receive a new verification link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="email"
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="name@company.com"
          icon={<MailIcon className="size-4.5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send link'}
        </Button>
      </form>

      {isSent ? (
        <div className="mt-5 rounded-lg border border-info bg-surface-variant p-3.5 text-sm text-on-surface-variant">
          If an account with this email exists and isn&apos;t verified yet, we&apos;ve sent a new link.
        </div>
      ) : null}

      <p className="mt-6 text-center text-sm">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        >
          <ChevronLeftIcon className="size-4" />
          Back to login
        </Link>
      </p>
    </div>
  );
}
