import { AppShell } from '@/components/layout/app-shell';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AppShell>{children}</AppShell>;
}