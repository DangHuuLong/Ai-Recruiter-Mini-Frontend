'use client';

import { CircleCheckIcon, LoaderCircleIcon, TriangleAlertIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { useRouter } from '@/i18n/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getDefaultRouteForRole } from '@/config/route-access.config';
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
    token ? null : 'This verification link is invalid.',
  );
  const [landingRoute, setLandingRoute] = useState<string>(ROUTES.DASHBOARD);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!token || hasRequested.current) return;
    hasRequested.current = true;

    verifyEmail({ token })
      .then((session) => {
        setSession(session);
        setLandingRoute(getDefaultRouteForRole(session.user.role));
        setStatus('success');
      })
      .catch((error) => {
        setStatus('error');
        setErrorMessage(
          error instanceof ApiError ? error.message : 'This link has expired or already been used.',
        );
      });
  }, [token, setSession]);

  if (status === 'verifying') {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-variant">
          <LoaderCircleIcon className="size-7 animate-spin text-primary" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-on-surface">Verifying your email...</h2>
        <p className="mt-2 text-sm text-on-surface-variant">Please wait a moment.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-container">
          <CircleCheckIcon className="size-7 text-success" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-on-surface">Email verified!</h2>
        <p className="mt-2 text-sm text-on-surface-variant">Your account is ready to use.</p>
        <Button className="mt-6" onClick={() => router.replace(landingRoute)}>
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-error-container">
        <TriangleAlertIcon className="size-7 text-error" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-on-surface">Verification failed</h2>
      <p className="mt-2 text-sm text-on-surface-variant">{errorMessage}</p>
      <Button className="mt-6" onClick={() => router.push(ROUTES.RESEND_VERIFICATION)}>
        Request a new link
      </Button>
    </div>
  );
}
