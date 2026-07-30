import { AppShell } from '@/components/layout/app-shell';
import { AuthGuard } from '@/features/auth/components/auth-guard';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
