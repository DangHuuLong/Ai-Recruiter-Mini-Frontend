'use client';

import { Code2Icon, GlobeIcon, LinkIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { showToast } from '@/components/feedback/toast';
import { Input } from '@/components/ui/input';
import { useCreateCandidate } from '@/features/candidates/hooks/use-create-candidate';
import { useCandidateListStore } from '@/features/candidates/stores/candidate-list.store';
import {
  initialCandidateFormValues,
  type CandidateFormErrors,
} from '@/features/candidates/types/candidate-form.type';
import {
  createCandidateSchema,
  type CreateCandidateFormValues,
} from '@/features/candidates/validations/candidate.validation';

export function CandidateForm() {
  const [formValues, setFormValues] =
    useState<CreateCandidateFormValues>(initialCandidateFormValues);
  const [errors, setErrors] = useState<CandidateFormErrors>({});

  const { isCreating, createNewCandidate } = useCreateCandidate();
  const resetCandidates = useCandidateListStore(
    (state) => state.resetCandidates,
  );

  const updateField = (
    field: keyof CreateCandidateFormValues,
    value: string,
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleSubmit = async () => {
    setErrors({});

    const validation = createCandidateSchema.safeParse(formValues);

    if (!validation.success) {
      const nextErrors: CandidateFormErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as
          | keyof CreateCandidateFormValues
          | undefined;

        if (field) {
          nextErrors[field] = issue.message;
        }
      });

      setErrors(nextErrors);

      showToast.error('Invalid candidate information', {
        description:
          validation.error.issues[0]?.message ??
          'Please check the candidate information and try again.',
      });

      return;
    }

    try {
      const candidate = await createNewCandidate(validation.data);

      resetCandidates();

      showToast.success('Candidate created successfully', {
        description: `${candidate.fullName} has been added to the candidate list.`,
      });

      setFormValues(initialCandidateFormValues);
    } catch (error) {
      showToast.error('Failed to create candidate', {
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while creating the candidate. Please try again.',
      });
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
      <div className="border-b border-outline px-6 py-5">
        <h2 className="text-lg font-semibold text-on-surface">
          Candidate information
        </h2>

        <p className="mt-1 text-sm text-on-surface-muted">
          Create a candidate profile before uploading resumes or creating
          applications.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        className="space-y-6 px-6 py-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              id="fullName"
              label="Full name"
              icon={<UserIcon className="size-4" />}
              value={formValues.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              disabled={isCreating}
              placeholder="Nguyen Van A"
              error={errors.fullName}
            />
          </div>

          <Input
            id="primaryEmail"
            label="Email"
            icon={<MailIcon className="size-4" />}
            value={formValues.primaryEmail ?? ''}
            onChange={(event) => updateField('primaryEmail', event.target.value)}
            disabled={isCreating}
            placeholder="candidate@example.com"
            error={errors.primaryEmail}
          />

          <Input
            id="primaryPhone"
            label="Phone"
            icon={<PhoneIcon className="size-4" />}
            value={formValues.primaryPhone ?? ''}
            onChange={(event) => updateField('primaryPhone', event.target.value)}
            disabled={isCreating}
            placeholder="0900000001"
            error={errors.primaryPhone}
          />

          <Input
            id="linkedinUrl"
            label="LinkedIn URL"
            icon={<LinkIcon className="size-4" />}
            value={formValues.linkedinUrl ?? ''}
            onChange={(event) => updateField('linkedinUrl', event.target.value)}
            disabled={isCreating}
            placeholder="https://linkedin.com/in/candidate"
            error={errors.linkedinUrl}
          />

          <Input
            id="githubUrl"
            label="GitHub URL"
            icon={<Code2Icon className="size-4" />}
            value={formValues.githubUrl ?? ''}
            onChange={(event) => updateField('githubUrl', event.target.value)}
            disabled={isCreating}
            placeholder="https://github.com/candidate"
            error={errors.githubUrl}
          />

          <Input
            id="portfolioUrl"
            label="Portfolio URL"
            icon={<GlobeIcon className="size-4" />}
            value={formValues.portfolioUrl ?? ''}
            onChange={(event) => updateField('portfolioUrl', event.target.value)}
            disabled={isCreating}
            placeholder="https://candidate.dev"
            error={errors.portfolioUrl}
          />

          <Input
            id="location"
            label="Location"
            icon={<MapPinIcon className="size-4" />}
            value={formValues.location ?? ''}
            onChange={(event) => updateField('location', event.target.value)}
            disabled={isCreating}
            placeholder="Ho Chi Minh City"
            error={errors.location}
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-outline pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-on-surface-muted">
            The candidate profile will be used for resumes, applications, and
            evaluations.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Link
              href="/candidates"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-disabled"
            >
              {isCreating ? 'Creating...' : 'Create candidate'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}