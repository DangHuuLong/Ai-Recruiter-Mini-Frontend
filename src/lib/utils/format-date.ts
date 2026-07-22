// Locale is pinned explicitly (not the runtime default) so server-rendered and
// client-rendered output always match — an unpinned locale causes hydration mismatches
// when the server and browser resolve `Intl` defaults differently.

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
