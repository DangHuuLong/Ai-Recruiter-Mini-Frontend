import type { CreateJobDescriptionFormValues } from '@/features/job-descriptions/validations/job-description.validation';

export type JobDescriptionFormErrors = Partial<
  Record<keyof CreateJobDescriptionFormValues, string>
>;

export const initialJobDescriptionFormValues: CreateJobDescriptionFormValues = {
  title: '',
  companyName: '',
  department: '',
  location: '',
  employmentType: '',
  seniority: '',
  rawText: '',
};
