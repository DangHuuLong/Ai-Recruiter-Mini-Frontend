// In-memory GET response cache, keyed by full request URL. Cleared on any mutating
// request (POST/PUT/PATCH/DELETE) and on session end, so callers never need to think
// about invalidation themselves.
type CacheEntry = { data: unknown; expiresAt: number };

const DEFAULT_TTL_MS = 30_000;

const store = new Map<string, CacheEntry>();

export function readApiCache<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }

  return entry.data as T;
}

export function writeApiCache(key: string, data: unknown, ttlMs: number = DEFAULT_TTL_MS): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function clearApiCache(): void {
  store.clear();
}
