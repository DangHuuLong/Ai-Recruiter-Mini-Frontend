export function getDisplayValue(value?: string | null, fallback = 'Not provided'): string {
  return value || fallback;
}