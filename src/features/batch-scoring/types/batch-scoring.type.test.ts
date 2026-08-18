import { describe, expect, it } from 'vitest';

import { getScoreTier } from './batch-scoring.type';

describe('getScoreTier', () => {
  it('returns excellent at and above 85', () => {
    expect(getScoreTier(85).tierKey).toBe('excellent');
    expect(getScoreTier(100).tierKey).toBe('excellent');
  });

  it('returns strong just below the excellent boundary', () => {
    expect(getScoreTier(84.9).tierKey).toBe('strong');
  });

  it('returns strong at and above 70', () => {
    expect(getScoreTier(70).tierKey).toBe('strong');
  });

  it('returns moderate just below the strong boundary', () => {
    expect(getScoreTier(69.9).tierKey).toBe('moderate');
  });

  it('returns moderate at and above 55', () => {
    expect(getScoreTier(55).tierKey).toBe('moderate');
  });

  it('returns weak just below the moderate boundary', () => {
    expect(getScoreTier(54.9).tierKey).toBe('weak');
  });

  it('returns weak at and above 40', () => {
    expect(getScoreTier(40).tierKey).toBe('weak');
  });

  it('returns poor just below the weak boundary', () => {
    expect(getScoreTier(39.9).tierKey).toBe('poor');
  });

  it('returns poor for a score of 0', () => {
    expect(getScoreTier(0).tierKey).toBe('poor');
  });

  it('includes the container/text classes matching the tier', () => {
    const tier = getScoreTier(90);
    expect(tier.containerClass).toBe('bg-emerald-100');
    expect(tier.textClass).toBe('text-emerald-700');
  });
});
