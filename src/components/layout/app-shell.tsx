import { Header } from './header';
import { MainContent } from './main-content';
import { Sidebar } from './sidebar';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}