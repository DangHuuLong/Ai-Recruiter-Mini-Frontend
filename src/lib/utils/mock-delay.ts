// Shared helper for feature api.ts files temporarily mocked for static-UI review.
export function mockDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Supports dot-path keys (e.g. "candidate.fullName") for sorting by joined/relation
// fields already present on the mocked, nested response objects.
function getNestedValue(item: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value == null || typeof value !== 'object') {
      return undefined;
    }
    return (value as Record<string, unknown>)[key];
  }, item);
}

export function sortMock<T>(
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

export function paginateMock<T>(
  items: T[],
  page = 1,
  limit = 10,
): { data: T[]; meta: { page: number; limit: number; total: number; totalPages: number } } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    meta: { page, limit, total, totalPages },
  };
}
