'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { useCandidateDetail } from '@/features/candidates/hooks/use-candidate-detail';
import { useUpdateCandidate } from '@/features/candidates/hooks/use-update-candidate';
import {
  initialCandidateFormValues,
  type CandidateFormErrors,
} from '@/features/candidates/types/candidate-form.type';
import {
  createCandidateSchema,
  type CreateCandidateFormValues,
} from '@/features/candidates/validations/candidate.validation';

type CandidateEditFormProps = {
  candidateId: string;
};

export function CandidateEditForm({ candidateId }: CandidateEditFormProps) {
  const router = useRouter();
  const { candidate, isLoading, errorMessage, refetchCandidate } = useCandidateDetail(candidateId);
  const { isUpdating, updateCurrentCandidate } = useUpdateCandidate(candidateId);
  const [formValues, setFormValues] = useState<CreateCandidateFormValues>(initialCandidateFormValues);
  const [errors, setErrors] = useState<CandidateFormErrors>({});

  useEffect(() => {
    if (!candidate) return;
    setFormValues({
      fullName: candidate.fullName,
      primaryEmail: candidate.primaryEmail ?? '',
      primaryPhone: candidate.primaryPhone ?? '',
      linkedinUrl: candidate.linkedinUrl ?? '',
      githubUrl: candidate.githubUrl ?? '',
      portfolioUrl: candidate.portfolioUrl ?? '',
      location: candidate.location ?? '',
    });
  }, [candidate]);

  const updateField = (field: keyof CreateCandidateFormValues, value: string) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = async () => {
    setErrors({});
    const validation = createCandidateSchema.safeParse(formValues);

    if (!validation.success) {
      const nextErrors: CandidateFormErrors = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateCandidateFormValues | undefined;
        if (field) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      showToast.error('Invalid candidate information', {
        description: validation.error.issues[0]?.message ?? 'Please check the candidate information and try again.',
      });
      return;
    }

    try {
      const updatedCandidate = await updateCurrentCandidate(validation.data);
      showToast.success('Candidate updated successfully', {
        description: `${updatedCandidate.fullName} has been updated.`,
      });
      router.push(`/candidates/${candidateId}`);
    } catch (error) {
      showToast.error('Failed to update candidate', {
        description: error instanceof Error ? error.message : 'Something went wrong while updating the candidate.',
      });
    }
  };

  if (isLoading) {
    return <LoadingState title="Loading candidate..." description="Please wait while the candidate profile is being loaded." />;
  }

  if (errorMessage || !candidate) {
    return (
      <EmptyState
        title={errorMessage ? 'Failed to load candidate' : 'Candidate not found'}
        description={errorMessage ?? 'The candidate profile could not be found.'}
        action={<button type="button" onClick={() => void refetchCandidate()} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Try again</button>}
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-950">Edit candidate information</h2>
        <p className="mt-1 text-sm text-slate-500">Update candidate contact details and profile links.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput id="fullName" label="Full name" value={formValues.fullName} error={errors.fullName} disabled={isUpdating} onChange={(value) => updateField('fullName', value)} required />
          <TextInput id="primaryEmail" label="Email" value={formValues.primaryEmail ?? ''} error={errors.primaryEmail} disabled={isUpdating} onChange={(value) => updateField('primaryEmail', value)} />
          <TextInput id="primaryPhone" label="Phone" value={formValues.primaryPhone ?? ''} error={errors.primaryPhone} disabled={isUpdating} onChange={(value) => updateField('primaryPhone', value)} />
          <TextInput id="location" label="Location" value={formValues.location ?? ''} error={errors.location} disabled={isUpdating} onChange={(value) => updateField('location', value)} />
          <TextInput id="linkedinUrl" label="LinkedIn URL" value={formValues.linkedinUrl ?? ''} error={errors.linkedinUrl} disabled={isUpdating} onChange={(value) => updateField('linkedinUrl', value)} />
          <TextInput id="githubUrl" label="GitHub URL" value={formValues.githubUrl ?? ''} error={errors.githubUrl} disabled={isUpdating} onChange={(value) => updateField('githubUrl', value)} />
          <TextInput id="portfolioUrl" label="Portfolio URL" value={formValues.portfolioUrl ?? ''} error={errors.portfolioUrl} disabled={isUpdating} onChange={(value) => updateField('portfolioUrl', value)} />
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">Changes affect candidate lists, applications, and evaluation context.</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Link href={`/candidates/${candidateId}`} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={isUpdating} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
              {isUpdating ? 'Saving...' : 'Save changes'}
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
