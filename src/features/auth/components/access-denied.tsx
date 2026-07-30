import Image from 'next/image';
import Link from 'next/link';

import { EmptyState } from '@/components/feedback';
import { getDefaultRouteForRole } from '@/config/route-access.config';
import { ROUTES } from '@/config/routes.config';
import type { UserRole } from '@/features/auth/types/auth.type';

type AccessDeniedProps = {
  role?: UserRole;
};

export function AccessDenied({ role }: AccessDeniedProps) {
  const homeHref = role ? getDefaultRouteForRole(role) : ROUTES.DASHBOARD;
  const homeLabel = role === 'DEV' ? 'Back to Interview Question Bank' : 'Back to Dashboard';

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <EmptyState
        title="Access denied"
        description="Your account role doesn't have permission to view this page."
        icon={
          <span className="relative flex size-11 shrink-0 items-center justify-center">
            <Image src="/images/logo.svg" alt="" fill className="object-contain" />
          </span>
        }
        action={
          <Link
            href={homeHref}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {homeLabel}
          </Link>
        }
      />
    </div>
  );
}
