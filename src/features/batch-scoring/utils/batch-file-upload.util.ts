import { computeFileChecksum, uploadFileToSignedUrl } from '@/features/batch-scoring/api/batch-scoring.api';
import type { UploadedFileRef, UploadUrlFileRequest, UploadUrlResult } from '@/features/batch-scoring/types/batch-scoring.type';

// Shared by the enterprise create-batch wizard and the public "try it" flow — the only
// difference between them is which upload-urls endpoint issues the signed URLs (authenticated
// vs anonymous-session), so that's injected rather than duplicating the checksum/PUT orchestration.
export async function uploadFilesForBatch(
  files: File[],
  getUploadUrls: (files: UploadUrlFileRequest[]) => Promise<UploadUrlResult[]>,
): Promise<UploadedFileRef[]> {
  const withChecksums = await Promise.all(
    files.map(async (file) => ({
      file,
      checksum: await computeFileChecksum(file),
    })),
  );

  const uploadUrls = await getUploadUrls(
    withChecksums.map(({ file, checksum }) => ({
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      checksum,
    })),
  );

  await Promise.all(
    uploadUrls.map((entry, index) => uploadFileToSignedUrl(entry.signedUploadUrl, withChecksums[index].file)),
  );

  return uploadUrls.map((entry, index) => ({
    fileKey: entry.fileKey,
    fileName: entry.fileName,
    mimeType: withChecksums[index].file.type || 'application/octet-stream',
    sizeBytes: withChecksums[index].file.size,
    checksum: withChecksums[index].checksum,
  }));
}
