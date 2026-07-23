import type { OccupationFamily } from './interview-question-taxonomy.type';

export type CompetencyType =
  | 'HARD_SKILL'
  | 'TOOL_SKILL'
  | 'KNOWLEDGE_AREA'
  | 'SOFT_SKILL'
  | 'METHODOLOGY'
  | 'COMPLIANCE';

export const COMPETENCY_TYPE_LABELS: Record<CompetencyType, string> = {
  HARD_SKILL: 'Hard Skill',
  TOOL_SKILL: 'Tool Skill',
  KNOWLEDGE_AREA: 'Knowledge Area',
  SOFT_SKILL: 'Soft Skill',
  METHODOLOGY: 'Methodology',
  COMPLIANCE: 'Compliance',
};

export type AssessmentTarget =
  | 'RECALL'
  | 'APPLICATION'
  | 'ANALYSIS'
  | 'DECISION_MAKING'
  | 'COMMUNICATION'
  | 'LEADERSHIP'
  | 'OWNERSHIP';

export const ASSESSMENT_TARGET_LABELS: Record<AssessmentTarget, string> = {
  RECALL: 'Recall',
  APPLICATION: 'Application',
  ANALYSIS: 'Analysis',
  DECISION_MAKING: 'Decision Making',
  COMMUNICATION: 'Communication',
  LEADERSHIP: 'Leadership',
  OWNERSHIP: 'Ownership',
};

export type ExperienceBucket = 'ZERO_TO_ONE' | 'TWO_TO_FOUR' | 'FIVE_TO_EIGHT' | 'EIGHT_PLUS';

export const EXPERIENCE_BUCKET_LABELS: Record<ExperienceBucket, string> = {
  ZERO_TO_ONE: '0-1 years',
  TWO_TO_FOUR: '2-4 years',
  FIVE_TO_EIGHT: '5-8 years',
  EIGHT_PLUS: '8+ years',
};

export type AutonomyLevel = 'WORKS_INDEPENDENTLY' | 'LEADS_PROJECTS' | 'DEFINES_STRATEGY' | 'MANAGES_PEOPLE';

export const AUTONOMY_LEVEL_LABELS: Record<AutonomyLevel, string> = {
  WORKS_INDEPENDENTLY: 'Works independently',
  LEADS_PROJECTS: 'Leads projects',
  DEFINES_STRATEGY: 'Defines strategy',
  MANAGES_PEOPLE: 'Manages people',
};

export type InterviewQuestionType =
  | 'EXPERIENCE_VALIDATION'
  | 'ARTIFACT_DISCUSSION'
  | 'DECISION_MAKING'
  | 'BEHAVIORAL_EVIDENCE'
  | 'REFLECTION'
  | 'KNOWLEDGE_CHECK';

export const QUESTION_TYPE_LABELS: Record<InterviewQuestionType, string> = {
  EXPERIENCE_VALIDATION: 'Experience Validation',
  ARTIFACT_DISCUSSION: 'Artifact Discussion',
  DECISION_MAKING: 'Decision Making',
  BEHAVIORAL_EVIDENCE: 'Behavioral Evidence',
  REFLECTION: 'Reflection',
  KNOWLEDGE_CHECK: 'Knowledge Check',
};

export type InterviewQuestionSource = 'SEED' | 'AI_GENERATED';

export const SOURCE_LABELS: Record<InterviewQuestionSource, string> = {
  SEED: 'Seed',
  AI_GENERATED: 'AI Generated',
};

export type QuestionQualityGateStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export const QUALITY_GATE_LABELS: Record<QuestionQualityGateStatus, string> = {
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const QUALITY_GATE_CLASSES: Record<QuestionQualityGateStatus, string> = {
  PENDING_REVIEW: 'bg-warning-container text-on-surface',
  APPROVED: 'bg-success-container text-success',
  REJECTED: 'bg-error-container text-error',
};

export type InterviewQuestion = {
  id: string;
  questionText: string;
  occupationFamily: OccupationFamily;
  specialization: string;
  enablers: string[];
  businessContext: string;
  competency: string;
  competencyType: CompetencyType;
  assessmentTarget: AssessmentTarget;
  experienceBucket: ExperienceBucket;
  autonomyLevel: AutonomyLevel;
  questionType: InterviewQuestionType;
  rubric: string[];
  source: InterviewQuestionSource;
  qualityGateStatus: QuestionQualityGateStatus;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// The backend has no "source" filter and no sort override at all (findAll always orders
// createdAt desc) — only occupationFamily/questionType/qualityGateStatus + pagination.
export type InterviewQuestionQuery = {
  page?: number;
  limit?: number;
  occupationFamily?: OccupationFamily;
  questionType?: InterviewQuestionType;
  qualityGateStatus?: QuestionQualityGateStatus;
};

export type CreateInterviewQuestionPayload = {
  questionText: string;
  occupationFamily: OccupationFamily;
  specialization: string;
  enablers: string[];
  businessContext: string;
  competency: string;
  competencyType: CompetencyType;
  assessmentTarget: AssessmentTarget;
  experienceBucket: ExperienceBucket;
  autonomyLevel: AutonomyLevel;
  questionType: InterviewQuestionType;
  rubric: string[];
  source?: InterviewQuestionSource;
  qualityGateStatus?: QuestionQualityGateStatus;
};

export type UpdateInterviewQuestionPayload = Partial<CreateInterviewQuestionPayload>;

export type BulkCreateResultItem =
  | { index: number; success: true; data: InterviewQuestion }
  | { index: number; success: false; error: string };

export type SearchInterviewQuestionsPayload = {
  queryText: string;
  occupationFamily: OccupationFamily;
  specialization: string;
  enablers?: string[];
  limit?: number;
};

export type SearchResultRow = {
  id: string;
  questionText: string;
  specialization: string;
  businessContext: string;
  competency: string;
  competencyType: string;
  assessmentTarget: string;
  experienceBucket: string;
  autonomyLevel: string;
  questionType: string;
  rubric: string[];
  similarity: number;
};

export type SearchOrGenerateResult = {
  existing: SearchResultRow[];
  generated: InterviewQuestion[];
};

export type DeleteInterviewQuestionResult = {
  id: string;
  deleted: boolean;
};
