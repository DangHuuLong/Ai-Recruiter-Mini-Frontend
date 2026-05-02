'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getJobDescription,
  parseJobDescription,
} from '@/features/job-descriptions/api/job-description.api';
import type { JobDescription } from '@/features/job-descriptions/types/job-description.type';

export function useJobDescriptionDetail(id: string) {
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadJobDescription = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setJobDescription(await getJobDescription(id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to load job description',
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const parseCurrentJobDescription = useCallback(async () => {
    try {
      setIsParsing(true);
      setErrorMessage(null);
      const parsedJobDescription = await parseJobDescription(id);
      setJobDescription(parsedJobDescription);
      return parsedJobDescription;
    } finally {
      setIsParsing(false);
    }
  }, [id]);

  useEffect(() => {
    void loadJobDescription();
  }, [loadJobDescription]);

  return {
    jobDescription,
    isLoading,
    isParsing,
    errorMessage,
    refetchJobDescription: loadJobDescription,
    parseCurrentJobDescription,
    setJobDescription,
  };
}
