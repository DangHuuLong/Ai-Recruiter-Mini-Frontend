import { describe, expect, it } from 'vitest';

import { formatFileSize } from './format-file-size';

describe('formatFileSize', () => {
  it('formats bytes below 1024 as B', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats sizes at/above 1KB and below 1MB as KB with 1 decimal', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('formats sizes at/above 1MB as MB with 1 decimal', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});
