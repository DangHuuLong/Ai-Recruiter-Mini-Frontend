import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import type { FileAsset } from '../types/file.type';

export async function uploadFile(file: File): Promise<FileAsset> {
  const formData = new FormData();

  formData.append('file', file);

  const response = await apiClient.upload<ApiResponse<FileAsset>>(
    '/files/upload',
    formData,
  );

  return response.data;
}