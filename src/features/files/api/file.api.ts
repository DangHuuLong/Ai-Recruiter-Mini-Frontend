import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse, UploadProgress } from '@/lib/api/api-types';

import type { FileAsset } from '../types/file.type';

export type FileDownloadUrl = {
  url: string;
  expiresIn: number;
};

type UploadFileOptions = {
  onUploadProgress?: (progress: UploadProgress) => void;
};

export async function uploadFile(
  file: File,
  options?: UploadFileOptions,
): Promise<FileAsset> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.upload<ApiResponse<FileAsset>>(
    apiEndpoints.files.upload,
    formData,
    { onUploadProgress: options?.onUploadProgress },
  );
  return response.data;
}

export async function getFileDownloadUrl(fileId: string, _fileName: string): Promise<FileDownloadUrl> {
  const response = await apiClient.get<ApiResponse<FileDownloadUrl>>(
    apiEndpoints.files.downloadUrl(fileId),
  );
  return response.data;
}
