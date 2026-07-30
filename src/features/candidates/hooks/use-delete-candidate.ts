'use client';

import { useState } from 'react';

import { deleteCandidate } from '@/features/candidates/api/candidate.api';
import type { DeleteCandidateResult } from '@/features/candidates/types/candidate.type';

export function useDeleteCandidate(candidateId: string) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCurrentCandidate = async (): Promise<DeleteCandidateResult> => {
    try {
      setIsDeleting(true);
      return await deleteCandidate(candidateId);
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteCurrentCandidate };
}
