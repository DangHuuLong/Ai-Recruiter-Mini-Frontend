import { create } from 'zustand';

import { getCandidateById } from '@/features/candidates/api/candidate.api';
import type { CandidateDetailStore } from '@/features/candidates/types/candidate-detail-store.type';

export const useCandidateDetailStore = create<CandidateDetailStore>(
  (set, get) => ({
    candidateById: {},
    loadingById: {},
    errorById: {},

    loadCandidateById: async (id, options) => {
      const { force = false } = options ?? {};
      const { candidateById, loadingById } = get();

      if (loadingById[id]) {
        return;
      }

      if (candidateById[id] && !force) {
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

        const candidate = await getCandidateById(id);

        set((state) => ({
          candidateById: {
            ...state.candidateById,
            [id]: candidate,
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
                : 'Failed to load candidate detail',
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

    setCandidateDetail: (candidate) => {
      set((state) => ({
        candidateById: {
          ...state.candidateById,
          [candidate.id]: candidate,
        },
        errorById: {
          ...state.errorById,
          [candidate.id]: null,
        },
      }));
    },

    resetCandidateDetail: (id) => {
      set((state) => {
        const candidateById = { ...state.candidateById };
        const loadingById = { ...state.loadingById };
        const errorById = { ...state.errorById };

        delete candidateById[id];
        delete loadingById[id];
        delete errorById[id];

        return {
          candidateById,
          loadingById,
          errorById,
        };
      });
    },
  }),
);