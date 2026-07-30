import type { Resume } from '@/features/resumes/types/resume.type';

export type UseParseResumeState = {
  isParsing: boolean;
  parseErrorMessage: string | null;
  parseResume: () => Promise<Resume | null>;
  resetParseError: () => void;
};
