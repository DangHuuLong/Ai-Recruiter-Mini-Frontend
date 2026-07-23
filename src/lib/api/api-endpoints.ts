export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    registerOrganization: '/auth/register-organization',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  candidates: {
    list: '/candidates',
    create: '/candidates',
    detail: (id: string) => `/candidates/${id}`,
    update: (id: string) => `/candidates/${id}`,
    delete: (id: string) => `/candidates/${id}`,
    bulkDelete: '/candidates/bulk-delete',
    applications: (id: string) => `/candidates/${id}/applications`,
    resumes: (id: string) => `/candidates/${id}/resumes`,
  },

  files: {
    upload: '/files/upload',
    detail: (id: string) => `/files/${id}`,
    downloadUrl: (id: string) => `/files/${id}/download-url`,
    delete: (id: string) => `/files/${id}`,
  },

  resumes: {
    list: '/resumes',
    create: '/resumes',
    detail: (id: string) => `/resumes/${id}`,
    update: (id: string) => `/resumes/${id}`,
    delete: (id: string) => `/resumes/${id}`,
    parse: (id: string) => `/resumes/${id}/parse`,
  },

  jobDescriptions: {
    list: '/job-descriptions',
    create: '/job-descriptions',
    detail: (id: string) => `/job-descriptions/${id}`,
    update: (id: string) => `/job-descriptions/${id}`,
    delete: (id: string) => `/job-descriptions/${id}`,
    bulkDeactivate: '/job-descriptions/bulk-deactivate',
    parse: (id: string) => `/job-descriptions/${id}/parse`,
    parsedData: (id: string) => `/job-descriptions/${id}/parsed-data`,
    skills: (id: string) => `/job-descriptions/${id}/skills`,
  },

  jobSkills: {
    update: (skillId: string) => `/job-skills/${skillId}`,
    delete: (skillId: string) => `/job-skills/${skillId}`,
  },

  applications: {
    list: '/applications',
    create: '/applications',
    detail: (id: string) => `/applications/${id}`,
    update: (id: string) => `/applications/${id}`,
    status: (id: string) => `/applications/${id}/status`,
    events: (id: string) => `/applications/${id}/events`,
  },

  evaluations: {
    list: '/evaluations',
    create: '/evaluations',
    detail: (id: string) => `/evaluations/${id}`,
    byApplication: (applicationId: string) => `/applications/${applicationId}/evaluations`,
    breakdown: (id: string) => `/evaluations/${id}/breakdown`,
    skills: (id: string) => `/evaluations/${id}/skills`,
    interviewQuestions: (id: string) => `/evaluations/${id}/interview-questions`,
    evidence: (id: string) => `/evaluations/${id}/evidence`,
    retry: (id: string) => `/evaluations/${id}/retry`,
  },

  users: {
    list: '/users',
    create: '/users',
    me: '/users/me',
    update: (id: string) => `/users/${id}`,
  },

  auditLogs: {
    list: '/audit-logs',
  },

  evaluationConfigs: {
    list: '/evaluation-configs',
    create: '/evaluation-configs',
    detail: (id: string) => `/evaluation-configs/${id}`,
    update: (id: string) => `/evaluation-configs/${id}`,
    delete: (id: string) => `/evaluation-configs/${id}`,
    bulkDelete: '/evaluation-configs/bulk-delete',
  },

  scoringBatches: {
    list: '/scoring-batches',
    create: '/scoring-batches',
    uploadUrls: '/scoring-batches/upload-urls',
    status: (id: string) => `/scoring-batches/${id}`,
    matrix: (id: string) => `/scoring-batches/${id}/matrix`,
    cell: (id: string, resumeItemId: string, jdItemId: string) =>
      `/scoring-batches/${id}/cells/${resumeItemId}/${jdItemId}`,
    skillGapSummary: (id: string) => `/scoring-batches/${id}/skill-gap-summary`,
    export: (id: string) => `/scoring-batches/${id}/export`,
    cancel: (id: string) => `/scoring-batches/${id}/cancel`,
    promote: (id: string) => `/scoring-batches/${id}/promote`,
  },

  interviewQuestions: {
    list: '/interview-questions',
    create: '/interview-questions',
    bulkCreate: '/interview-questions/bulk',
    search: '/interview-questions/search',
    searchOrGenerate: '/interview-questions/search-or-generate',
    detail: (id: string) => `/interview-questions/${id}`,
    update: (id: string) => `/interview-questions/${id}`,
    delete: (id: string) => `/interview-questions/${id}`,
    reembed: (id: string) => `/interview-questions/${id}/reembed`,
  },
} as const;
