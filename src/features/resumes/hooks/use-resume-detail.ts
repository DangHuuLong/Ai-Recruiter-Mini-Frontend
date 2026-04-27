'use client';

import { useCallback, useEffect } from 'react';

import { useResumeDetailStore } from '@/features/resumes/stores/resume-detail.store';
import type { ResumeDetailState } from '@/features/resumes/types/resume-detail.type';

export function useResumeDetail(resumeId: string): ResumeDetailState {
  const resume = useResumeDetailStore(
    (state) => state.resumeById[resumeId] ?? null,
  );
  const isLoading = useResumeDetailStore(
    (state) => state.loadingById[resumeId] ?? false,
  );
  const errorMessage = useResumeDetailStore(
    (state) => state.errorById[resumeId] ?? null,
  );
  const loadResumeById = useResumeDetailStore(
    (state) => state.loadResumeById,
  );

  const refetchResume = useCallback(() => {
    return loadResumeById(resumeId, { force: true });
  }, [resumeId, loadResumeById]);

  useEffect(() => {
    if (!resumeId || resume) {
      return;
    }

    void loadResumeById(resumeId);
  }, [loadResumeById, resume, resumeId]);

  return {
    resume,
    isLoading,
    errorMessage,
    refetchResume,
  };
}