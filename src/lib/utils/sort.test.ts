import { describe, expect, it } from 'vitest';

import { sortByKey } from './sort';

describe('sortByKey', () => {
  it('returns the items unchanged when sortBy is not given', () => {
    const items = [{ name: 'B' }, { name: 'A' }];
    expect(sortByKey(items)).toEqual(items);
  });

  it('sorts strings ascending by localeCompare', () => {
    const items = [{ name: 'Banana' }, { name: 'Apple' }, { name: 'Cherry' }];
    expect(sortByKey(items, 'name', 'asc').map((i) => i.name)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('sorts numbers descending by default', () => {
    const items = [{ score: 10 }, { score: 30 }, { score: 20 }];
    expect(sortByKey(items, 'score').map((i) => i.score)).toEqual([30, 20, 10]);
  });

  it('resolves a nested dot-path key', () => {
    const items = [
      { candidate: { fullName: 'Zed' } },
      { candidate: { fullName: 'Anna' } },
    ];
    expect(sortByKey(items, 'candidate.fullName', 'asc').map((i) => i.candidate.fullName)).toEqual([
      'Anna',
      'Zed',
    ]);
  });

  it('pushes null/undefined values to the end regardless of sort order', () => {
    const items = [{ score: 5 }, { score: null }, { score: 10 }];
    expect(sortByKey(items, 'score', 'asc').map((i) => i.score)).toEqual([5, 10, null]);
  });

  it('does not mutate the original array', () => {
    const items = [{ score: 1 }, { score: 2 }];
    const result = sortByKey(items, 'score', 'asc');
    expect(result).not.toBe(items);
    expect(items.map((i) => i.score)).toEqual([1, 2]);
  });
});
