export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-8">
        <div>
          <h1 className="text-base font-semibold text-slate-950">
            Recruitment Dashboard
          </h1>

          <p className="mt-0.5 text-sm text-slate-500">
            Manage your hiring workflow from one workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">Admin</p>
            <p className="text-xs text-slate-500">Recruiter</p>
          </div>

          <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            AD
          </div>
        </div>
      </div>
    </header>
  );
} 