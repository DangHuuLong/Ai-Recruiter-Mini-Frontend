import type { ReactNode } from 'react';

export type ParsedDataRecord = Record<string, unknown>;

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
  items: string[];
  emptyMessage: string;
};

export type ResumeParsedDataProps = {
  parsedData: unknown;
};
