'use client';

import { useCallback, useEffect } from 'react';

import { useCandidateDetailStore } from '@/features/candidates/stores/candidate-detail.store';
import type { CandidateDetailState } from '@/features/candidates/types/candidate-detail.type';

export function useCandidateDetail(candidateId: string): CandidateDetailState {
  const candidate = useCandidateDetailStore(
    (state) => state.candidateById[candidateId] ?? null,
  );
  const isLoading = useCandidateDetailStore(
    (state) => state.loadingById[candidateId] ?? false,
  );
  const errorMessage = useCandidateDetailStore(
    (state) => state.errorById[candidateId] ?? null,
  );
  const loadCandidateById = useCandidateDetailStore(
    (state) => state.loadCandidateById,
  );

  const refetchCandidate = useCallback(() => {
    return loadCandidateById(candidateId, { force: true });
  }, [candidateId, loadCandidateById]);

  useEffect(() => {
    if (!candidateId || candidate) {
      return;
    }

    void loadCandidateById(candidateId);
  }, [candidate, candidateId, loadCandidateById]);

  return {
    candidate,
    isLoading,
    errorMessage,
    refetchCandidate,
  };
}