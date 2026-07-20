import { AuthCenteredShell } from '@/features/auth/components/auth-centered-shell';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthCenteredShell>
      <ForgotPasswordForm />
    </AuthCenteredShell>
  );
}
