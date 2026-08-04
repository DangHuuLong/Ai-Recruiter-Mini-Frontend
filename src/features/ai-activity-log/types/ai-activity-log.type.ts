export type AiFunctionType = 'PARSE_RESUME' | 'PARSE_JOB_DESCRIPTION' | 'SCORE_APPLICATION';

export const FUNCTION_TYPE_LABELS: Record<AiFunctionType, string> = {
  PARSE_RESUME: 'Parse Resume',
  PARSE_JOB_DESCRIPTION: 'Parse Job Description',
  SCORE_APPLICATION: 'Score Application',
};

export type AiCallTier = 'ENTERPRISE' | 'PUBLIC';

export const TIER_LABELS: Record<AiCallTier, string> = {
  ENTERPRISE: 'Enterprise',
  PUBLIC: 'Public',
};

export type AiCallStatus = 'SUCCESS' | 'FAILED';

export const STATUS_LABELS: Record<AiCallStatus, string> = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
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
