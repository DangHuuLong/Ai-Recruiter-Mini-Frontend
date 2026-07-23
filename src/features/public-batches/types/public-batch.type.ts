import type {
  JobDescriptionInput,
  JobDescriptionStructuredInput,
  ResumeStructuredInput,
  ResumeTextInput,
  ScoringBatchStatus,
  UploadedFileRef,
} from '@/features/batch-scoring/types/batch-scoring.type';

export type CreatePublicBatchPayload = {
  name?: string;
  resumeFiles?: UploadedFileRef[];
  resumeTexts?: ResumeTextInput[];
  resumeStructured?: ResumeStructuredInput[];
  jobDescriptions?: JobDescriptionInput[];
  jobDescriptionFiles?: UploadedFileRef[];
  jobDescriptionStructured?: JobDescriptionStructuredInput[];
  notifyWebhookUrl?: string;
  notifyEmail?: string;
};

export type CreatePublicBatchResult = {
  batchId: string;
  status: ScoringBatchStatus;
  totalCvCount: number;
  totalJdCount: number;
};

export type PublicItemStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export type PublicResumeItem = {
  id: string;
  status: PublicItemStatus;
  candidateLabel?: string | null;
  parsingError?: string | null;
};

export type PublicJdItem = {
  id: string;
  status: PublicItemStatus;
  label?: string | null;
  parsingError?: string | null;
};

export type PublicResultStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type PublicCriterion = {
  criterion: string;
  weight: number;
  scoreNormalized: number;
  reason: string;
  evidence?: unknown;
};

export type PublicSkill = {
  skillName: string;
  normalizedSkillName: string;
  type: 'MATCHED' | 'MISSING' | 'RELATED';
  importance: string;
  evidence: string | null;
  note: string | null;
};

export type PublicInterviewQuestion = {
  question: string;
  category: string;
  linkedSkill: string | null;
  difficulty: string;
  rationale: string;
  displayOrder: number;
};

export type PublicResult = {
  resumeItemId: string;
  jdItemId: string;
  status: PublicResultStatus;
  overallScore?: number | null;
  summary?: string | null;
  criteria?: PublicCriterion[] | null;
  skills?: PublicSkill[] | null;
  interviewQuestions?: PublicInterviewQuestion[] | null;
  error?: string | null;
};

export type PublicBatchProgress = {
  totalCvCount: number;
  totalJdCount: number;
  totalPairCount: number;
  completedPairCount: number;
  failedPairCount: number;
};

export type PublicBatchSnapshot = {
  batchId: string;
  name: string | null;
  status: ScoringBatchStatus;
  progress: PublicBatchProgress;
  startedAt: string | null;
  completedAt: string | null;
  resumeItems: PublicResumeItem[];
  jdItems: PublicJdItem[];
  results: PublicResult[];
};
