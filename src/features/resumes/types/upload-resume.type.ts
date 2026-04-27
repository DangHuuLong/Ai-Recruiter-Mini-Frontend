import type { Resume } from '@/features/resumes/types/resume.type';

export type UploadResumeInput = {
  candidateId: string;
  file: File;
};

export type UploadStep = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export type UseUploadResumeResult = {
  isUploading: boolean;
  uploadProgress: number;
  uploadStep: UploadStep;
  uploadResume: (input: UploadResumeInput) => Promise<Resume>;
  resetUploadProgress: () => void;
};