import {
  ACCEPTED_RESUME_FILE_EXTENSIONS,
  ACCEPTED_RESUME_FILE_TYPES,
  DEFAULT_MAX_FILE_SIZE,
} from '@/lib/constants/file.constants';

export const isAcceptedResumeFile = (file: File): boolean => {
  const fileName = file.name.toLowerCase();

  return (
    ACCEPTED_RESUME_FILE_TYPES.includes(
      file.type as (typeof ACCEPTED_RESUME_FILE_TYPES)[number],
    ) ||
    ACCEPTED_RESUME_FILE_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension),
    )
  );
};

export const isValidResumeFileSize = (file: File): boolean => {
  return file.size <= DEFAULT_MAX_FILE_SIZE;
};

export const getAcceptedResumeFileInputValue = (): string => {
  return ACCEPTED_RESUME_FILE_EXTENSIONS.join(',');
};