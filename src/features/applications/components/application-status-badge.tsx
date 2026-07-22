import type { ApplicationStatus } from '@/features/applications/types/application.type';

const statusClassName: Record<ApplicationStatus, string> = {
  DRAFT: 'bg-surface-variant text-on-surface-variant',
  APPLIED: 'bg-primary-container text-on-primary-container',
  SCREENING: 'bg-primary-container text-on-primary-container',
  SHORTLISTED: 'bg-info/15 text-info',
  INTERVIEWING: 'bg-info/15 text-info',
  OFFER: 'bg-warning-container text-on-surface',
  HIRED: 'bg-success-container text-success',
  REJECTED: 'bg-error-container text-error',
  WITHDRAWN: 'bg-surface-variant text-on-surface-muted',
};

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus;
};

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName[status]}`}
    >
      {status.replaceAll('_', ' ')}
    </span>
  );
}
