import { Suspense } from 'react';

import { AuthCenteredShell } from '@/features/auth/components/auth-centered-shell';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <AuthCenteredShell>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCenteredShell>
  );
}
