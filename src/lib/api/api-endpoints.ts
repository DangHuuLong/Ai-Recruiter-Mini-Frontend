export const apiEndpoints = {
  candidates: {
    list: '/candidates',
    create: '/candidates',
    detail: (id: string) => `/candidates/${id}`,
    update: (id: string) => `/candidates/${id}`,
    delete: (id: string) => `/candidates/${id}`,
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
  },

  applications: {
    list: '/applications',
    create: '/applications',
    detail: (id: string) => `/applications/${id}`,
    update: (id: string) => `/applications/${id}`,
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