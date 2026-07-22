import { Header } from '@/components/layout/header';
import { MainContent } from '@/components/layout/main-content';
import { Sidebar } from '@/components/layout/sidebar';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-surface text-on-surface">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
