import type { Resume } from './resume.type';

export interface UploadResumeInput {
  candidateId: string;
  file: File;
}

export interface UseUploadResumeResult {
  isUploading: boolean;
  uploadResume: (input: UploadResumeInput) => Promise<Resume>;
}
