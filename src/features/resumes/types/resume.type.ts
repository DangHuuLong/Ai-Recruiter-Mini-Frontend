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
  createdAt: string;
  updatedAt: string;
  fileAsset?: FileAsset;
}

export interface CreateResumePayload {
  candidateId: string;
  fileAssetId: string;
}
