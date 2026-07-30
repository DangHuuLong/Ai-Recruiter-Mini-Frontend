'use client';

import { Building2Icon, BriefcaseIcon, ClockIcon, MapPinIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { Input } from '@/components/ui/input';
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
        action={<button type="button" onClick={() => void refetchJobDescription()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">Try again</button>}
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
      <div className="border-b border-outline px-6 py-5">
        <h2 className="text-lg font-semibold text-on-surface">Edit job description</h2>
        <p className="mt-1 text-sm text-on-surface-muted">Update JD metadata and raw text used by parsing and evaluation flows.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Input id="title" label="Title *" icon={<BriefcaseIcon className="size-4" />} value={formValues.title} error={errors.title} disabled={isSaving} onChange={(event) => updateField('title', event.target.value)} />
          <Input id="companyName" label="Company" icon={<Building2Icon className="size-4" />} value={formValues.companyName ?? ''} error={errors.companyName} disabled={isSaving} onChange={(event) => updateField('companyName', event.target.value)} />
          <Input id="department" label="Department" icon={<UsersIcon className="size-4" />} value={formValues.department ?? ''} error={errors.department} disabled={isSaving} onChange={(event) => updateField('department', event.target.value)} />
          <Input id="location" label="Location" icon={<MapPinIcon className="size-4" />} value={formValues.location ?? ''} error={errors.location} disabled={isSaving} onChange={(event) => updateField('location', event.target.value)} />
          <Input id="employmentType" label="Employment Type" icon={<ClockIcon className="size-4" />} value={formValues.employmentType ?? ''} error={errors.employmentType} disabled={isSaving} onChange={(event) => updateField('employmentType', event.target.value)} />
          <Input id="seniority" label="Seniority" icon={<TrendingUpIcon className="size-4" />} value={formValues.seniority ?? ''} error={errors.seniority} disabled={isSaving} onChange={(event) => updateField('seniority', event.target.value)} />
        </div>

        <div>
          <label htmlFor="rawText" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Raw JD Text *</label>
          <textarea
            id="rawText"
            value={formValues.rawText}
            onChange={(event) => updateField('rawText', event.target.value)}
            disabled={isSaving}
            rows={14}
            className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
          />
          {errors.rawText ? <p className="mt-1.5 text-xs font-medium text-error">{errors.rawText}</p> : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-outline pt-5">
          <Link href={`/job-descriptions/${jobDescriptionId}`} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant">Cancel</Link>
          <button type="submit" disabled={isSaving} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled">
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
