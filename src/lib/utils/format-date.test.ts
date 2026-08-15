import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatDate, formatDateTime, formatRelativeTime } from './format-date';

describe('formatDate', () => {
  it('formats an ISO date string as a medium-style English date', () => {
    expect(formatDate('2026-03-15T12:00:00Z')).toBe('Mar 15, 2026');
  });
});

describe('formatDateTime', () => {
  it('formats an ISO date string with both date and short time', () => {
    expect(formatDateTime('2026-03-15T14:30:00Z')).toBe('Mar 15, 2026, 9:30 PM');
  });
});

describe('formatRelativeTime', () => {
  const NOW = new Date('2026-03-15T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('buckets a few minutes in the past as minutes', () => {
    const fiveMinutesAgo = new Date(NOW.getTime() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  it('buckets a couple hours in the future as hours', () => {
    const inTwoHours = new Date(NOW.getTime() + 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(inTwoHours)).toBe('in 2 hours');
  });

  it('buckets several days ago as days, not hours', () => {
    const threeDaysAgo = new Date(NOW.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
  });

  it('falls back to seconds for a diff smaller than a minute', () => {
    const thirtySecondsAgo = new Date(NOW.getTime() - 30 * 1000).toISOString();
    expect(formatRelativeTime(thirtySecondsAgo)).toBe('30 seconds ago');
  });
});
