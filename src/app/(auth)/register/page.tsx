import { AuthSplitShell } from '@/features/auth/components/auth-split-shell';
import { RegisterOrganizationForm } from '@/features/auth/components/register-organization-form';

export default function RegisterPage() {
  return (
    <AuthSplitShell
      eyebrow="Get started"
      headline="Đưa đội ngũ tuyển dụng của bạn lên một nền tảng AI-first."
      description="Tạo tổ chức để bắt đầu quản lý candidate, resume, job description và chấm điểm ứng viên bằng AI."
    >
      <RegisterOrganizationForm />
    </AuthSplitShell>
  );
}
