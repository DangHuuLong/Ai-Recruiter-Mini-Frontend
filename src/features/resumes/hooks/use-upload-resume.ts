'use client';

import { useState } from 'react';

import { uploadFile } from '@/features/files/api/file.api';
import { createResume } from '@/features/resumes/api/resume.api';
import type {
  UploadResumeInput,
  UseUploadResumeResult,
} from '@/features/resumes/types/upload-resume.type';

export function useUploadResume(): UseUploadResumeResult {
  const [isUploading, setIsUploading] = useState(false);

  const uploadResume = async ({
    candidateId,
    file,
  }: UploadResumeInput) => {
    setIsUploading(true);

    try {
      const uploadedFile = await uploadFile(file);

      return createResume({
        candidateId,
        fileAssetId: uploadedFile.id,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadResume,
  };
}
