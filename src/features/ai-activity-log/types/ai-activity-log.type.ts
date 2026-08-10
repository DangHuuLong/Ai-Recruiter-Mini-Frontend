export type AiFunctionType = 'PARSE_RESUME' | 'PARSE_JOB_DESCRIPTION' | 'SCORE_APPLICATION';

export const FUNCTION_TYPE_LABELS: Record<AiFunctionType, string> = {
  PARSE_RESUME: 'Parse Resume',
  PARSE_JOB_DESCRIPTION: 'Parse Job Description',
  SCORE_APPLICATION: 'Score Application',
};

// Maps each value to the message key under aiActivityLog.labels.functionType —
// pass to t('labels.functionType.' + FUNCTION_TYPE_LABEL_KEYS[type]).
export const FUNCTION_TYPE_LABEL_KEYS: Record<AiFunctionType, string> = {
  PARSE_RESUME: 'parseResume',
  PARSE_JOB_DESCRIPTION: 'parseJobDescription',
  SCORE_APPLICATION: 'scoreApplication',
};

export type AiCallTier = 'ENTERPRISE' | 'PUBLIC';

export const TIER_LABELS: Record<AiCallTier, string> = {
  ENTERPRISE: 'Enterprise',
  PUBLIC: 'Public',
};

// Maps each value to the message key under aiActivityLog.labels.tier —
// pass to t('labels.tier.' + TIER_LABEL_KEYS[tier]).
export const TIER_LABEL_KEYS: Record<AiCallTier, string> = {
  ENTERPRISE: 'enterprise',
  PUBLIC: 'public',
};

export type AiCallStatus = 'SUCCESS' | 'FAILED';

export const STATUS_LABELS: Record<AiCallStatus, string> = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
};

// Maps each value to the message key under aiActivityLog.labels.status —
// pass to t('labels.status.' + STATUS_LABEL_KEYS[status]).
export const STATUS_LABEL_KEYS: Record<AiCallStatus, string> = {
  SUCCESS: 'success',
  FAILED: 'failed',
};

export const STATUS_CLASSES: Record<AiCallStatus, string> = {
  SUCCESS: 'bg-success-container text-success',
  FAILED: 'bg-error-container text-error',
};

export type AiActivityLogListItem = {
  id: string;
  functionType: AiFunctionType;
  tier: AiCallTier;
  status: AiCallStatus;
  organizationId: string | null;
  batchId: string | null;
  evaluationId: string | null;
  resumeId: string | null;
  jobDescriptionId: string | null;
  errorMessage: string | null;
  latencyMs: number;
  createdAt: string;
};

export type AiActivityLog = AiActivityLogListItem & {
  input: unknown;
  output: unknown;
};

export type AiActivityLogQuery = {
  page?: number;
  limit?: number;
  functionType?: AiFunctionType;
  tier?: AiCallTier;
  status?: AiCallStatus;
  organizationId?: string;
  batchId?: string;
  resumeId?: string;
  jobDescriptionId?: string;
  from?: string;
  to?: string;
};

export type AiActivityLogSummary = {
  totalToday: number;
  totalThisMonth: number;
  successRate: number | null;
  avgLatencyMs: number | null;
};

export type TimeseriesGranularity = 'hour' | 'day' | 'month';

export type TimeseriesBucket = {
  bucket: string;
  PARSE_RESUME: number;
  PARSE_JOB_DESCRIPTION: number;
  SCORE_APPLICATION: number;
};

export type TimeseriesQuery = {
  granularity: TimeseriesGranularity;
  date?: string;
  tzOffsetMinutes?: number;
};
