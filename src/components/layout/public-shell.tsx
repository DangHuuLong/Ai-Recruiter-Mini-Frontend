import { PublicHeader } from '@/components/layout/public-header';

type PublicShellProps = {
  children: React.ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="no-scrollbar flex h-dvh flex-col overflow-y-auto bg-surface">
      <PublicHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
