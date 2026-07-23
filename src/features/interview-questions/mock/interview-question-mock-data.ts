// Mirrors InterviewQuestionEntry entity + DTOs from Ai-Recruiter-Mini-Backend
// (src/modules/interview-questions/) — read directly from source. All routes DEV-role only.

import type { OccupationFamily } from './interview-question-taxonomy';

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

export type AutonomyLevel =
  | 'WORKS_INDEPENDENTLY'
  | 'LEADS_PROJECTS'
  | 'DEFINES_STRATEGY'
  | 'MANAGES_PEOPLE';

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

export type MockInterviewQuestion = {
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

export const MOCK_INTERVIEW_QUESTIONS: MockInterviewQuestion[] = [
  {
    id: 'iq-1',
    questionText:
      'Walk me through how you would design a caching strategy for a read-heavy product catalog API. What would you cache, where, and how would you handle invalidation?',
    occupationFamily: 'IT',
    specialization: 'Backend',
    enablers: ['Node.js', 'PostgreSQL', 'AWS'],
    businessContext: 'E-commerce',
    competency: 'Caching Strategies',
    competencyType: 'HARD_SKILL',
    assessmentTarget: 'DECISION_MAKING',
    experienceBucket: 'TWO_TO_FOUR',
    autonomyLevel: 'WORKS_INDEPENDENTLY',
    questionType: 'DECISION_MAKING',
    rubric: [
      'Identifies cache-aside vs write-through tradeoffs',
      'Mentions TTL and invalidation strategy',
      'Considers cache stampede / thundering herd',
    ],
    source: 'SEED',
    qualityGateStatus: 'APPROVED',
    usageCount: 42,
    lastUsedAt: '2026-07-15T09:00:00Z',
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z',
  },
  {
    id: 'iq-2',
    questionText:
      'Explain the CAP theorem and give an example of a system that prioritizes availability over consistency.',
    occupationFamily: 'IT',
    specialization: 'Backend',
    enablers: ['PostgreSQL'],
    businessContext: 'Fintech',
    competency: 'Distributed Systems',
    competencyType: 'KNOWLEDGE_AREA',
    assessmentTarget: 'RECALL',
    experienceBucket: 'TWO_TO_FOUR',
    autonomyLevel: 'WORKS_INDEPENDENTLY',
    questionType: 'KNOWLEDGE_CHECK',
    rubric: ['States CAP correctly', 'Gives a concrete real-world example'],
    source: 'SEED',
    qualityGateStatus: 'APPROVED',
    usageCount: 18,
    lastUsedAt: '2026-07-10T09:00:00Z',
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z',
  },
  {
    id: 'iq-3',
    questionText:
      'Your CV mentions a 6-month gap between your last two roles. Can you walk me through what happened during that period?',
    occupationFamily: 'IT',
    specialization: 'Frontend',
    enablers: [],
    businessContext: 'SaaS B2B',
    competency: 'Career Continuity',
    competencyType: 'SOFT_SKILL',
    assessmentTarget: 'COMMUNICATION',
    experienceBucket: 'TWO_TO_FOUR',
    autonomyLevel: 'WORKS_INDEPENDENTLY',
    questionType: 'EXPERIENCE_VALIDATION',
    rubric: ['Gives a clear, consistent explanation', 'No red flags around the story'],
    source: 'AI_GENERATED',
    qualityGateStatus: 'PENDING_REVIEW',
    usageCount: 0,
    lastUsedAt: null,
    createdAt: '2026-07-19T08:00:00Z',
    updatedAt: '2026-07-19T08:00:00Z',
  },
  {
    id: 'iq-4',
    questionText:
      'Describe a time you had to negotiate pricing with a procurement team on an enterprise deal. What was your approach?',
    occupationFamily: 'SALES',
    specialization: 'Enterprise Sales',
    enablers: ['Salesforce', 'SPIN Selling'],
    businessContext: 'Enterprise Deal Closing',
    competency: 'Negotiation',
    competencyType: 'SOFT_SKILL',
    assessmentTarget: 'APPLICATION',
    experienceBucket: 'FIVE_TO_EIGHT',
    autonomyLevel: 'LEADS_PROJECTS',
    questionType: 'BEHAVIORAL_EVIDENCE',
    rubric: [
      'Uses a value-based (not just discount-based) negotiation approach',
      'Describes a concrete outcome',
    ],
    source: 'AI_GENERATED',
    qualityGateStatus: 'PENDING_REVIEW',
    usageCount: 0,
    lastUsedAt: null,
    createdAt: '2026-07-18T08:00:00Z',
    updatedAt: '2026-07-18T08:00:00Z',
  },
  {
    id: 'iq-5',
    questionText:
      'How would you approach an idempotent ETL pipeline that ingests daily transaction files, given files can sometimes arrive twice?',
    occupationFamily: 'DATA',
    specialization: 'Data Engineering',
    enablers: ['Airflow', 'Spark'],
    businessContext: 'Financial Reporting',
    competency: 'Pipeline Idempotency',
    competencyType: 'HARD_SKILL',
    assessmentTarget: 'ANALYSIS',
    experienceBucket: 'FIVE_TO_EIGHT',
    autonomyLevel: 'LEADS_PROJECTS',
    questionType: 'DECISION_MAKING',
    rubric: ['Mentions deduplication key/checksum', 'Discusses replay-safety'],
    source: 'SEED',
    qualityGateStatus: 'APPROVED',
    usageCount: 27,
    lastUsedAt: '2026-07-14T09:00:00Z',
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z',
  },
  {
    id: 'iq-6',
    questionText:
      'This project listed on your resume looks purely academic. Can you tell me which parts you personally implemented versus your teammates?',
    occupationFamily: 'IT',
    specialization: 'Mobile',
    enablers: ['Flutter'],
    businessContext: 'IoT',
    competency: 'Ownership Verification',
    competencyType: 'SOFT_SKILL',
    assessmentTarget: 'OWNERSHIP',
    experienceBucket: 'ZERO_TO_ONE',
    autonomyLevel: 'WORKS_INDEPENDENTLY',
    questionType: 'ARTIFACT_DISCUSSION',
    rubric: ['Can specifically explain their own contribution', 'Demonstrates real hands-on understanding'],
    source: 'SEED',
    qualityGateStatus: 'REJECTED',
    usageCount: 3,
    lastUsedAt: '2026-06-01T09:00:00Z',
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-06-15T08:00:00Z',
  },
];

export function getMockInterviewQuestion(id: string): MockInterviewQuestion | null {
  return MOCK_INTERVIEW_QUESTIONS.find((q) => q.id === id) ?? null;
}

let mockInterviewQuestionSequence = MOCK_INTERVIEW_QUESTIONS.length;

export function nextMockInterviewQuestionId(): string {
  mockInterviewQuestionSequence += 1;
  return `iq-${mockInterviewQuestionSequence}`;
}
