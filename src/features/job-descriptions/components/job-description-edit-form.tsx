'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { updateJobDescription } from '@/features/job-descriptions/api/job-description.api';
import { useJobDescriptionDetail } from '@/features/job-descriptions/hooks/use-job-description-detail';
import {
  initialJobDescriptionFormValues,
  type JobDescriptionFormErrors,
} from '@/features/job-descriptions/types/job-description-form.type';
import {
  createJobDescriptionSchema,
  type CreateJobDescriptionFormValues,
} from '@/features/job-descriptions/validations/job-description.validation';

type JobDescriptionEditFormProps = {
  jobDescriptionId: string;
};

export function JobDescriptionEditForm({ jobDescriptionId }: JobDescriptionEditFormProps) {
  const router = useRouter();
  const { jobDescription, isLoading, errorMessage, refetchJobDescription } =
    useJobDescriptionDetail(jobDescriptionId);
  const [formValues, setFormValues] = useState<CreateJobDescriptionFormValues>(
    initialJobDescriptionFormValues,
  );
  const [errors, setErrors] = useState<JobDescriptionFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!jobDescription) return;

    setFormValues({
      title: jobDescription.title,
      companyName: jobDescription.companyName ?? '',
      department: jobDescription.department ?? '',
      location: jobDescription.location ?? '',
      employmentType: jobDescription.employmentType ?? '',
      seniority: jobDescription.seniority ?? '',
      rawText: jobDescription.rawText,
      parserVersion: jobDescription.parserVersion ?? '',
    });
  }, [jobDescription]);

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
      setIsSaving(true);
      await updateJobDescription(jobDescriptionId, validation.data);
      showToast.success('Job description updated successfully');
      router.push(`/job-descriptions/${jobDescriptionId}`);
    } catch (error) {
      showToast.error('Failed to update job description', {
        description: error instanceof Error ? error.message : 'Something went wrong while updating the JD.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState title="Loading job description..." description="Please wait while JD data is being loaded." />;
  }

  if (errorMessage || !jobDescription) {
    return (
      <EmptyState
        title={errorMessage ? 'Failed to load job description' : 'Job description not found'}
        description={errorMessage ?? 'The job description could not be found.'}
        action={<button type="button" onClick={() => void refetchJobDescription()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-950">Edit job description</h2>
        <p className="mt-1 text-sm text-slate-500">Update JD metadata and raw text used by parsing and evaluation flows.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput id="title" label="Title" value={formValues.title} error={errors.title} disabled={isSaving} onChange={(value) => updateField('title', value)} required />
          <TextInput id="companyName" label="Company" value={formValues.companyName ?? ''} error={errors.companyName} disabled={isSaving} onChange={(value) => updateField('companyName', value)} />
          <TextInput id="department" label="Department" value={formValues.department ?? ''} error={errors.department} disabled={isSaving} onChange={(value) => updateField('department', value)} />
          <TextInput id="location" label="Location" value={formValues.location ?? ''} error={errors.location} disabled={isSaving} onChange={(value) => updateField('location', value)} />
          <TextInput id="employmentType" label="Employment Type" value={formValues.employmentType ?? ''} error={errors.employmentType} disabled={isSaving} onChange={(value) => updateField('employmentType', value)} />
          <TextInput id="seniority" label="Seniority" value={formValues.seniority ?? ''} error={errors.seniority} disabled={isSaving} onChange={(value) => updateField('seniority', value)} />
          <TextInput id="parserVersion" label="Parser version" value={formValues.parserVersion ?? ''} error={errors.parserVersion} disabled={isSaving} onChange={(value) => updateField('parserVersion', value)} />
        </div>

        <div>
          <label htmlFor="rawText" className="mb-1 block text-sm font-medium text-slate-800">Raw JD Text <span className="text-red-500">*</span></label>
          <textarea
            id="rawText"
            value={formValues.rawText}
            onChange={(event) => updateField('rawText', event.target.value)}
            disabled={isSaving}
            rows={14}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          {errors.rawText ? <p className="mt-1 text-xs text-red-600">{errors.rawText}</p> : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Link href={`/job-descriptions/${jobDescriptionId}`} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={isSaving} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
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
  required?: boolean;
  onChange: (value: string) => void;
};

function TextInput({ id, label, value, error, disabled, required, onChange }: TextInputProps) {
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
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
