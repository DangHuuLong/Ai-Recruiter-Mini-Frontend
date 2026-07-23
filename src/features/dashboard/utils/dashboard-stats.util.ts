// Derives dashboard stats from the existing mock datasets of every other feature
// module — there is no dedicated dashboard/analytics endpoint on the backend yet
// (confirmed by auditing all 15 controllers), so this composes real, already-mocked
// records instead of inventing separate placeholder numbers.
import { MOCK_BATCHES, type MockBatchSummary } from '@/features/batch-scoring/mock/batch-scoring-mock-data';
import { MOCK_CANDIDATES } from '@/features/candidates/mock/candidate-mock-data';
import type { Evaluation } from '@/features/evaluations/types/evaluation.type';
import { MOCK_EVALUATIONS } from '@/features/evaluations/mock/evaluation-mock-data';
import { MOCK_JOB_DESCRIPTIONS } from '@/features/job-descriptions/mock/job-description-mock-data';
import { MOCK_APPLICATIONS } from '@/features/applications/mock/application-mock-data';
import type { ApplicationStatus } from '@/features/applications/types/application.type';
import { MOCK_AUDIT_LOGS } from '@/features/audit-log/mock/audit-log-mock-data';

const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  'DRAFT',
  'APPLIED',
  'SCREENING',
  'SHORTLISTED',
  'INTERVIEWING',
  'OFFER',
  'HIRED',
  'REJECTED',
  'WITHDRAWN',
];

export type DashboardKpis = {
  totalCandidates: number;
  activeJobDescriptions: number;
  totalJobDescriptions: number;
  applicationsThisMonth: number;
  applicationsLastMonth: number;
  averageEvaluationScore: number | null;
  completedEvaluationCount: number;
};

export function getDashboardKpis(): DashboardKpis {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);

  const applicationsThisMonth = MOCK_APPLICATIONS.filter((application) => {
    const appliedAt = new Date(application.appliedAt);
    return appliedAt.getMonth() === currentMonth && appliedAt.getFullYear() === currentYear;
  }).length;

  const applicationsLastMonth = MOCK_APPLICATIONS.filter((application) => {
    const appliedAt = new Date(application.appliedAt);
    return appliedAt.getMonth() === lastMonthDate.getMonth() && appliedAt.getFullYear() === lastMonthDate.getFullYear();
  }).length;

  const completedScores = MOCK_EVALUATIONS.filter(
    (evaluation) => evaluation.status === 'COMPLETED' && typeof evaluation.overallScore === 'number',
  ).map((evaluation) => evaluation.overallScore as number);

  return {
    totalCandidates: MOCK_CANDIDATES.length,
    activeJobDescriptions: MOCK_JOB_DESCRIPTIONS.filter((jd) => jd.isActive).length,
    totalJobDescriptions: MOCK_JOB_DESCRIPTIONS.length,
    applicationsThisMonth,
    applicationsLastMonth,
    averageEvaluationScore: completedScores.length
      ? Math.round(completedScores.reduce((sum, score) => sum + score, 0) / completedScores.length)
      : null,
    completedEvaluationCount: completedScores.length,
  };
}

export type ApplicationFunnelEntry = {
  status: ApplicationStatus;
  count: number;
};

export function getApplicationFunnel(): ApplicationFunnelEntry[] {
  return APPLICATION_STATUS_ORDER.map((status) => ({
    status,
    count: MOCK_APPLICATIONS.filter((application) => application.status === status).length,
  }));
}

export function getRecentEvaluations(limit = 3): Evaluation[] {
  return [...MOCK_EVALUATIONS]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, limit);
}

export function getBatchesInProgress(): MockBatchSummary[] {
  return MOCK_BATCHES.filter((batch) => batch.status === 'PARSING' || batch.status === 'SCORING');
}

export type SkillGapEntry = {
  skillName: string;
  missingCount: number;
};

export function getSkillGapHighlights(limit = 3): SkillGapEntry[] {
  const counts = new Map<string, number>();
  for (const evaluation of MOCK_EVALUATIONS) {
    for (const skill of evaluation.skills ?? []) {
      if (skill.type !== 'MISSING') continue;
      counts.set(skill.skillName, (counts.get(skill.skillName) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([skillName, missingCount]) => ({ skillName, missingCount }))
    .sort((a, b) => b.missingCount - a.missingCount)
    .slice(0, limit);
}

export function getRecentActivity(limit = 5) {
  return [...MOCK_AUDIT_LOGS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
