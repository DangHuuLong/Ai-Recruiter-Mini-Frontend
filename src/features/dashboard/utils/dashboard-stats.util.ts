// Composes dashboard data from the real list endpoints of every restored feature module —
// there is no dedicated dashboard/analytics endpoint on the backend (confirmed by auditing
// all controllers), so this aggregates real records client-side instead. Candidates/Job
// Descriptions/Applications/Evaluations are fetched live; Batch Scoring and Audit Log are
// still mocked (not yet restored) so those two stay on their in-memory mock arrays.
import { getCandidates } from '@/features/candidates/api/candidate.api';
import { getJobDescriptions } from '@/features/job-descriptions/api/job-description.api';
import { getApplications } from '@/features/applications/api/application.api';
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '@/features/applications/types/application.type';
import { getEvaluations, getEvaluationSkills } from '@/features/evaluations/api/evaluation.api';
import type { Evaluation } from '@/features/evaluations/types/evaluation.type';
import { MOCK_BATCHES, type MockBatchSummary } from '@/features/batch-scoring/mock/batch-scoring-mock-data';
import { MOCK_AUDIT_LOGS } from '@/features/audit-log/mock/audit-log-mock-data';

export type DashboardKpis = {
  totalCandidates: number;
  // GET /job-descriptions hard-filters isActive: true server-side (no query param can
  // override this, and deactivated JDs also 404 on direct lookup) — so there is no way to
  // know an "including inactive" total. This count is inherently "currently active".
  activeJobDescriptions: number;
  applicationsThisMonth: number;
  applicationsLastMonth: number;
  averageEvaluationScore: number | null;
  completedEvaluationCount: number;
};

export type ApplicationFunnelEntry = {
  status: ApplicationStatus;
  count: number;
};

export type SkillGapEntry = {
  skillName: string;
  missingCount: number;
};

export type DashboardOverviewData = {
  kpis: DashboardKpis;
  funnel: ApplicationFunnelEntry[];
  recentEvaluations: Evaluation[];
  batchesInProgress: MockBatchSummary[];
  skillGap: SkillGapEntry[];
  recentActivity: typeof MOCK_AUDIT_LOGS;
};

// Applications don't have a month-range filter on the backend, so month-over-month counts
// are approximated from the most recently applied-to window rather than the full dataset.
const APPLICATIONS_WINDOW_SIZE = 100;
const RECENT_EVALUATIONS_LIMIT = 3;
const EVALUATIONS_SCORE_WINDOW_SIZE = 20;
const SKILL_GAP_SAMPLE_SIZE = 10;
const SKILL_GAP_TOP_N = 3;

function countApplicationsInMonth(applications: Application[], year: number, month: number): number {
  return applications.filter((application) => {
    const appliedAt = new Date(application.appliedAt);
    return appliedAt.getFullYear() === year && appliedAt.getMonth() === month;
  }).length;
}

async function loadApplicationFunnel(): Promise<ApplicationFunnelEntry[]> {
  const counts = await Promise.all(
    APPLICATION_STATUSES.map(async (status) => {
      const response = await getApplications({ limit: 1, status });
      return { status, count: response.meta.total };
    }),
  );
  return counts;
}

async function loadSkillGapHighlights(recentCompleted: Evaluation[]): Promise<SkillGapEntry[]> {
  const sample = recentCompleted.slice(0, SKILL_GAP_SAMPLE_SIZE);
  const skillLists = await Promise.all(sample.map((evaluation) => getEvaluationSkills(evaluation.id)));

  const counts = new Map<string, number>();
  for (const skills of skillLists) {
    for (const skill of skills) {
      if (skill.type !== 'MISSING') continue;
      counts.set(skill.skillName, (counts.get(skill.skillName) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([skillName, missingCount]) => ({ skillName, missingCount }))
    .sort((a, b) => b.missingCount - a.missingCount)
    .slice(0, SKILL_GAP_TOP_N);
}

export async function loadDashboardOverview(): Promise<DashboardOverviewData> {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);

  const [
    candidatesResponse,
    activeJdResponse,
    applicationsWindowResponse,
    funnel,
    completedEvaluationsResponse,
    recentEvaluationsResponse,
  ] = await Promise.all([
    getCandidates({ limit: 1 }),
    getJobDescriptions({ limit: 1 }),
    getApplications({ limit: APPLICATIONS_WINDOW_SIZE, sortBy: 'appliedAt', sortOrder: 'desc' }),
    loadApplicationFunnel(),
    getEvaluations({
      limit: EVALUATIONS_SCORE_WINDOW_SIZE,
      status: 'COMPLETED',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    getEvaluations({ limit: RECENT_EVALUATIONS_LIMIT, sortBy: 'createdAt', sortOrder: 'desc' }),
  ]);

  const completedScores = completedEvaluationsResponse.data
    .map((evaluation) => evaluation.overallScore)
    .filter((score): score is number => typeof score === 'number');

  const skillGap = await loadSkillGapHighlights(completedEvaluationsResponse.data);

  const kpis: DashboardKpis = {
    totalCandidates: candidatesResponse.meta.total,
    activeJobDescriptions: activeJdResponse.meta.total,
    applicationsThisMonth: countApplicationsInMonth(applicationsWindowResponse.data, currentYear, currentMonth),
    applicationsLastMonth: countApplicationsInMonth(
      applicationsWindowResponse.data,
      lastMonthDate.getFullYear(),
      lastMonthDate.getMonth(),
    ),
    averageEvaluationScore: completedScores.length
      ? Math.round(completedScores.reduce((sum, score) => sum + score, 0) / completedScores.length)
      : null,
    completedEvaluationCount: completedEvaluationsResponse.meta.total,
  };

  const batchesInProgress = MOCK_BATCHES.filter(
    (batch) => batch.status === 'PARSING' || batch.status === 'SCORING',
  );
  const recentActivity = [...MOCK_AUDIT_LOGS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    kpis,
    funnel,
    recentEvaluations: recentEvaluationsResponse.data,
    batchesInProgress,
    skillGap,
    recentActivity,
  };
}
