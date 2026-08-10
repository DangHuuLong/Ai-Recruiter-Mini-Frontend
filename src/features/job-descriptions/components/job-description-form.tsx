'use client';

import { Building2Icon, BriefcaseIcon, ClockIcon, MapPinIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { showToast } from '@/components/feedback';
import { Input } from '@/components/ui/input';
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
  const t = useTranslations('jobDescriptions');
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
      showToast.error(t('form.invalidTitle'), {
        description: validation.error.issues[0]?.message ?? t('form.invalidFallback'),
      });
      return;
    }

    try {
      setIsCreating(true);
      const jobDescription = await createJobDescription(validation.data);
      showToast.success(t('form.createSuccessTitle'), {
        description: t('form.createSuccessDescription', { title: jobDescription.title }),
      });
      router.push(`/job-descriptions/${jobDescription.id}`);
    } catch (error) {
      showToast.error(t('form.createFailedTitle'), {
        description: error instanceof Error ? error.message : t('form.createFailedFallback'),
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
      <div className="border-b border-outline px-6 py-5">
        <h2 className="text-lg font-semibold text-on-surface">{t('form.createTitle')}</h2>
        <p className="mt-1 text-sm text-on-surface-muted">{t('form.createDescription')}</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Input id="title" label={t('fields.titleRequired')} icon={<BriefcaseIcon className="size-4" />} value={formValues.title} error={errors.title} disabled={isCreating} placeholder="Senior Backend Developer" onChange={(event) => updateField('title', event.target.value)} />
          <Input id="companyName" label={t('fields.company')} icon={<Building2Icon className="size-4" />} value={formValues.companyName ?? ''} error={errors.companyName} disabled={isCreating} placeholder="AI Recruiter" onChange={(event) => updateField('companyName', event.target.value)} />
          <Input id="department" label={t('fields.department')} icon={<UsersIcon className="size-4" />} value={formValues.department ?? ''} error={errors.department} disabled={isCreating} placeholder="Engineering" onChange={(event) => updateField('department', event.target.value)} />
          <Input id="location" label={t('fields.location')} icon={<MapPinIcon className="size-4" />} value={formValues.location ?? ''} error={errors.location} disabled={isCreating} placeholder="Ho Chi Minh City" onChange={(event) => updateField('location', event.target.value)} />
          <Input id="employmentType" label={t('fields.employmentType')} icon={<ClockIcon className="size-4" />} value={formValues.employmentType ?? ''} error={errors.employmentType} disabled={isCreating} placeholder="Full-time" onChange={(event) => updateField('employmentType', event.target.value)} />
          <Input id="seniority" label={t('fields.seniority')} icon={<TrendingUpIcon className="size-4" />} value={formValues.seniority ?? ''} error={errors.seniority} disabled={isCreating} placeholder="Senior" onChange={(event) => updateField('seniority', event.target.value)} />
        </div>

        <div>
          <label htmlFor="rawText" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{t('fields.rawText')}</label>
          <textarea
            id="rawText"
            value={formValues.rawText}
            onChange={(event) => updateField('rawText', event.target.value)}
            disabled={isCreating}
            rows={14}
            placeholder={t('form.rawTextPlaceholder')}
            className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
          />
          {errors.rawText ? <p className="mt-1.5 text-xs font-medium text-error">{errors.rawText}</p> : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-outline pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-on-surface-muted">{t('form.footerNoteCreate')}</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Link href="/job-descriptions" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant">{t('form.cancel')}</Link>
            <button type="submit" disabled={isCreating} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled">
              {isCreating ? t('form.creating') : t('form.create')}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
