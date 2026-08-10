'use client';

import { Code2Icon, GlobeIcon, LinkIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('candidates');
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
      showToast.error(t('form.invalidTitle'), {
        description: validation.error.issues[0]?.message ?? t('form.invalidFallback'),
      });
      return;
    }

    try {
      const updatedCandidate = await updateCurrentCandidate(validation.data);
      showToast.success(t('form.updateSuccessTitle'), {
        description: t('form.updateSuccessDescription', { name: updatedCandidate.fullName }),
      });
      router.push(`/candidates/${candidateId}`);
    } catch (error) {
      showToast.error(t('form.updateFailedTitle'), {
        description: error instanceof Error ? error.message : t('form.updateFailedFallback'),
      });
    }
  };

  if (isLoading) {
    return <LoadingState title={t('detail.loadingTitle')} description={t('detail.loadingDescription')} />;
  }

  if (errorMessage || !candidate) {
    return (
      <EmptyState
        title={errorMessage ? t('detail.errorTitle') : t('detail.notFoundTitle')}
        description={errorMessage ?? t('detail.notFoundDescription')}
        action={
          <button
            type="button"
            onClick={() => void refetchCandidate()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('detail.tryAgain')}
          </button>
        }
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
      <div className="border-b border-outline px-6 py-5">
        <h2 className="text-lg font-semibold text-on-surface">{t('form.editTitle')}</h2>
        <p className="mt-1 text-sm text-on-surface-muted">{t('form.editDescription')}</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Input id="fullName" label={t('fields.fullNameRequired')} icon={<UserIcon className="size-4" />} value={formValues.fullName} error={errors.fullName} disabled={isUpdating} onChange={(event) => updateField('fullName', event.target.value)} />
          <Input id="primaryEmail" label={t('fields.email')} icon={<MailIcon className="size-4" />} value={formValues.primaryEmail ?? ''} error={errors.primaryEmail} disabled={isUpdating} onChange={(event) => updateField('primaryEmail', event.target.value)} />
          <Input id="primaryPhone" label={t('fields.phone')} icon={<PhoneIcon className="size-4" />} value={formValues.primaryPhone ?? ''} error={errors.primaryPhone} disabled={isUpdating} onChange={(event) => updateField('primaryPhone', event.target.value)} />
          <Input id="location" label={t('fields.location')} icon={<MapPinIcon className="size-4" />} value={formValues.location ?? ''} error={errors.location} disabled={isUpdating} onChange={(event) => updateField('location', event.target.value)} />
          <Input id="linkedinUrl" label={t('fields.linkedinUrl')} icon={<LinkIcon className="size-4" />} value={formValues.linkedinUrl ?? ''} error={errors.linkedinUrl} disabled={isUpdating} onChange={(event) => updateField('linkedinUrl', event.target.value)} />
          <Input id="githubUrl" label={t('fields.githubUrl')} icon={<Code2Icon className="size-4" />} value={formValues.githubUrl ?? ''} error={errors.githubUrl} disabled={isUpdating} onChange={(event) => updateField('githubUrl', event.target.value)} />
          <Input id="portfolioUrl" label={t('fields.portfolioUrl')} icon={<GlobeIcon className="size-4" />} value={formValues.portfolioUrl ?? ''} error={errors.portfolioUrl} disabled={isUpdating} onChange={(event) => updateField('portfolioUrl', event.target.value)} />
        </div>

        <div className="flex flex-col gap-4 border-t border-outline pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-on-surface-muted">{t('form.footerNoteEdit')}</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Link href={`/candidates/${candidateId}`} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant">{t('form.cancel')}</Link>
            <button type="submit" disabled={isUpdating} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled">
              {isUpdating ? t('form.saving') : t('form.save')}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
