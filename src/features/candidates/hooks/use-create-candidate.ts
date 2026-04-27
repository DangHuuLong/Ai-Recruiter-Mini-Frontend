'use client';

import { useState } from 'react';

import { createCandidate } from '@/features/candidates/api/candidate.api';
import type { CreateCandidatePayload } from '@/features/candidates/types/candidate.type';
import type { UseCreateCandidateResult } from '@/features/candidates/types/create-candidate.type';

export function useCreateCandidate(): UseCreateCandidateResult {
  const [isCreating, setIsCreating] = useState(false);

  const createNewCandidate = async (payload: CreateCandidatePayload) => {
    setIsCreating(true);

    try {
      return await createCandidate(payload);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    createNewCandidate,
  };
}