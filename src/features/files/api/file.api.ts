import { apiClient } from '@/lib/api';
import type { ApiResponse, UploadProgress } from '@/lib/api/api-types';

import type { FileAsset } from '../types/file.type';

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
    '/files/upload',
    formData,
    {
      onUploadProgress: options?.onUploadProgress,
    },
  );

  return response.data;
}