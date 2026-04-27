import { create } from 'zustand';

import { getCandidateResumesByCandidateId } from '@/features/candidates/api/candidate.api';
import type { CandidateResumeListStore } from '@/features/candidates/types/candidate-resume-list-store.type';

export const useCandidateResumeListStore = create<CandidateResumeListStore>(
  (set, get) => ({
    resumesByCandidateId: {},
    loadingByCandidateId: {},
    errorByCandidateId: {},

    loadCandidateResumes: async (candidateId, options) => {
      const { force = false } = options ?? {};
      const { resumesByCandidateId, loadingByCandidateId } = get();

      if (loadingByCandidateId[candidateId]) {
        return;
      }

      if (resumesByCandidateId[candidateId] && !force) {
        return;
      }

      try {
        set((state) => ({
          loadingByCandidateId: {
            ...state.loadingByCandidateId,
            [candidateId]: true,
          },
          errorByCandidateId: {
            ...state.errorByCandidateId,
            [candidateId]: null,
          },
        }));

        const resumes = await getCandidateResumesByCandidateId(candidateId);

        set((state) => ({
          resumesByCandidateId: {
            ...state.resumesByCandidateId,
            [candidateId]: resumes,
          },
          errorByCandidateId: {
            ...state.errorByCandidateId,
            [candidateId]: null,
          },
        }));
      } catch (error) {
        set((state) => ({
          errorByCandidateId: {
            ...state.errorByCandidateId,
            [candidateId]:
              error instanceof Error
                ? error.message
                : 'Failed to load candidate resumes',
          },
        }));
      } finally {
        set((state) => ({
          loadingByCandidateId: {
            ...state.loadingByCandidateId,
            [candidateId]: false,
          },
        }));
      }
    },

    setCandidateResumes: (candidateId, resumes) => {
      set((state) => ({
        resumesByCandidateId: {
          ...state.resumesByCandidateId,
          [candidateId]: resumes,
        },
        errorByCandidateId: {
          ...state.errorByCandidateId,
          [candidateId]: null,
        },
      }));
    },

    resetCandidateResumes: (candidateId) => {
      set((state) => {
        const resumesByCandidateId = { ...state.resumesByCandidateId };
        const loadingByCandidateId = { ...state.loadingByCandidateId };
        const errorByCandidateId = { ...state.errorByCandidateId };

        delete resumesByCandidateId[candidateId];
        delete loadingByCandidateId[candidateId];
        delete errorByCandidateId[candidateId];

        return {
          resumesByCandidateId,
          loadingByCandidateId,
          errorByCandidateId,
        };
      });
    },
  }),
);