import type { Application } from '@/features/applications/types/application.type';

export type EvaluationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type CriterionName =
  | 'SKILLS_MATCH'
  | 'EXPERIENCE_RELEVANCE'
  | 'PROJECT_RELEVANCE'
  | 'EDUCATION_CERTIFICATION'
  | 'KEYWORD_DOMAIN_ALIGNMENT';

export type SkillMatchType = 'MATCHED' | 'MISSING' | 'RELATED';

export type EvaluationCriterionScore = {
  id: string;
  evaluationId: string;
  criterion: CriterionName;
  weight: number;
  scoreNormalized: number;
  reason?: string | null;
  evidence?: unknown;
  createdAt?: string;
};

export type EvaluationSkill = {
  id: string;
  evaluationId: string;
  skillName: string;
  normalizedSkillName?: string | null;
  type: SkillMatchType;
  importance?: string | null;
  evidence?: unknown;
  note?: string | null;
  createdAt?: string;
};

export type EvaluationInterviewQuestion = {
  id: string;
  evaluationId: string;
  question: string;
  category?: string | null;
  linkedSkill?: string | null;
  difficulty?: string | null;
  rationale?: string | null;
  displayOrder?: number | null;
  createdAt?: string;
};

export type EvaluationConfigSummary = {
  id: string;
  name: string;
  isDefault?: boolean;
  totalWeight?: number;
  version?: string | null;
};

export type EvaluationUserSummary = {
  id: string;
  email: string;
  fullName?: string | null;
  role?: string;
};

export type Evaluation = {
  id: string;
  applicationId: string;
  configId?: string | null;
  createdById?: string | null;
  status: EvaluationStatus;
  overallScore?: number | null;
  summary?: string | null;
  explanation?: string | null;
  skillGapSummary?: string | null;
  interviewQuestions?: unknown;
  evidenceMap?: unknown;
  modelProvider?: string | null;
  modelName?: string | null;
  modelVersion?: string | null;
  promptVersion?: string | null;
  evaluationError?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  application?: Application;
  config?: EvaluationConfigSummary | null;
  createdBy?: EvaluationUserSummary | null;
  criterionScores?: EvaluationCriterionScore[];
  skills?: EvaluationSkill[];
  interviewQuestionRows?: EvaluationInterviewQuestion[];
};

export type CreateEvaluationPayload = {
  applicationId: string;
  configId?: string;
  createdById?: string;
};

export type EvaluationQuery = {
  page?: number;
  limit?: number;
  applicationId?: string;
  configId?: string;
  createdById?: string;
  status?: EvaluationStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'startedAt' | 'completedAt' | 'overallScore';
  sortOrder?: 'asc' | 'desc';
};
