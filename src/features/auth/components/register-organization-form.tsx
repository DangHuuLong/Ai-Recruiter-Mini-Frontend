'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BuildingIcon, LockIcon, MailIcon, MailCheckIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
      const message = error instanceof ApiError ? error.message : 'Không thể tạo tổ chức. Vui lòng thử lại.';
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
        <h2 className="mt-5 text-xl font-bold text-on-surface">Kiểm tra email của bạn</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Chúng tôi đã gửi một liên kết xác thực đến <span className="font-semibold text-on-surface">{registeredEmail}</span>.
          Vui lòng nhấp vào liên kết đó để kích hoạt tài khoản.
        </p>
        <Link
          href={`${ROUTES.RESEND_VERIFICATION}?email=${encodeURIComponent(registeredEmail)}`}
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Không nhận được email? Gửi lại
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Get started</p>
        <h2 className="mt-3 text-2xl font-bold text-on-surface">Tạo tổ chức mới</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Thiết lập workspace tuyển dụng cho tổ chức của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="organizationName"
          label="Tên tổ chức"
          placeholder="Acme Corp"
          icon={<BuildingIcon className="size-4.5" />}
          error={errors.organizationName?.message}
          {...register('organizationName')}
        />

        <Input
          id="adminFullName"
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          icon={<UserIcon className="size-4.5" />}
          error={errors.adminFullName?.message}
          {...register('adminFullName')}
        />

        <Input
          id="adminEmail"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="admin@company.com"
          icon={<MailIcon className="size-4.5" />}
          error={errors.adminEmail?.message}
          {...register('adminEmail')}
        />

        <Input
          id="adminPassword"
          type="password"
          label="Mật khẩu"
          autoComplete="new-password"
          placeholder="Tối thiểu 8 ký tự"
          hint="Ít nhất 8 ký tự"
          icon={<LockIcon className="size-4.5" />}
          error={errors.adminPassword?.message}
          {...register('adminPassword')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? 'Đang tạo tổ chức...' : 'Tạo tổ chức'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Đã có tài khoản?{' '}
        <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
