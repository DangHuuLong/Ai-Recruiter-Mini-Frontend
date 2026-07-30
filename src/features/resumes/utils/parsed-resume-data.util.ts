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
    .filter((item) => item !== null);
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
    .filter((item) => item !== null);
}
