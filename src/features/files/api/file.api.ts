// Static-UI review phase — API call below is commented out and replaced with a mock
// upload so the Resumes screens can be reviewed without a live backend. To restore real
// integration, uncomment the `apiClient.upload` call and remove the mock block below.
// apiClient kept imported so the commented-out real call still resolves at a glance.
import { apiClient } from '@/lib/api';
import type { UploadProgress } from '@/lib/api/api-types';

import type { FileAsset } from '../types/file.type';

type UploadFileOptions = {
  onUploadProgress?: (progress: UploadProgress) => void;
};

let mockFileSequence = 100;

export async function uploadFile(
  file: File,
  options?: UploadFileOptions,
): Promise<FileAsset> {
  // const formData = new FormData();
  // formData.append('file', file);
  // const response = await apiClient.upload<ApiResponse<FileAsset>>(
  //   '/files/upload',
  //   formData,
  //   { onUploadProgress: options?.onUploadProgress },
  // );
  // return response.data;

  await new Promise<void>((resolve) => {
    let loaded = 0;
    const total = file.size || 1;
    const interval = setInterval(() => {
      loaded = Math.min(total, loaded + total / 6);
      options?.onUploadProgress?.({ loaded, total, percent: Math.round((loaded / total) * 100) });
      if (loaded >= total) {
        clearInterval(interval);
        resolve();
      }
    }, 120);
  });

  mockFileSequence += 1;
  const fileType = file.name.toLowerCase().endsWith('.docx') ? 'DOCX' : 'PDF';

  return {
    id: `file-${mockFileSequence}`,
    fileName: file.name,
    originalFileUrl: `https://example.com/files/${file.name}`,
    storageKey: `resumes/mock/${file.name}`,
    fileType,
    fileSizeBytes: file.size,
    checksum: `mock-checksum-${mockFileSequence}`,
    bucket: 'cv-files',
    status: 'ACTIVE',
    uploadedAt: new Date().toISOString(),
  };
}