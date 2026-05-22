import { Header } from '@/components/layout/header';
import { MainContent } from '@/components/layout/main-content';
import { Sidebar } from '@/components/layout/sidebar';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-[#080511] text-[var(--color-text-primary)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[18%] top-[-12rem] h-96 w-96 rounded-full bg-[var(--color-primary)]/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-20 h-[30rem] w-[30rem] rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <Sidebar />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}