'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { showToast } from '@/components/feedback';
import { createJobDescription } from '@/features/job-descriptions/api/job-description.api';
import {
  initialJobDescriptionFormValues,
  type JobDescriptionFormErrors,
} from '@/features/job-descriptions/types/job-description-form.type';
import {
  createJobDescriptionSchema,
  type CreateJobDescriptionFormValues,
} from '@/features/job-descriptions/validations/job-description.validation';

export function JobDescriptionForm() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<CreateJobDescriptionFormValues>(
    initialJobDescriptionFormValues,
  );
  const [errors, setErrors] = useState<JobDescriptionFormErrors>({});
  const [isCreating, setIsCreating] = useState(false);

  const updateField = (field: keyof CreateJobDescriptionFormValues, value: string) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = async () => {
    setErrors({});
    const validation = createJobDescriptionSchema.safeParse(formValues);

    if (!validation.success) {
      const nextErrors: JobDescriptionFormErrors = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateJobDescriptionFormValues | undefined;
        if (field) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      showToast.error('Invalid job description', {
        description: validation.error.issues[0]?.message ?? 'Please check the form and try again.',
      });
      return;
    }

    try {
      setIsCreating(true);
      const jobDescription = await createJobDescription(validation.data);
      showToast.success('Job description created successfully', {
        description: `${jobDescription.title} has been added.`,
      });
      router.push(`/job-descriptions/${jobDescription.id}`);
    } catch (error) {
      showToast.error('Failed to create job description', {
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-950">Job description information</h2>
        <p className="mt-1 text-sm text-slate-500">Create a hiring position and store the raw JD text used for parsing.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput id="title" label="Title" value={formValues.title} error={errors.title} disabled={isCreating} placeholder="Senior Backend Developer" onChange={(value) => updateField('title', value)} required />
          <TextInput id="companyName" label="Company" value={formValues.companyName ?? ''} error={errors.companyName} disabled={isCreating} placeholder="AI Recruiter" onChange={(value) => updateField('companyName', value)} />
          <TextInput id="department" label="Department" value={formValues.department ?? ''} error={errors.department} disabled={isCreating} placeholder="Engineering" onChange={(value) => updateField('department', value)} />
          <TextInput id="location" label="Location" value={formValues.location ?? ''} error={errors.location} disabled={isCreating} placeholder="Ho Chi Minh City" onChange={(value) => updateField('location', value)} />
          <TextInput id="employmentType" label="Employment Type" value={formValues.employmentType ?? ''} error={errors.employmentType} disabled={isCreating} placeholder="Full-time" onChange={(value) => updateField('employmentType', value)} />
          <TextInput id="seniority" label="Seniority" value={formValues.seniority ?? ''} error={errors.seniority} disabled={isCreating} placeholder="Senior" onChange={(value) => updateField('seniority', value)} />
        </div>

        <div>
          <label htmlFor="rawText" className="mb-1 block text-sm font-medium text-slate-800">Raw JD Text <span className="text-red-500">*</span></label>
          <textarea
            id="rawText"
            value={formValues.rawText}
            onChange={(event) => updateField('rawText', event.target.value)}
            disabled={isCreating}
            rows={14}
            placeholder="Paste the full job description here..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          {errors.rawText ? <p className="mt-1 text-xs text-red-600">{errors.rawText}</p> : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">The raw text can be parsed later to extract responsibilities, requirements, and skills.</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Link href="/job-descriptions" className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={isCreating} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
              {isCreating ? 'Creating...' : 'Create JD'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

type TextInputProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function TextInput({ id, label, value, error, disabled, placeholder, required, onChange }: TextInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-800">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
