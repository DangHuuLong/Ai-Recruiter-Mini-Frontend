import { z } from 'zod';

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const optionalStringSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().optional(),
);

const optionalEmailSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().email('Email is invalid').optional(),
);

const optionalUrlSchema = (message: string) => {
  return z.preprocess(emptyStringToUndefined, z.string().url(message).optional());
};

export const createCandidateSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  primaryEmail: optionalEmailSchema,
  primaryPhone: optionalStringSchema,
  linkedinUrl: optionalUrlSchema('LinkedIn URL is invalid'),
  githubUrl: optionalUrlSchema('GitHub URL is invalid'),
  portfolioUrl: optionalUrlSchema('Portfolio URL is invalid'),
  location: optionalStringSchema,
});

export type CreateCandidateFormValues = z.infer<typeof createCandidateSchema>;