import {
  BriefcaseIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  FileTextIcon,
  Grid3x3Icon,
  HistoryIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  SlidersHorizontalIcon,
  UserCogIcon,
  UsersIcon,
} from 'lucide-react';

import { ROUTES } from './routes.config';
import type { NavigationGroup } from '@/lib/types/navigation';

export const navigationGroups: NavigationGroup[] = [
  {
    items: [{ label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboardIcon }],
  },
  {
    label: 'Recruiting',
    items: [
      { label: 'Candidates', href: ROUTES.CANDIDATES, icon: UsersIcon },
      { label: 'Resumes', href: ROUTES.RESUMES, icon: FileTextIcon },
      { label: 'Job Descriptions', href: ROUTES.JOB_DESCRIPTIONS, icon: BriefcaseIcon },
      { label: 'Applications', href: ROUTES.APPLICATIONS, icon: ClipboardListIcon },
      { label: 'Evaluations', href: ROUTES.EVALUATIONS, icon: ClipboardCheckIcon },
      { label: 'Batch Scoring', href: ROUTES.BATCH_SCORING, icon: Grid3x3Icon },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Evaluation Configs', href: ROUTES.EVALUATION_CONFIGS, icon: SlidersHorizontalIcon },
      { label: 'Users', href: ROUTES.USERS, icon: UserCogIcon },
      { label: 'Audit Log', href: ROUTES.AUDIT_LOG, icon: HistoryIcon },
    ],
  },
  {
    label: 'Dev Tools',
    items: [
      {
        label: 'Interview Question Bank',
        href: ROUTES.INTERVIEW_QUESTIONS,
        icon: MessageSquareTextIcon,
      },
    ],
  },
];
