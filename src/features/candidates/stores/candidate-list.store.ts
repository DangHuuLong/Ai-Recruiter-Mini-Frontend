import { create } from 'zustand';

import { getCandidates } from '@/features/candidates/api/candidate.api';
import type { CandidateListStore } from '@/features/candidates/types/candidate-list-store.type';

export const useCandidateListStore = create<CandidateListStore>((set, get) => ({
  candidates: [],
  hasLoaded: false,
  isLoading: false,
  errorMessage: null,

  loadCandidates: async (options) => {
    const { force = false } = options ?? {};
    const { hasLoaded, isLoading } = get();

    if (isLoading) {
      return;
    }

    if (hasLoaded && !force) {
      return;
    }

    try {
      set({
        isLoading: true,
        errorMessage: null,
      });

      const candidates = await getCandidates();

      set({
        candidates,
        hasLoaded: true,
      });
    } catch (error) {
      set({
        errorMessage:
          error instanceof Error ? error.message : 'Failed to load candidates',
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  setCandidates: (candidates) => {
    set({
      candidates,
      hasLoaded: true,
      errorMessage: null,
    });
  },

  resetCandidates: () => {
    set({
      candidates: [],
      hasLoaded: false,
      isLoading: false,
      errorMessage: null,
    });
  },
}));