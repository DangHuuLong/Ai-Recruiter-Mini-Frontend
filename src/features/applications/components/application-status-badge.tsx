import type { ApplicationStatus } from '@/features/applications/types/application.type';

const statusClassName: Record<ApplicationStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-700 ring-slate-200',
  APPLIED: 'bg-blue-50 text-blue-700 ring-blue-200',
  SCREENING: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  SHORTLISTED: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  INTERVIEWING: 'bg-purple-50 text-purple-700 ring-purple-200',
  OFFER: 'bg-amber-50 text-amber-700 ring-amber-200',
  HIRED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-200',
  WITHDRAWN: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
};

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus;
};

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClassName[status]}`}
    >
      {status.replaceAll('_', ' ')}
    </span>
  );
}
