import { describe, expect, it } from 'vitest';

import { resumeUploadSchema } from './resume.validation';

function buildFile(overrides: { type?: string; sizeBytes?: number } = {}) {
  const sizeBytes = overrides.sizeBytes ?? 1024;
  return new File([new Uint8Array(sizeBytes)], 'resume.pdf', {
    type: overrides.type ?? 'application/pdf',
  });
}

describe('resumeUploadSchema', () => {
  it('accepts a valid candidateId and a small PDF file', () => {
    const result = resumeUploadSchema.safeParse({ candidateId: 'candidate-1', file: buildFile() });
    expect(result.success).toBe(true);
  });

  it('accepts a DOCX file too', () => {
    const result = resumeUploadSchema.safeParse({
      candidateId: 'candidate-1',
      file: buildFile({ type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty candidateId', () => {
    const result = resumeUploadSchema.safeParse({ candidateId: '', file: buildFile() });
    expect(result.success).toBe(false);
  });

  it('rejects a file that is not a File instance', () => {
    const result = resumeUploadSchema.safeParse({ candidateId: 'candidate-1', file: 'not-a-file' });
    expect(result.success).toBe(false);
  });

  it('rejects an unsupported mime type', () => {
    const result = resumeUploadSchema.safeParse({
      candidateId: 'candidate-1',
      file: buildFile({ type: 'image/png' }),
    });
    expect(result.success).toBe(false);
  });

  it('rejects a file larger than 5MB', () => {
    const result = resumeUploadSchema.safeParse({
      candidateId: 'candidate-1',
      file: buildFile({ sizeBytes: 6 * 1024 * 1024 }),
    });
    expect(result.success).toBe(false);
  });

  it('accepts a file exactly at the 5MB limit', () => {
    const result = resumeUploadSchema.safeParse({
      candidateId: 'candidate-1',
      file: buildFile({ sizeBytes: 5 * 1024 * 1024 }),
    });
    expect(result.success).toBe(true);
  });
});
