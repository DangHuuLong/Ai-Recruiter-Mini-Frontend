export const FILE_SIZE = {
  MB: 1024 * 1024,
} as const;

export const DEFAULT_MAX_FILE_SIZE = 5 * FILE_SIZE.MB;

export const ACCEPTED_RESUME_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const ACCEPTED_RESUME_FILE_EXTENSIONS = ['.pdf', '.docx'] as const;