'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import { login } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { loginSchema, type LoginFormValues } from '@/features/auth/validations/auth.validation';
import { ApiError } from '@/lib/api/api-error';

const UNVERIFIED_EMAIL_STATUS_CODE = 403;

export function LoginForm() {
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

      showToast.success('Đăng nhập thành công');
      router.replace(searchParams.get('next') || ROUTES.DASHBOARD);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === UNVERIFIED_EMAIL_STATUS_CODE) {
        setUnverifiedEmail(values.email);
        return;
      }

      const message = error instanceof ApiError ? error.message : 'Không thể đăng nhập. Vui lòng thử lại.';
      showToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Welcome back
        </p>
        <h2 className="mt-3 text-2xl font-bold text-on-surface">Đăng nhập hệ thống</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Sử dụng tài khoản recruiter đã được cấp để truy cập dashboard.
        </p>
      </div>

      {unverifiedEmail ? (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-warning bg-warning-container p-3.5 text-sm text-on-surface">
          <TriangleAlertIcon className="mt-0.5 size-4.5 shrink-0 text-warning" />
          <p>
            Email của bạn chưa được xác thực.{' '}
            <Link
              href={`${ROUTES.RESEND_VERIFICATION}?email=${encodeURIComponent(unverifiedEmail)}`}
              className="font-semibold text-primary hover:underline"
            >
              Gửi lại email xác thực
            </Link>
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="recruiter@example.com"
          icon={<MailIcon className="size-4.5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-on-surface">
              Mật khẩu
            </label>
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm font-semibold text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <Input
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            icon={<LockIcon className="size-4.5" />}
            error={errors.password?.message}
            trailing={
              <button
                type="button"
                onClick={() => setIsPasswordVisible((value) => !value)}
                className="text-on-surface-muted hover:text-on-surface"
                aria-label={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {isPasswordVisible ? <EyeOffIcon className="size-4.5" /> : <EyeIcon className="size-4.5" />}
              </button>
            }
            {...register('password')}
          />
        </div>

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Chưa có tổ chức?{' '}
        <Link href={ROUTES.REGISTER} className="font-semibold text-primary hover:underline">
          Tạo tổ chức mới
        </Link>
      </p>
    </div>
  );
}
