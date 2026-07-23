export type ScoringBatchStatus =
  | 'PENDING'
  | 'PARSING'
  | 'SCORING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'CANCELLED';

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

export type CriterionName =
  | 'SKILLS_MATCH'
  | 'EXPERIENCE_RELEVANCE'
  | 'PROJECT_RELEVANCE'
  | 'EDUCATION_CERTIFICATION'
  | 'KEYWORD_DOMAIN_ALIGNMENT';

export const CRITERION_LABELS: Record<CriterionName, string> = {
  SKILLS_MATCH: 'Skills Match',
  EXPERIENCE_RELEVANCE: 'Experience Relevance',
  PROJECT_RELEVANCE: 'Project Relevance',
  EDUCATION_CERTIFICATION: 'Education/Certification',
  KEYWORD_DOMAIN_ALIGNMENT: 'Keyword/Domain Alignment',
};

export type ScoringBatchSummary = {
  id: string;
  name: string | null;
  status: ScoringBatchStatus;
  totalCvCount: number;
  totalJdCount: number;
  totalPairCount: number;
  completedPairCount: number;
  failedPairCount: number;
  createdAt: string;
};

export type ScoringBatchQuery = {
  page?: number;
  limit?: number;
  status?: ScoringBatchStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
};

// --- Upload ---

export type UploadUrlFileRequest = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
};

export type UploadUrlResult = {
  fileKey: string;
  fileName: string;
  signedUploadUrl: string;
  expiresIn: number;
};

export type UploadedFileRef = {
  fileKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  checksum?: string;
};

// --- Create batch ---

export type ResumeTextInput = { label?: string; rawText: string };

export type ResumeStructuredPersonal = {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
};

export type ResumeStructuredSkill = {
  name: string;
  category?: string;
  level?: string;
  evidence?: string;
};

export type ResumeStructuredEducation = {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
  gpa?: string;
  gpaScale?: string;
  description?: string;
};

export type ResumeStructuredExperience = {
  company?: string;
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  durationMonths?: number;
  responsibilities?: string[];
  technologies?: string[];
};

export type ResumeStructuredProject = {
  name?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  technologies?: string[];
  urls?: string[];
};

export type ResumeStructuredCertification = {
  name?: string;
  issuer?: string;
  issuedYear?: number;
  url?: string;
};

export type ResumeStructuredAchievement = {
  title?: string;
  description?: string;
  year?: number;
};

export type ResumeStructuredLanguage = { name: string; proficiency?: string };

export type ResumeStructuredInput = {
  label?: string;
  personal?: ResumeStructuredPersonal;
  summary?: string;
  skills?: ResumeStructuredSkill[];
  education?: ResumeStructuredEducation[];
  experience?: ResumeStructuredExperience[];
  projects?: ResumeStructuredProject[];
  certifications?: ResumeStructuredCertification[];
  achievements?: ResumeStructuredAchievement[];
  languages?: ResumeStructuredLanguage[];
};

export type JobDescriptionInput = { label?: string; rawText: string };

export type JobDescriptionStructuredSkill = {
  name: string;
  isCore?: boolean;
  weightHint?: number;
};

export type JobDescriptionStructuredInput = {
  label?: string;
  title?: string;
  seniority?: string;
  employmentType?: string;
  responsibilities?: string[];
  requirements?: string[];
  niceToHave?: string[];
  requiredSkills?: JobDescriptionStructuredSkill[];
  preferredSkills?: JobDescriptionStructuredSkill[];
  minExperienceYears?: number;
  educationRequirement?: string;
  domainKeywords?: string[];
};

export type CreateScoringBatchPayload = {
  name?: string;
  resumeFiles?: UploadedFileRef[];
  resumeTexts?: ResumeTextInput[];
  resumeStructured?: ResumeStructuredInput[];
  jobDescriptions?: JobDescriptionInput[];
  jobDescriptionFiles?: UploadedFileRef[];
  jobDescriptionStructured?: JobDescriptionStructuredInput[];
  evaluationConfigId?: string;
  notifyWebhookUrl?: string;
  notifyEmail?: string;
};

export type CreateScoringBatchResult = {
  batchId: string;
  status: ScoringBatchStatus;
  totalCvCount: number;
  totalJdCount: number;
};

// --- Status / matrix / cell / skill-gap ---

export type BatchProgress = {
  totalCvCount: number;
  totalJdCount: number;
  totalPairCount: number;
  completedPairCount: number;
  failedPairCount: number;
  percent: number;
};

export type BatchStatusResult = {
  batchId: string;
  name: string | null;
  status: ScoringBatchStatus;
  progress: BatchProgress;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type ItemParseStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export type MatrixRow = {
  resumeItemId: string;
  fileName: string | null;
  candidateName: string | null;
  parseStatus: ItemParseStatus;
  parseError: string | null;
  topJds?: { jdItemId: string; score: number | null }[];
};

export type MatrixColumn = {
  jdItemId: string;
  label: string | null;
  parseStatus: ItemParseStatus;
  parseError: string | null;
  topCvs?: { resumeItemId: string; score: number | null }[];
};

export type MatrixCellStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type MatrixCell = {
  resumeItemId: string;
  jdItemId: string;
  status: MatrixCellStatus;
  overallScore: number | null;
  error: string | null;
};

export type BatchMatrix = {
  batchId: string;
  status: ScoringBatchStatus;
  progress: BatchProgress;
  rows: MatrixRow[];
  columns: MatrixColumn[];
  cells: MatrixCell[];
  nextCursor: string | null;
};

export type MatrixQuery = {
  cursor?: string;
  limit?: number;
  topN?: number;
};

export type CellCriterion = {
  criterion: CriterionName;
  weight: number;
  scoreNormalized: number;
  reason: string;
  evidence: unknown;
};

export type CellSkill = {
  skillName: string;
  normalizedSkillName: string;
  type: 'MATCHED' | 'MISSING' | 'RELATED';
  importance: string;
  evidence: string | null;
  note: string | null;
};

export type CellInterviewQuestion = {
  question: string;
  category: string;
  linkedSkill: string | null;
  difficulty: string;
  rationale: string;
  displayOrder: number;
};

export type CellDetail = {
  id: string;
  batchId: string;
  resumeItemId: string;
  jdItemId: string;
  status: MatrixCellStatus;
  overallScore: number | null;
  summary: string | null;
  criteria: CellCriterion[] | null;
  skills: CellSkill[] | null;
  interviewQuestions: CellInterviewQuestion[] | null;
  error: string | null;
};

export type SkillGapEntry = { skillName: string; missingCount: number };

export type SkillGapSummary = {
  batchId: string;
  totalResultsConsidered: number;
  missingSkills: SkillGapEntry[];
};

export type CancelBatchResult = { batchId: string; status: 'CANCELLED' };

export type PromoteBatchItem = { resumeItemId: string; jdItemId?: string };

export type PromoteBatchItemResult = {
  resumeItemId: string;
  candidateId: string;
  resumeId: string;
  jdItemId?: string;
  jobDescriptionId?: string;
  applicationId?: string;
  evaluationId?: string;
};

export function getScoreTier(score: number) {
  if (score >= 85) return { label: 'Excellent', containerClass: 'bg-emerald-100', textClass: 'text-emerald-700' };
  if (score >= 70) return { label: 'Strong', containerClass: 'bg-lime-100', textClass: 'text-lime-700' };
  if (score >= 55) return { label: 'Moderate', containerClass: 'bg-amber-100', textClass: 'text-amber-700' };
  if (score >= 40) return { label: 'Weak', containerClass: 'bg-orange-100', textClass: 'text-orange-700' };
  return { label: 'Poor', containerClass: 'bg-red-100', textClass: 'text-red-700' };
}
