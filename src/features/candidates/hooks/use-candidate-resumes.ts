'use client';

import { useCallback, useEffect } from 'react';

import { useCandidateResumeListStore } from '@/features/candidates/stores/candidate-resume-list.store';
import type { CandidateResumeListState } from '@/features/candidates/types/candidate-resume-list.type';
import type { Resume } from '@/features/resumes/types/resume.type';

const EMPTY_RESUMES: Resume[] = [];

export function useCandidateResumes(
  candidateId: string,
): CandidateResumeListState {
  const resumes = useCandidateResumeListStore(
    (state) => state.resumesByCandidateId[candidateId] ?? EMPTY_RESUMES,
  );
  const isLoading = useCandidateResumeListStore(
    (state) => state.loadingByCandidateId[candidateId] ?? false,
  );
  const errorMessage = useCandidateResumeListStore(
    (state) => state.errorByCandidateId[candidateId] ?? null,
  );
  const loadCandidateResumes = useCandidateResumeListStore(
    (state) => state.loadCandidateResumes,
  );

  const refetchResumes = useCallback(() => {
    return loadCandidateResumes(candidateId, { force: true });
  }, [candidateId, loadCandidateResumes]);

  useEffect(() => {
    if (!candidateId) {
      return;
    }

    void loadCandidateResumes(candidateId);
  }, [candidateId, loadCandidateResumes]);

  return {
    resumes,
    isLoading,
    errorMessage,
    refetchResumes,
  };
}