import { AuthSplitTransitionShell } from '@/features/auth/components/auth-split-transition-shell';

type SplitAuthLayoutProps = {
  children: React.ReactNode;
};

export default function SplitAuthLayout({ children }: SplitAuthLayoutProps) {
  return <AuthSplitTransitionShell>{children}</AuthSplitTransitionShell>;
}
