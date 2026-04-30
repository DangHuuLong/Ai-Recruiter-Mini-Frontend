import type {
  ParsedDataRecord,
  ParsedNamedItem,
  ParsedSkill,
} from '@/features/resumes/types/resume-parsed-data.type';

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

export function getParsedDataNamedList(
  data: ParsedDataRecord,
  key: string,
): ParsedNamedItem[] {
  const value = data[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return {
          name: item,
          description: null,
        };
      }

      if (!isParsedDataRecord(item)) {
        return null;
      }

      const name = getParsedDataString(item, 'name');

      if (!name) {
        return null;
      }

      return {
        name,
        description:
          getParsedDataString(item, 'proficiency') ??
          getParsedDataString(item, 'description'),
      };
    })
    .filter((item): item is ParsedNamedItem => Boolean(item));
}

export function getParsedSkillList(data: ParsedDataRecord): ParsedSkill[] {
  const value = data.skills;

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return {
          name: item,
          category: null,
          evidence: null,
          normalizedName: item.toLowerCase(),
        };
      }

      if (!isParsedDataRecord(item)) {
        return null;
      }

      const name = getParsedDataString(item, 'name');

      if (!name) {
        return null;
      }

      return {
        name,
        category: getParsedDataString(item, 'category'),
        evidence: getParsedDataString(item, 'evidence'),
        normalizedName:
          getParsedDataString(item, 'normalized_name') ??
          getParsedDataString(item, 'normalizedName'),
      };
    })
    .filter((item): item is ParsedSkill => Boolean(item));
}

export function getSkillIconLabel(skill: string): string {
  const normalizedSkill = skill.toLowerCase();

  if (normalizedSkill.includes('react')) {
    return '⚛';
  }

  if (normalizedSkill.includes('node')) {
    return '⬢';
  }

  if (normalizedSkill.includes('typescript')) {
    return 'TS';
  }

  if (normalizedSkill.includes('javascript')) {
    return 'JS';
  }

  if (normalizedSkill === 'html' || normalizedSkill.includes('html')) {
    return 'H';
  }

  if (normalizedSkill === 'css' || normalizedSkill.includes('css')) {
    return 'CSS';
  }

  if (normalizedSkill.includes('python')) {
    return 'Py';
  }

  if (normalizedSkill.includes('csharp') || normalizedSkill.includes('c#')) {
    return 'C#';
  }

  if (normalizedSkill.includes('cpp') || normalizedSkill.includes('c++')) {
    return 'C++';
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

  if (normalizedSkill.includes('github')) {
    return 'GH';
  }

  if (normalizedSkill.includes('git')) {
    return '⌁';
  }

  if (normalizedSkill.includes('dotnet') || normalizedSkill.includes('.net')) {
    return '.NET';
  }

  return skill.slice(0, 2).toUpperCase();
}
