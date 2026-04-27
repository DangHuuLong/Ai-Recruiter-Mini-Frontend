import type { CreateCandidateFormValues } from '@/features/candidates/validations/candidate.validation';

export type CandidateFormErrors = Partial<
  Record<keyof CreateCandidateFormValues, string>
>;

export const initialCandidateFormValues: CreateCandidateFormValues = {
  fullName: '',
  primaryEmail: undefined,
  primaryPhone: undefined,
  linkedinUrl: undefined,
  githubUrl: undefined,
  portfolioUrl: undefined,
  location: undefined,
};