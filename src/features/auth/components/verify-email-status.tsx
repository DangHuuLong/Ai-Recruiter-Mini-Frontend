'use client';

import { CircleCheckIcon, LoaderCircleIcon, TriangleAlertIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { verifyEmail } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ApiError } from '@/lib/api/api-error';

type VerifyStatus = 'verifying' | 'success' | 'error';

export function VerifyEmailStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const setSession = useAuthStore((state) => state.setSession);
  const [status, setStatus] = useState<VerifyStatus>(token ? 'verifying' : 'error');
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : 'Liên kết xác thực không hợp lệ.',
  );
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!token || hasRequested.current) return;
    hasRequested.current = true;

    verifyEmail({ token })
      .then((session) => {
        setSession(session);
        setStatus('success');
      })
      .catch((error) => {
        setStatus('error');
        setErrorMessage(
          error instanceof ApiError ? error.message : 'Liên kết đã hết hạn hoặc đã được sử dụng.',
        );
      });
  }, [token, setSession]);

  if (status === 'verifying') {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-variant">
          <LoaderCircleIcon className="size-7 animate-spin text-primary" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-on-surface">Đang xác thực email...</h2>
        <p className="mt-2 text-sm text-on-surface-variant">Vui lòng đợi trong giây lát.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-container">
          <CircleCheckIcon className="size-7 text-success" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-on-surface">Email đã được xác thực!</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Tài khoản của bạn đã sẵn sàng sử dụng.
        </p>
        <Button className="mt-6" onClick={() => router.replace(ROUTES.DASHBOARD)}>
          Vào dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-error-container">
        <TriangleAlertIcon className="size-7 text-error" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-on-surface">Xác thực thất bại</h2>
      <p className="mt-2 text-sm text-on-surface-variant">{errorMessage}</p>
      <Button className="mt-6" onClick={() => router.push(ROUTES.RESEND_VERIFICATION)}>
        Yêu cầu liên kết mới
      </Button>
    </div>
  );
}
