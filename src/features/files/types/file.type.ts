export type FileAssetStatus = 'ACTIVE' | 'DELETED';

export type ResumeFileType = 'PDF' | 'DOCX';

export interface FileAsset {
  id: string;
  fileName: string;
  originalFileUrl: string;
  storageKey: string;
  fileType: ResumeFileType;
  fileSizeBytes: number;
  checksum: string;
  bucket: string;
  status: FileAssetStatus;
  uploadedAt: string;
}
