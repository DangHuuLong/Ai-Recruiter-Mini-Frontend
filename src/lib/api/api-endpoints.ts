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
  },

  files: {
    upload: '/files/upload',
    detail: (id: string) => `/files/${id}`,
    downloadUrl: (id: string) => `/files/${id}/download-url`,
    delete: (id: string) => `/files/${id}`,
  },

  resumes: {
    list: '/resumes',
    detail: (id: string) => `/resumes/${id}`,
    delete: (id: string) => `/resumes/${id}`,
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
    delete: (id: string) => `/applications/${id}`,
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
} as const;
