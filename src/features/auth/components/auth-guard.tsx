type AuthGuardProps = {
  children: React.ReactNode;
};

// Redirect-to-login check disabled while auth API calls are mocked — see docs/auth-mock-todo.md
export function AuthGuard({ children }: AuthGuardProps) {
  return <>{children}</>;
}
