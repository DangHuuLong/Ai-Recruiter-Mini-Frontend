import { create } from 'zustand';

import { getResumeById } from '@/features/resumes/api/resume.api';
import type { ResumeDetailStore } from '@/features/resumes/types/resume-detail-store.type';

export const useResumeDetailStore = create<ResumeDetailStore>((set, get) => ({
  resumeById: {},
  loadingById: {},
  errorById: {},

  loadResumeById: async (id, options) => {
    const { force = false } = options ?? {};
    const { resumeById, loadingById } = get();

    if (loadingById[id]) {
      return;
    }

    if (resumeById[id] && !force) {
      return;
    }

    try {
      set((state) => ({
        loadingById: {
          ...state.loadingById,
          [id]: true,
        },
        errorById: {
          ...state.errorById,
          [id]: null,
        },
      }));

      const resume = await getResumeById(id);

      set((state) => ({
        resumeById: {
          ...state.resumeById,
          [id]: resume,
        },
        errorById: {
          ...state.errorById,
          [id]: null,
        },
      }));
    } catch (error) {
      set((state) => ({
        errorById: {
          ...state.errorById,
          [id]:
            error instanceof Error
              ? error.message
              : 'Failed to load resume detail',
        },
      }));
    } finally {
      set((state) => ({
        loadingById: {
          ...state.loadingById,
          [id]: false,
        },
      }));
    }
  },

  setResumeDetail: (resume) => {
    set((state) => ({
      resumeById: {
        ...state.resumeById,
        [resume.id]: resume,
      },
      errorById: {
        ...state.errorById,
        [resume.id]: null,
      },
    }));
  },

  resetResumeDetail: (id) => {
    set((state) => {
      const resumeById = { ...state.resumeById };
      const loadingById = { ...state.loadingById };
      const errorById = { ...state.errorById };

      delete resumeById[id];
      delete loadingById[id];
      delete errorById[id];

      return {
        resumeById,
        loadingById,
        errorById,
      };
    });
  },
}));