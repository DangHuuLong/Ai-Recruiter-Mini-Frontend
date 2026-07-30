import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const createJobDescriptionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  companyName: optionalText,
  department: optionalText,
  location: optionalText,
  employmentType: optionalText,
  seniority: optionalText,
  rawText: z.string().trim().min(1, 'Raw job description text is required'),
});

export type CreateJobDescriptionFormValues = z.input<typeof createJobDescriptionSchema>;
export type CreateJobDescriptionPayloadValues = z.output<typeof createJobDescriptionSchema>;

export const jobSkillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(150, 'Skill name is too long'),
  normalizedName: optionalText,
  type: z.enum(['REQUIRED', 'PREFERRED']),
  isCore: z.boolean(),
  weightHint: z.coerce.number().min(0, 'Weight must be at least 0').max(1, 'Weight must be at most 1'),
});

export type JobSkillFormValues = z.input<typeof jobSkillSchema>;
export type JobSkillPayloadValues = z.output<typeof jobSkillSchema>;

export const initialJobSkillFormValues: JobSkillFormValues = {
  name: '',
  normalizedName: '',
  type: 'REQUIRED',
  isCore: true,
  weightHint: 1,
};
