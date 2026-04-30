import type { ParsedDataRecord } from '@/features/resumes/types/resume-parsed-data.type';

const EMPTY_STRING_LIST: string[] = [];

export function isParsedDataRecord(value: unknown): value is ParsedDataRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function getParsedDataRecord(
  data: ParsedDataRecord,
  key: string,
): ParsedDataRecord | null {
  const value = data[key];

  return isParsedDataRecord(value) ? value : null;
}

export function getParsedDataString(
  data: ParsedDataRecord | null,
  key: string,
): string | null {
  if (!data) {
    return null;
  }

  const value = data[key];

  return typeof value === 'string' && value.trim() ? value : null;
}

export function getParsedDataStringList(
  data: ParsedDataRecord,
  key: string,
): string[] {
  const value = data[key];

  if (!Array.isArray(value)) {
    return EMPTY_STRING_LIST;
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getParsedDataRecordList(
  data: ParsedDataRecord,
  key: string,
): ParsedDataRecord[] {
  const value = data[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isParsedDataRecord);
}

export function getSkillIconLabel(skill: string): string {
  const normalizedSkill = skill.toLowerCase();

  if (normalizedSkill.includes('react')) {
    return '⚛';
  }

  if (normalizedSkill.includes('node')) {
    return '⬢';
  }

  if (normalizedSkill.includes('typescript') || normalizedSkill.includes('javascript')) {
    return 'TS';
  }

  if (normalizedSkill.includes('python')) {
    return 'Py';
  }

  if (normalizedSkill.includes('java') && !normalizedSkill.includes('javascript')) {
    return 'J';
  }

  if (normalizedSkill.includes('sql') || normalizedSkill.includes('postgres')) {
    return 'DB';
  }

  if (normalizedSkill.includes('docker')) {
    return '🐳';
  }

  if (normalizedSkill.includes('aws') || normalizedSkill.includes('cloud')) {
    return '☁';
  }

  if (normalizedSkill.includes('git')) {
    return '⌁';
  }

  return skill.slice(0, 2).toUpperCase();
}
