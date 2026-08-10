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

// Maps each value to the message key under interviewQuestions.labels.competencyType —
// pass to t('labels.competencyType.' + COMPETENCY_TYPE_LABEL_KEYS[type]).
export const COMPETENCY_TYPE_LABEL_KEYS: Record<CompetencyType, string> = {
  HARD_SKILL: 'hardSkill',
  TOOL_SKILL: 'toolSkill',
  KNOWLEDGE_AREA: 'knowledgeArea',
  SOFT_SKILL: 'softSkill',
  METHODOLOGY: 'methodology',
  COMPLIANCE: 'compliance',
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

// Maps each value to the message key under interviewQuestions.labels.assessmentTarget —
// pass to t('labels.assessmentTarget.' + ASSESSMENT_TARGET_LABEL_KEYS[target]).
export const ASSESSMENT_TARGET_LABEL_KEYS: Record<AssessmentTarget, string> = {
  RECALL: 'recall',
  APPLICATION: 'application',
  ANALYSIS: 'analysis',
  DECISION_MAKING: 'decisionMaking',
  COMMUNICATION: 'communication',
  LEADERSHIP: 'leadership',
  OWNERSHIP: 'ownership',
};

export type ExperienceBucket = 'ZERO_TO_ONE' | 'TWO_TO_FOUR' | 'FIVE_TO_EIGHT' | 'EIGHT_PLUS';

export const EXPERIENCE_BUCKET_LABELS: Record<ExperienceBucket, string> = {
  ZERO_TO_ONE: '0-1 years',
  TWO_TO_FOUR: '2-4 years',
  FIVE_TO_EIGHT: '5-8 years',
  EIGHT_PLUS: '8+ years',
};

// Maps each value to the message key under interviewQuestions.labels.experienceBucket —
// pass to t('labels.experienceBucket.' + EXPERIENCE_BUCKET_LABEL_KEYS[bucket]).
export const EXPERIENCE_BUCKET_LABEL_KEYS: Record<ExperienceBucket, string> = {
  ZERO_TO_ONE: 'zeroToOne',
  TWO_TO_FOUR: 'twoToFour',
  FIVE_TO_EIGHT: 'fiveToEight',
  EIGHT_PLUS: 'eightPlus',
};

export type AutonomyLevel = 'WORKS_INDEPENDENTLY' | 'LEADS_PROJECTS' | 'DEFINES_STRATEGY' | 'MANAGES_PEOPLE';

export const AUTONOMY_LEVEL_LABELS: Record<AutonomyLevel, string> = {
  WORKS_INDEPENDENTLY: 'Works independently',
  LEADS_PROJECTS: 'Leads projects',
  DEFINES_STRATEGY: 'Defines strategy',
  MANAGES_PEOPLE: 'Manages people',
};

// Maps each value to the message key under interviewQuestions.labels.autonomyLevel —
// pass to t('labels.autonomyLevel.' + AUTONOMY_LEVEL_LABEL_KEYS[level]).
export const AUTONOMY_LEVEL_LABEL_KEYS: Record<AutonomyLevel, string> = {
  WORKS_INDEPENDENTLY: 'worksIndependently',
  LEADS_PROJECTS: 'leadsProjects',
  DEFINES_STRATEGY: 'definesStrategy',
  MANAGES_PEOPLE: 'managesPeople',
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

// Maps each value to the message key under interviewQuestions.labels.questionType —
// pass to t('labels.questionType.' + QUESTION_TYPE_LABEL_KEYS[type]).
export const QUESTION_TYPE_LABEL_KEYS: Record<InterviewQuestionType, string> = {
  EXPERIENCE_VALIDATION: 'experienceValidation',
  ARTIFACT_DISCUSSION: 'artifactDiscussion',
  DECISION_MAKING: 'decisionMaking',
  BEHAVIORAL_EVIDENCE: 'behavioralEvidence',
  REFLECTION: 'reflection',
  KNOWLEDGE_CHECK: 'knowledgeCheck',
};

export type InterviewQuestionSource = 'SEED' | 'AI_GENERATED';

export const SOURCE_LABELS: Record<InterviewQuestionSource, string> = {
  SEED: 'Seed',
  AI_GENERATED: 'AI Generated',
};

// Maps each value to the message key under interviewQuestions.labels.source —
// pass to t('labels.source.' + SOURCE_LABEL_KEYS[source]).
export const SOURCE_LABEL_KEYS: Record<InterviewQuestionSource, string> = {
  SEED: 'seed',
  AI_GENERATED: 'aiGenerated',
};

export type QuestionQualityGateStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export const QUALITY_GATE_LABELS: Record<QuestionQualityGateStatus, string> = {
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

// Maps each value to the message key under interviewQuestions.labels.qualityGate —
// pass to t('labels.qualityGate.' + QUALITY_GATE_LABEL_KEYS[status]).
export const QUALITY_GATE_LABEL_KEYS: Record<QuestionQualityGateStatus, string> = {
  PENDING_REVIEW: 'pendingReview',
  APPROVED: 'approved',
  REJECTED: 'rejected',
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
