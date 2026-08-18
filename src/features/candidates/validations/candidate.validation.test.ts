import { describe, expect, it } from 'vitest';

import { createCandidateSchema } from './candidate.validation';

describe('createCandidateSchema', () => {
  it('accepts a candidate with only the required fullName', () => {
    const result = createCandidateSchema.safeParse({ fullName: 'Jane Doe' });
    expect(result.success).toBe(true);
  });

  it('rejects an empty/whitespace-only fullName', () => {
    expect(createCandidateSchema.safeParse({ fullName: '' }).success).toBe(false);
    expect(createCandidateSchema.safeParse({ fullName: '   ' }).success).toBe(false);
  });

  it('treats empty-string optional fields as undefined rather than a validation error', () => {
    const result = createCandidateSchema.safeParse({
      fullName: 'Jane Doe',
      primaryEmail: '',
      primaryPhone: '',
      linkedinUrl: '',
      location: '',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.primaryEmail).toBeUndefined();
      expect(result.data.primaryPhone).toBeUndefined();
      expect(result.data.linkedinUrl).toBeUndefined();
      expect(result.data.location).toBeUndefined();
    }
  });

  it('rejects a malformed primaryEmail when one is actually given', () => {
    const result = createCandidateSchema.safeParse({ fullName: 'Jane Doe', primaryEmail: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed linkedinUrl/githubUrl/portfolioUrl when actually given', () => {
    expect(
      createCandidateSchema.safeParse({ fullName: 'Jane Doe', linkedinUrl: 'not-a-url' }).success,
    ).toBe(false);
    expect(
      createCandidateSchema.safeParse({ fullName: 'Jane Doe', githubUrl: 'not-a-url' }).success,
    ).toBe(false);
    expect(
      createCandidateSchema.safeParse({ fullName: 'Jane Doe', portfolioUrl: 'not-a-url' }).success,
    ).toBe(false);
  });

  it('accepts a fully-populated valid candidate', () => {
    const result = createCandidateSchema.safeParse({
      fullName: 'Jane Doe',
      primaryEmail: 'jane@example.com',
      primaryPhone: '+1 555 000 1234',
      linkedinUrl: 'https://linkedin.com/in/janedoe',
      githubUrl: 'https://github.com/janedoe',
      portfolioUrl: 'https://janedoe.dev',
      location: 'San Francisco, CA',
    });

    expect(result.success).toBe(true);
  });

  it('trims whitespace around fullName', () => {
    const result = createCandidateSchema.safeParse({ fullName: '  Jane Doe  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe('Jane Doe');
    }
  });
});
