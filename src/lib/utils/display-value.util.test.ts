import { describe, expect, it } from 'vitest';

import { getDisplayValue } from './display-value.util';

describe('getDisplayValue', () => {
  it('returns the value when it is a non-empty string', () => {
    expect(getDisplayValue('Ho Chi Minh City')).toBe('Ho Chi Minh City');
  });

  it('returns the default fallback for undefined', () => {
    expect(getDisplayValue(undefined)).toBe('Not provided');
  });

  it('returns the default fallback for null', () => {
    expect(getDisplayValue(null)).toBe('Not provided');
  });

  it('returns the default fallback for an empty string', () => {
    expect(getDisplayValue('')).toBe('Not provided');
  });

  it('uses a custom fallback when one is given', () => {
    expect(getDisplayValue(null, 'Chưa cung cấp')).toBe('Chưa cung cấp');
  });
});
