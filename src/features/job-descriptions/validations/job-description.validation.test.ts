import { describe, expect, it } from 'vitest';

import { createJobDescriptionSchema, jobSkillSchema } from './job-description.validation';

describe('createJobDescriptionSchema', () => {
  it('accepts a job description with just the required title and rawText', () => {
    const result = createJobDescriptionSchema.safeParse({
      title: 'Senior Backend Engineer',
      rawText: 'We are looking for a senior backend engineer...',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = createJobDescriptionSchema.safeParse({ title: '', rawText: 'text' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty rawText', () => {
    const result = createJobDescriptionSchema.safeParse({ title: 'Title', rawText: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a title longer than 200 characters', () => {
    const result = createJobDescriptionSchema.safeParse({ title: 'x'.repeat(201), rawText: 'text' });
    expect(result.success).toBe(false);
  });

  it('transforms an empty optional field into undefined', () => {
    const result = createJobDescriptionSchema.safeParse({
      title: 'Title',
      rawText: 'text',
      companyName: '',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.companyName).toBeUndefined();
    }
  });
});

describe('jobSkillSchema', () => {
  it('accepts a valid REQUIRED skill', () => {
    const result = jobSkillSchema.safeParse({
      name: 'Docker',
      type: 'REQUIRED',
      isCore: true,
      weightHint: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a type outside the REQUIRED/PREFERRED enum', () => {
    const result = jobSkillSchema.safeParse({
      name: 'Docker',
      type: 'OPTIONAL',
      isCore: true,
      weightHint: 1,
    });
    expect(result.success).toBe(false);
  });

  it('coerces a string weightHint into a number', () => {
    const result = jobSkillSchema.safeParse({
      name: 'Docker',
      type: 'REQUIRED',
      isCore: true,
      weightHint: '0.5',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.weightHint).toBe(0.5);
    }
  });

  it('rejects a weightHint outside the 0-1 range', () => {
    expect(
      jobSkillSchema.safeParse({ name: 'Docker', type: 'REQUIRED', isCore: true, weightHint: -0.1 }).success,
    ).toBe(false);
    expect(
      jobSkillSchema.safeParse({ name: 'Docker', type: 'REQUIRED', isCore: true, weightHint: 1.1 }).success,
    ).toBe(false);
  });

  it('rejects an empty skill name', () => {
    const result = jobSkillSchema.safeParse({ name: '', type: 'REQUIRED', isCore: true, weightHint: 1 });
    expect(result.success).toBe(false);
  });
});
