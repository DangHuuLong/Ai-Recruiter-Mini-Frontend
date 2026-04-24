import { Header } from './header';
import { MainContent } from './main-content';
import { Sidebar } from './sidebar';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </div>
  );
}