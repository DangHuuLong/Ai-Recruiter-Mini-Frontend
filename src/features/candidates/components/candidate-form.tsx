'use client';

import Link from 'next/link';
import { useState } from 'react';

import { showToast } from '@/components/feedback/toast';
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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Candidate information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
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
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-slate-800"
            >
              Full name
            </label>

            <input
              id="fullName"
              value={formValues.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              disabled={isCreating}
              placeholder="Nguyen Van A"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />

            {errors.fullName ? (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="primaryEmail"
              className="mb-1 block text-sm font-medium text-slate-800"
            >
              Email
            </label>

            <input
              id="primaryEmail"
              value={formValues.primaryEmail ?? ''}
              onChange={(event) =>
                updateField('primaryEmail', event.target.value)
              }
              disabled={isCreating}
              placeholder="candidate@example.com"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />

            {errors.primaryEmail ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.primaryEmail}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="primaryPhone"
              className="mb-1 block text-sm font-medium text-slate-800"
            >
              Phone
            </label>

            <input
              id="primaryPhone"
              value={formValues.primaryPhone ?? ''}
              onChange={(event) =>
                updateField('primaryPhone', event.target.value)
              }
              disabled={isCreating}
              placeholder="0900000001"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />

            {errors.primaryPhone ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.primaryPhone}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="linkedinUrl"
              className="mb-1 block text-sm font-medium text-slate-800"
            >
              LinkedIn URL
            </label>

            <input
              id="linkedinUrl"
              value={formValues.linkedinUrl ?? ''}
              onChange={(event) =>
                updateField('linkedinUrl', event.target.value)
              }
              disabled={isCreating}
              placeholder="https://linkedin.com/in/candidate"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />

            {errors.linkedinUrl ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.linkedinUrl}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="githubUrl"
              className="mb-1 block text-sm font-medium text-slate-800"
            >
              GitHub URL
            </label>

            <input
              id="githubUrl"
              value={formValues.githubUrl ?? ''}
              onChange={(event) => updateField('githubUrl', event.target.value)}
              disabled={isCreating}
              placeholder="https://github.com/candidate"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />

            {errors.githubUrl ? (
              <p className="mt-1 text-xs text-red-600">{errors.githubUrl}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="portfolioUrl"
              className="mb-1 block text-sm font-medium text-slate-800"
            >
              Portfolio URL
            </label>

            <input
              id="portfolioUrl"
              value={formValues.portfolioUrl ?? ''}
              onChange={(event) =>
                updateField('portfolioUrl', event.target.value)
              }
              disabled={isCreating}
              placeholder="https://candidate.dev"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />

            {errors.portfolioUrl ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.portfolioUrl}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-medium text-slate-800"
            >
              Location
            </label>

            <input
              id="location"
              value={formValues.location ?? ''}
              onChange={(event) => updateField('location', event.target.value)}
              disabled={isCreating}
              placeholder="Ho Chi Minh City"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />

            {errors.location ? (
              <p className="mt-1 text-xs text-red-600">{errors.location}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            The candidate profile will be used for resumes, applications, and
            evaluations.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Link
              href="/candidates"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isCreating ? 'Creating...' : 'Create candidate'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}