'use client';

import { useCallback, useEffect, useState } from 'react';

import { getJobDescriptions } from '@/features/job-descriptions/api/job-description.api';
import type { JobDescription } from '@/features/job-descriptions/types/job-description.type';

export function useJobDescriptions() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadJobDescriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getJobDescriptions({ page: 1, limit: 20 });
      setJobDescriptions(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to load job descriptions',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobDescriptions();
  }, [loadJobDescriptions]);

  return {
    jobDescriptions,
    isLoading,
    errorMessage,
    refetchJobDescriptions: loadJobDescriptions,
  };
}
