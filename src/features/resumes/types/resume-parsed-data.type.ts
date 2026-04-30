import type { ReactNode } from 'react';

export type ParsedDataRecord = Record<string, unknown>;

export type ParsedSkill = {
  name: string;
  category?: string | null;
  evidence?: string | null;
  normalizedName?: string | null;
};

export type ParsedNamedItem = {
  name: string;
  description?: string | null;
};

export type ParsedDataSectionProps = {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
};

export type ParsedDataFieldProps = {
  label: string;
  value: unknown;
};

export type ParsedDataListProps = {
  items: ParsedNamedItem[];
  emptyMessage: string;
};

export type ResumeParsedDataProps = {
  parsedData: unknown;
};
