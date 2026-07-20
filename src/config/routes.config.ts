export const ROUTES = {
  ROOT: '/',
  PUBLIC_TRY: '/try',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  RESEND_VERIFICATION: '/resend-verification',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',

  CANDIDATES: '/candidates',
  CANDIDATE_CREATE: '/candidates/new',

  RESUMES: '/resumes',

  JOB_DESCRIPTIONS: '/job-descriptions',
  JOB_DESCRIPTION_CREATE: '/job-descriptions/new',

  APPLICATIONS: '/applications',
  APPLICATION_CREATE: '/applications/new',

  EVALUATIONS: '/evaluations',

  BATCH_SCORING: '/batch-scoring',
  BATCH_SCORING_CREATE: '/batch-scoring/new',

  EVALUATION_CONFIGS: '/evaluation-configs',

  USERS: '/users',

  AUDIT_LOG: '/audit-log',

  INTERVIEW_QUESTIONS: '/interview-questions',
} as const;