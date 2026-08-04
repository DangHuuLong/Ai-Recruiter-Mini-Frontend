import { Suspense } from 'react';

import { AuthCenteredShell } from '@/features/auth/components/auth-centered-shell';
import { ResendVerificationForm } from '@/features/auth/components/resend-verification-form';

export default function ResendVerificationPage() {
  return (
    <AuthCenteredShell>
      <Suspense fallback={null}>
        <ResendVerificationForm />
      </Suspense>
    </AuthCenteredShell>
  );
}
