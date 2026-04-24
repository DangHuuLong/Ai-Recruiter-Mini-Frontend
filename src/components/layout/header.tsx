export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-header shrink-0 items-center justify-between border-b border-border-default bg-bg-header px-6">
      <div>
        <p className="text-sm font-medium text-text-secondary">
          Recruitment Dashboard
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">Admin</p>
          <p className="text-xs text-text-muted">Recruiter</p>
        </div>

        <div className="flex size-8 items-center justify-center rounded-full bg-bg-muted text-xs font-medium text-text-secondary">
          AD
        </div>
      </div>
    </header>
  );
}