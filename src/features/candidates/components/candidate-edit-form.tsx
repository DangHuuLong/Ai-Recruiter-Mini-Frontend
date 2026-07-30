'use client';

import { Code2Icon, GlobeIcon, LinkIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { Input } from '@/components/ui/input';
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
        action={
          <button
            type="button"
            onClick={() => void refetchCandidate()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Try again
          </button>
        }
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
      <div className="border-b border-outline px-6 py-5">
        <h2 className="text-lg font-semibold text-on-surface">Edit candidate information</h2>
        <p className="mt-1 text-sm text-on-surface-muted">Update candidate contact details and profile links.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Input id="fullName" label="Full name *" icon={<UserIcon className="size-4" />} value={formValues.fullName} error={errors.fullName} disabled={isUpdating} onChange={(event) => updateField('fullName', event.target.value)} />
          <Input id="primaryEmail" label="Email" icon={<MailIcon className="size-4" />} value={formValues.primaryEmail ?? ''} error={errors.primaryEmail} disabled={isUpdating} onChange={(event) => updateField('primaryEmail', event.target.value)} />
          <Input id="primaryPhone" label="Phone" icon={<PhoneIcon className="size-4" />} value={formValues.primaryPhone ?? ''} error={errors.primaryPhone} disabled={isUpdating} onChange={(event) => updateField('primaryPhone', event.target.value)} />
          <Input id="location" label="Location" icon={<MapPinIcon className="size-4" />} value={formValues.location ?? ''} error={errors.location} disabled={isUpdating} onChange={(event) => updateField('location', event.target.value)} />
          <Input id="linkedinUrl" label="LinkedIn URL" icon={<LinkIcon className="size-4" />} value={formValues.linkedinUrl ?? ''} error={errors.linkedinUrl} disabled={isUpdating} onChange={(event) => updateField('linkedinUrl', event.target.value)} />
          <Input id="githubUrl" label="GitHub URL" icon={<Code2Icon className="size-4" />} value={formValues.githubUrl ?? ''} error={errors.githubUrl} disabled={isUpdating} onChange={(event) => updateField('githubUrl', event.target.value)} />
          <Input id="portfolioUrl" label="Portfolio URL" icon={<GlobeIcon className="size-4" />} value={formValues.portfolioUrl ?? ''} error={errors.portfolioUrl} disabled={isUpdating} onChange={(event) => updateField('portfolioUrl', event.target.value)} />
        </div>

        <div className="flex flex-col gap-4 border-t border-outline pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-on-surface-muted">Changes affect candidate lists, applications, and evaluation context.</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Link href={`/candidates/${candidateId}`} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant">Cancel</Link>
            <button type="submit" disabled={isUpdating} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled">
              {isUpdating ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
