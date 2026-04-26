import { z } from 'zod';

const MAX_RESUME_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_RESUME_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const resumeUploadSchema = z.object({
  candidateId: z.string().trim().min(1, 'Candidate ID is required'),
  file: z
    .instanceof(File, { message: 'CV file is required' })
    .refine((file) => ACCEPTED_RESUME_MIME_TYPES.includes(file.type), {
      message: 'Only PDF and DOCX files are allowed',
    })
    .refine((file) => file.size <= MAX_RESUME_FILE_SIZE, {
      message: 'File size must not exceed 5 MB',
    }),
});

export type ResumeUploadFormValues = z.infer<typeof resumeUploadSchema>;
