'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheckIcon, MailIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
      const message = error instanceof ApiError ? error.message : 'Không thể gửi email. Vui lòng thử lại.';
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
        <h2 className="mt-5 text-xl font-bold text-on-surface">Kiểm tra email của bạn</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Nếu tài khoản với email này tồn tại, chúng tôi đã gửi một liên kết đặt lại mật khẩu.
        </p>
        <Link href={ROUTES.LOGIN} className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
          ← Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-on-surface">Quên mật khẩu?</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Nhập email tài khoản để nhận liên kết đặt lại mật khẩu.
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
          {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
          ← Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
