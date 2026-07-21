// Mirrors GET /scoring-batches/:id, /:id/matrix, /:id/cells/:resumeItemId/:jdItemId,
// /:id/skill-gap-summary shapes read directly from Ai-Recruiter-Mini-Backend
// (scoring-batches.service.ts + ScoringResultMapperService).
//
// Known gap: the backend has no "list all batches" endpoint yet (only GET /:id by id) —
// the list page below is mocked ahead of that endpoint existing. See PLAN1.md.

export type ScoringBatchStatus =
  | 'PENDING'
  | 'PARSING'
  | 'SCORING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'CANCELLED';

export type CriterionName =
  | 'SKILLS_MATCH'
  | 'EXPERIENCE_RELEVANCE'
  | 'PROJECT_RELEVANCE'
  | 'EDUCATION_CERTIFICATION'
  | 'KEYWORD_DOMAIN_ALIGNMENT';

export type SkillMatchType = 'MATCHED' | 'MISSING' | 'RELATED';
export type SkillImportance = 'LOW' | 'MEDIUM' | 'HIGH';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export const CRITERION_LABELS: Record<CriterionName, string> = {
  SKILLS_MATCH: 'Skills Match',
  EXPERIENCE_RELEVANCE: 'Experience Relevance',
  PROJECT_RELEVANCE: 'Project Relevance',
  EDUCATION_CERTIFICATION: 'Education/Certification',
  KEYWORD_DOMAIN_ALIGNMENT: 'Keyword/Domain Alignment',
};

const CRITERIA_WEIGHTS: Record<CriterionName, number> = {
  SKILLS_MATCH: 0.4,
  EXPERIENCE_RELEVANCE: 0.3,
  PROJECT_RELEVANCE: 0.15,
  EDUCATION_CERTIFICATION: 0.1,
  KEYWORD_DOMAIN_ALIGNMENT: 0.05,
};

export type MockBatchSummary = {
  id: string;
  name: string;
  status: ScoringBatchStatus;
  totalCvCount: number;
  totalJdCount: number;
  totalPairCount: number;
  completedPairCount: number;
  failedPairCount: number;
  createdAt: string;
};

export const MOCK_BATCHES: MockBatchSummary[] = [
  {
    id: 'batch-1',
    name: 'Q3 Backend hiring',
    status: 'COMPLETED',
    totalCvCount: 6,
    totalJdCount: 3,
    totalPairCount: 18,
    completedPairCount: 18,
    failedPairCount: 0,
    createdAt: '2026-07-14T09:12:00Z',
  },
  {
    id: 'batch-2',
    name: 'Design team expansion',
    status: 'COMPLETED_WITH_ERRORS',
    totalCvCount: 5,
    totalJdCount: 2,
    totalPairCount: 10,
    completedPairCount: 9,
    failedPairCount: 1,
    createdAt: '2026-07-16T14:40:00Z',
  },
  {
    id: 'batch-3',
    name: 'Senior Data roles',
    status: 'SCORING',
    totalCvCount: 8,
    totalJdCount: 4,
    totalPairCount: 32,
    completedPairCount: 21,
    failedPairCount: 0,
    createdAt: '2026-07-19T08:05:00Z',
  },
  {
    id: 'batch-4',
    name: 'Contract QA screen',
    status: 'PARSING',
    totalCvCount: 3,
    totalJdCount: 1,
    totalPairCount: 3,
    completedPairCount: 0,
    failedPairCount: 0,
    createdAt: '2026-07-20T10:22:00Z',
  },
  {
    id: 'batch-5',
    name: 'Product Manager pipeline',
    status: 'FAILED',
    totalCvCount: 4,
    totalJdCount: 2,
    totalPairCount: 8,
    completedPairCount: 0,
    failedPairCount: 0,
    createdAt: '2026-07-10T11:00:00Z',
  },
];

export function getMockBatch(id: string): MockBatchSummary | null {
  return MOCK_BATCHES.find((batch) => batch.id === id) ?? null;
}

export type MockMatrixRow = {
  resumeItemId: string;
  fileName: string | null;
  candidateLabel: string | null;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  parsingError: string | null;
};

export type MockMatrixColumn = {
  id: string;
  label: string | null;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  parsingError: string | null;
};

export type MockMatrixCell = {
  resumeItemId: string;
  jdItemId: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  overallScore: number | null;
  error: string | null;
};

export type MockMatrix = {
  rows: MockMatrixRow[];
  columns: MockMatrixColumn[];
  cells: MockMatrixCell[];
};

const CANDIDATE_NAMES = [
  'Alex Johnson',
  'Priya Sharma',
  'Marcus Lee',
  'Nora Kim',
  'Ethan Brooks',
  'Sofia Rivera',
  'Daniel Ho',
  'Linh Tran',
];

const JD_TITLES = [
  'Senior Backend Engineer',
  'Product Designer',
  'Data Analyst',
  'Engineering Manager',
];

export function getMockMatrix(batch: MockBatchSummary): MockMatrix {
  const rows: MockMatrixRow[] = Array.from({ length: batch.totalCvCount }, (_, i) => ({
    resumeItemId: `${batch.id}-r${i + 1}`,
    fileName: `resume-${i + 1}.pdf`,
    candidateLabel: CANDIDATE_NAMES[i % CANDIDATE_NAMES.length],
    status: batch.status === 'FAILED' ? 'PENDING' : 'SUCCESS',
    parsingError: null,
  }));

  const columns: MockMatrixColumn[] = Array.from({ length: batch.totalJdCount }, (_, i) => ({
    id: `${batch.id}-jd${i + 1}`,
    label: JD_TITLES[i % JD_TITLES.length],
    status: batch.status === 'FAILED' ? 'PENDING' : 'SUCCESS',
    parsingError: null,
  }));

  const cells: MockMatrixCell[] = [];
  let pairIndex = 0;
  for (const row of rows) {
    for (const column of columns) {
      pairIndex += 1;
      const isCompleted = pairIndex <= batch.completedPairCount;
      const isFailedPair =
        batch.failedPairCount > 0 && pairIndex === batch.completedPairCount + 1;

      cells.push({
        resumeItemId: row.resumeItemId,
        jdItemId: column.id,
        status: isFailedPair ? 'FAILED' : isCompleted ? 'COMPLETED' : 'PENDING',
        overallScore: isCompleted ? 35 + ((pairIndex * 13) % 65) : null,
        error: isFailedPair ? 'AI service timeout while scoring this pair.' : null,
      });
    }
  }

  return { rows, columns, cells };
}

export type MockCriterion = {
  criterion: CriterionName;
  weight: number;
  scoreNormalized: number;
  reason: string;
};

export type MockSkill = {
  skillName: string;
  normalizedSkillName: string;
  type: SkillMatchType;
  importance: SkillImportance;
  evidence: string | null;
  note: string | null;
};

export type MockInterviewQuestion = {
  question: string;
  category: string;
  linkedSkill: string | null;
  difficulty: QuestionDifficulty;
  rationale: string;
  displayOrder: number;
};

export type MockCellDetail = {
  resumeItemId: string;
  jdItemId: string;
  overallScore: number;
  summary: string;
  criteria: MockCriterion[];
  skills: MockSkill[];
  interviewQuestions: MockInterviewQuestion[];
};

export function getMockCellDetail(score: number): MockCellDetail {
  const normalized = score / 100;
  const isStrongMatch = score >= 70;

  const criteria: MockCriterion[] = (Object.keys(CRITERIA_WEIGHTS) as CriterionName[]).map(
    (criterion, index) => ({
      criterion,
      weight: CRITERIA_WEIGHTS[criterion],
      scoreNormalized: Math.max(0.1, Math.min(1, normalized + (index % 2 === 0 ? 0.05 : -0.08))),
      reason: `${CRITERION_LABELS[criterion]} assessed against the job description requirements.`,
    }),
  );

  const skills: MockSkill[] = isStrongMatch
    ? [
        { skillName: 'TypeScript', normalizedSkillName: 'typescript', type: 'MATCHED', importance: 'HIGH', evidence: 'Used across 3 listed projects.', note: null },
        { skillName: 'React', normalizedSkillName: 'react', type: 'MATCHED', importance: 'HIGH', evidence: 'Primary frontend framework in most recent role.', note: null },
        { skillName: 'Kubernetes', normalizedSkillName: 'kubernetes', type: 'MISSING', importance: 'MEDIUM', evidence: null, note: 'Not mentioned anywhere in the resume.' },
      ]
    : [
        { skillName: 'Communication', normalizedSkillName: 'communication', type: 'RELATED', importance: 'MEDIUM', evidence: 'Inferred from team collaboration mentions.', note: null },
        { skillName: 'SQL', normalizedSkillName: 'sql', type: 'MISSING', importance: 'HIGH', evidence: null, note: 'Required skill not found in resume.' },
      ];

  const interviewQuestions: MockInterviewQuestion[] = [
    {
      question: 'Walk me through a recent project most similar to this role.',
      category: 'Experience Relevance',
      linkedSkill: null,
      difficulty: 'MEDIUM',
      rationale: 'Validates hands-on experience relevant to this JD.',
      displayOrder: 1,
    },
    {
      question: 'How would you approach learning a tool you have never used before?',
      category: 'Skill Gap',
      linkedSkill: isStrongMatch ? 'Kubernetes' : 'SQL',
      difficulty: 'EASY',
      rationale: 'Probes how the candidate handles a known missing skill.',
      displayOrder: 2,
    },
  ];

  return {
    resumeItemId: '',
    jdItemId: '',
    overallScore: score,
    summary: isStrongMatch
      ? 'Strong alignment with the core requirements of this role.'
      : 'Partial alignment — some core requirements are not clearly evidenced.',
    criteria,
    skills,
    interviewQuestions,
  };
}

export type ScoreTier = {
  label: 'Excellent' | 'Strong' | 'Moderate' | 'Weak' | 'Poor';
  containerClass: string;
  textClass: string;
};

export function getScoreTier(score: number): ScoreTier {
  if (score >= 85) return { label: 'Excellent', containerClass: 'bg-emerald-100', textClass: 'text-emerald-700' };
  if (score >= 70) return { label: 'Strong', containerClass: 'bg-lime-100', textClass: 'text-lime-700' };
  if (score >= 55) return { label: 'Moderate', containerClass: 'bg-amber-100', textClass: 'text-amber-700' };
  if (score >= 40) return { label: 'Weak', containerClass: 'bg-orange-100', textClass: 'text-orange-700' };
  return { label: 'Poor', containerClass: 'bg-red-100', textClass: 'text-red-700' };
}

export type MockSkillGapEntry = {
  skillName: string;
  missingCount: number;
};

export function getMockSkillGap(batch: MockBatchSummary): MockSkillGapEntry[] {
  return [
    { skillName: 'Kubernetes', missingCount: Math.max(1, Math.round(batch.totalCvCount * 0.6)) },
    { skillName: 'GraphQL', missingCount: Math.max(1, Math.round(batch.totalCvCount * 0.45)) },
    { skillName: 'System Design', missingCount: Math.max(1, Math.round(batch.totalCvCount * 0.35)) },
    { skillName: 'CI/CD', missingCount: Math.max(1, Math.round(batch.totalCvCount * 0.25)) },
  ].sort((a, b) => b.missingCount - a.missingCount);
}

export const STATUS_LABELS: Record<ScoringBatchStatus, string> = {
  PENDING: 'Pending',
  PARSING: 'Parsing',
  SCORING: 'Scoring',
  COMPLETED: 'Completed',
  COMPLETED_WITH_ERRORS: 'Completed with errors',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

export const STATUS_CLASSES: Record<ScoringBatchStatus, string> = {
  PENDING: 'bg-surface-variant text-on-surface-muted',
  PARSING: 'bg-info/15 text-info',
  SCORING: 'bg-info/15 text-info',
  COMPLETED: 'bg-success-container text-success',
  COMPLETED_WITH_ERRORS: 'bg-warning-container text-on-surface',
  FAILED: 'bg-error-container text-error',
  CANCELLED: 'bg-surface-variant text-on-surface-muted',
};
