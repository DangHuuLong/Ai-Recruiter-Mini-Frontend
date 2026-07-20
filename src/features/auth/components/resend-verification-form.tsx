'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';
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
      const message = error instanceof ApiError ? error.message : 'Không thể gửi email. Vui lòng thử lại.';
      showToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-on-surface">Gửi lại email xác thực</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Nhập email tài khoản để nhận lại liên kết xác thực.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@company.com"
          icon={<MailIcon className="size-4.5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết'}
        </Button>
      </form>

      {isSent ? (
        <div className="mt-5 rounded-lg border border-info bg-surface-variant p-3.5 text-sm text-on-surface-variant">
          Nếu tài khoản với email này tồn tại và chưa được xác thực, chúng tôi đã gửi một liên kết mới.
        </div>
      ) : null}

      <p className="mt-6 text-center text-sm">
        <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
          ← Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
