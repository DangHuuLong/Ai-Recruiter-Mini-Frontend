import {
  ActivityIcon,
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

export function getNavigationGroups(t: (key: string) => string): NavigationGroup[] {
  return [
    {
      items: [{ label: t('dashboard'), href: ROUTES.DASHBOARD, icon: LayoutDashboardIcon }],
    },
    {
      label: t('groups.recruiting'),
      items: [
        { label: t('candidates'), href: ROUTES.CANDIDATES, icon: UsersIcon },
        { label: t('resumes'), href: ROUTES.RESUMES, icon: FileTextIcon },
        { label: t('jobDescriptions'), href: ROUTES.JOB_DESCRIPTIONS, icon: BriefcaseIcon },
        { label: t('applications'), href: ROUTES.APPLICATIONS, icon: ClipboardListIcon },
        { label: t('evaluations'), href: ROUTES.EVALUATIONS, icon: ClipboardCheckIcon },
        { label: t('batchScoring'), href: ROUTES.BATCH_SCORING, icon: Grid3x3Icon },
        { label: t('evaluationConfigs'), href: ROUTES.EVALUATION_CONFIGS, icon: SlidersHorizontalIcon },
      ],
    },
    {
      label: t('groups.admin'),
      items: [
        { label: t('users'), href: ROUTES.USERS, icon: UserCogIcon },
        { label: t('auditLog'), href: ROUTES.AUDIT_LOG, icon: HistoryIcon },
      ],
    },
    {
      label: t('groups.devTools'),
      items: [
        {
          label: t('interviewQuestions'),
          href: ROUTES.INTERVIEW_QUESTIONS,
          icon: MessageSquareTextIcon,
        },
        {
          label: t('aiActivityLog'),
          href: ROUTES.AI_ACTIVITY_LOG,
          icon: ActivityIcon,
        },
      ],
    },
  ];
}
