import { Suspense } from 'react';

import { AuthSplitShell } from '@/features/auth/components/auth-split-shell';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <AuthSplitShell
      eyebrow="Recruit smarter"
      headline="Quản lý ứng viên, hồ sơ và đánh giá tuyển dụng trong một workspace."
      description="Đăng nhập để tiếp tục theo dõi candidate, resume, job description, application và scoring flow của hệ thống."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthSplitShell>
  );
}
