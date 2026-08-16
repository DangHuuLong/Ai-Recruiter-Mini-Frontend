import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('joins multiple class strings', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center');
  });

  it('drops falsy values (undefined/null/false/empty string)', () => {
    expect(cn('flex', undefined, null, false, '', 'gap-2')).toBe('flex gap-2');
  });

  it('resolves conflicting Tailwind utility classes, keeping the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('keeps non-conflicting classes from a conditional object', () => {
    expect(cn('text-sm', { 'font-bold': true, italic: false })).toBe('text-sm font-bold');
  });
});
