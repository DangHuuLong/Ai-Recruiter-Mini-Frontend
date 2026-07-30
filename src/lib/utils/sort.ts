// Supports dot-path keys (e.g. "candidate.fullName") for sorting by nested/relation fields.
function getNestedValue(item: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value == null || typeof value !== 'object') {
      return undefined;
    }
    return (value as Record<string, unknown>)[key];
  }, item);
}

export function sortByKey<T>(
  items: T[],
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'desc',
): T[] {
  if (!sortBy) {
    return items;
  }

  const direction = sortOrder === 'asc' ? 1 : -1;

  return [...items].sort((a, b) => {
    const valueA = getNestedValue(a, sortBy);
    const valueB = getNestedValue(b, sortBy);

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB) * direction;
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * direction;
    }

    return String(valueA).localeCompare(String(valueB)) * direction;
  });
}
