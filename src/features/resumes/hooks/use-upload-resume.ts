'use client';

import { useState } from 'react';

import { uploadFile } from '@/features/files/api/file.api';
import { createResume } from '@/features/resumes/api/resume.api';
import type {
  UploadResumeInput,
  UploadStep,
  UseUploadResumeResult,
} from '@/features/resumes/types/upload-resume.type';

export function useUploadResume(): UseUploadResumeResult {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<UploadStep>('idle');

  const resetUploadProgress = () => {
    setUploadProgress(0);
    setUploadStep('idle');
  };

  const uploadResume = async ({
    candidateId,
    file,
  }: UploadResumeInput) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStep('uploading');

    try {
      const uploadedFile = await uploadFile(file, {
        onUploadProgress: ({ percent }) => {
          setUploadProgress(Math.min(percent, 95));
        },
      });

      setUploadProgress(95);
      setUploadStep('processing');

      const resume = await createResume({
        candidateId,
        fileAssetId: uploadedFile.id,
      });

      setUploadProgress(100);
      setUploadStep('success');

      return resume;
    } catch (error) {
      setUploadStep('error');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadStep,
    uploadResume,
    resetUploadProgress,
  };
}