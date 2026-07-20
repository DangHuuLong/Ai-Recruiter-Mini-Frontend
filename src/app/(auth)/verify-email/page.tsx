import { Suspense } from 'react';

import { AuthCenteredShell } from '@/features/auth/components/auth-centered-shell';
import { VerifyEmailStatus } from '@/features/auth/components/verify-email-status';

export default function VerifyEmailPage() {
  return (
    <AuthCenteredShell>
      <Suspense fallback={null}>
        <VerifyEmailStatus />
      </Suspense>
    </AuthCenteredShell>
  );
}
