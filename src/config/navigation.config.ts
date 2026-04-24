import { ROUTES } from './routes.config';
import type { NavigationItem } from '@/lib/types/navigation';

export const dashboardNavigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
  },
  {
    label: 'Candidates',
    href: ROUTES.CANDIDATES,
  },
  {
    label: 'Resumes',
    href: ROUTES.RESUMES,
  },
  {
    label: 'Job Descriptions',
    href: ROUTES.JOB_DESCRIPTIONS,
  },
  {
    label: 'Applications',
    href: ROUTES.APPLICATIONS,
  },
  {
    label: 'Evaluations',
    href: ROUTES.EVALUATIONS,
  },
];