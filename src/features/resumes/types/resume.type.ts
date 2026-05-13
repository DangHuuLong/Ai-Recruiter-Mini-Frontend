import type { FileAsset } from '@/features/files/types/file.type';

export type ParseStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface Resume {
  id: string;
  candidateId: string;
  fileAssetId: string;
  rawText?: string | null;
  parsedData?: unknown | null;
  parseStatus: ParseStatus;
  parserVersion?: string | null;
  parsingError?: string | null;
  uploadedAt?: string;
  createdAt: string;
  updatedAt: string;
  fileAsset?: FileAsset;
}

export interface ResumeQuery {
  page?: number;
  limit?: number;
  search?: string;
  candidateId?: string;
  parseStatus?: ParseStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'uploadedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateResumePayload {
  candidateId: string;
  fileAssetId: string;
}

export type UpdateResumePayload = {
  candidateId?: string;
  parserVersion?: string;
};

export type DeleteResumeResult = {
  id: string;
  deleted: boolean;
};
