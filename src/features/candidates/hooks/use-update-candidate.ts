'use client';

import { useState } from 'react';

import { updateCandidate } from '@/features/candidates/api/candidate.api';
import type { Candidate, UpdateCandidatePayload } from '@/features/candidates/types/candidate.type';

export function useUpdateCandidate(candidateId: string) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateCurrentCandidate = async (payload: UpdateCandidatePayload): Promise<Candidate> => {
    try {
      setIsUpdating(true);
      return await updateCandidate(candidateId, payload);
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, updateCurrentCandidate };
}
