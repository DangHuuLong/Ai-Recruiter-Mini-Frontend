import { envConfig } from '@/config/env.config';
import {
  computeFileChecksum,
  uploadFileToSignedUrl,
} from '@/features/batch-scoring/api/batch-scoring.api';
import type {
  UploadUrlFileRequest,
  UploadUrlKind,
  UploadUrlResult,
} from '@/features/batch-scoring/types/batch-scoring.type';
import type {
  CreatePublicBatchPayload,
  CreatePublicBatchResult,
  PublicBatchSnapshot,
} from '@/features/public-batches/types/public-batch.type';

export { computeFileChecksum, uploadFileToSignedUrl };

const ANON_SESSION_HEADER = 'x-anon-session-id';
const ANON_SESSION_STORAGE_KEY = 'ai_recruiter_anon_session_id';

function getAnonSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ANON_SESSION_STORAGE_KEY);
}

function setAnonSessionId(id: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ANON_SESSION_STORAGE_KEY, id);
}

// The public batch API has no auth — an anonymous session id (issued by the backend on the
// first request and echoed back on every response) identifies "who owns this batch" instead.
// This is intentionally a separate minimal client rather than reusing apiClient, since it
// manages this session header instead of an Authorization bearer token.
async function publicRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const baseUrl = envConfig.apiBaseUrl.replace(/\/$/, '');
  const sessionId = getAnonSessionId();

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(sessionId ? { [ANON_SESSION_HEADER]: sessionId } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const echoedSessionId = response.headers.get(ANON_SESSION_HEADER);
  if (echoedSessionId) setAnonSessionId(echoedSessionId);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error((data && typeof data === 'object' && 'message' in data && String(data.message)) || `Request failed (${response.status})`);
  }

  return (data as { data: T }).data;
}

export async function getPublicUploadUrls(
  kind: UploadUrlKind,
  files: UploadUrlFileRequest[],
): Promise<UploadUrlResult[]> {
  return publicRequest<UploadUrlResult[]>('POST', '/public/batches/upload-urls', { kind, files });
}

export async function createPublicBatch(payload: CreatePublicBatchPayload): Promise<CreatePublicBatchResult> {
  return publicRequest<CreatePublicBatchResult>('POST', '/public/batches', payload);
}

export async function getPublicBatch(id: string): Promise<PublicBatchSnapshot> {
  return publicRequest<PublicBatchSnapshot>('GET', `/public/batches/${id}`);
}
