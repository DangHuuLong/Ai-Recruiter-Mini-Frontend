'use client';

import { useCallback, useEffect } from 'react';

import { useCandidateListStore } from '@/features/candidates/stores/candidate-list.store';
import type { CandidateListState } from '@/features/candidates/types/candidate-list.type';

export function useCandidates(): CandidateListState {
  const candidates = useCandidateListStore((state) => state.candidates);
  const hasLoaded = useCandidateListStore((state) => state.hasLoaded);
  const isLoading = useCandidateListStore((state) => state.isLoading);
  const errorMessage = useCandidateListStore((state) => state.errorMessage);
  const loadCandidates = useCandidateListStore((state) => state.loadCandidates);

  const refetchCandidates = useCallback(() => {
    return loadCandidates({ force: true });
  }, [loadCandidates]);

  useEffect(() => {
    if (hasLoaded) {
      return;
    }

    void loadCandidates();
  }, [hasLoaded, loadCandidates]);

  return {
    candidates,
    isLoading,
    errorMessage,
    refetchCandidates,
  };
}