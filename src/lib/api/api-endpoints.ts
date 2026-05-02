export const apiEndpoints = {
  candidates: {
    list: '/candidates',
    create: '/candidates',
    detail: (id: string) => `/candidates/${id}`,
    update: (id: string) => `/candidates/${id}`,
    delete: (id: string) => `/candidates/${id}`,
    applications: (id: string) => `/candidates/${id}/applications`,
  },

  files: {
    upload: '/files/upload',
    detail: (id: string) => `/files/${id}`,
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
    detail: (id: string) => `/evaluations/${id}`,
    createForApplication: (applicationId: string) => {
      return `/applications/${applicationId}/evaluations`;
    },
  },
} as const;
