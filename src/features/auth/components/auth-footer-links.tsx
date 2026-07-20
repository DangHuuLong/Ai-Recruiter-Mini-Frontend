export function AuthFooterLinks() {
  return (
    <div className="mt-8 flex flex-col items-center gap-2 text-xs text-on-surface-muted">
      <p>© {new Date().getFullYear()} AI Recruiter. All rights reserved.</p>
      <div className="flex items-center gap-3">
        <a href="#" className="hover:text-on-surface-variant">
          Privacy
        </a>
        <span aria-hidden>·</span>
        <a href="#" className="hover:text-on-surface-variant">
          Terms
        </a>
        <span aria-hidden>·</span>
        <a href="#" className="hover:text-on-surface-variant">
          Help
        </a>
      </div>
    </div>
  );
}
