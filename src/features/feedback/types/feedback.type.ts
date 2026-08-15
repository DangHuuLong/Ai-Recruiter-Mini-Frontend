export type FeedbackAccuracy = 'ACCURATE' | 'OK' | 'INACCURATE';

export type FeedbackSpeed = 'FAST' | 'NORMAL' | 'SLOW';

// Mirrors the backend's FEEDBACK_REASON_SLUGS (Ai-Recruiter-Mini-Backend
// src/modules/ai-activity-feedback/ai-activity-feedback.constants.ts) exactly.
export const FEEDBACK_REASON_SLUGS = [
  'SCORE_TOO_LOW',
  'SCORE_TOO_HIGH',
  'MISSING_SKILLS',
  'WRONG_SKILLS',
  'WRONG_EXTRACTION',
  'WRONG_INTERVIEW_QUESTIONS',
  'OTHER',
] as const;

export type FeedbackReasonSlug = (typeof FEEDBACK_REASON_SLUGS)[number];

export type SubmitFeedbackPayload = {
  accuracy: FeedbackAccuracy;
  reasons?: FeedbackReasonSlug[];
  speed: FeedbackSpeed;
  comment?: string;
};

export type AiActivityFeedback = SubmitFeedbackPayload & {
  id: string;
  tier: 'ENTERPRISE' | 'PUBLIC';
  organizationId: string | null;
  batchId: string | null;
  evaluationId: string | null;
  resumeId: string | null;
  jobDescriptionId: string | null;
  createdAt: string;
};
