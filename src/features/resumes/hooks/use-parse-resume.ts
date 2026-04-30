'use client';

import { useCallback, useState } from 'react';

import { parseResumeById } from '@/features/resumes/api/resume.api';
import { useResumeDetailStore } from '@/features/resumes/stores/resume-detail.store';
import type { UseParseResumeState } from '@/features/resumes/types/parse-resume.type';

export function useParseResume(resumeId: string): UseParseResumeState {
  const [isParsing, setIsParsing] = useState(false);
  const [parseErrorMessage, setParseErrorMessage] = useState<string | null>(null);
  const setResumeDetail = useResumeDetailStore((state) => state.setResumeDetail);

  const parseResume = useCallback(async () => {
    if (!resumeId || isParsing) {
      return null;
    }

    try {
      setIsParsing(true);
      setParseErrorMessage(null);

      const parsedResume = await parseResumeById(resumeId);
      setResumeDetail(parsedResume);

      return parsedResume;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to parse resume';

      setParseErrorMessage(message);
      return null;
    } finally {
      setIsParsing(false);
    }
  }, [isParsing, resumeId, setResumeDetail]);

  const resetParseError = useCallback(() => {
    setParseErrorMessage(null);
  }, []);

  return {
    isParsing,
    parseErrorMessage,
    parseResume,
    resetParseError,
  };
}
