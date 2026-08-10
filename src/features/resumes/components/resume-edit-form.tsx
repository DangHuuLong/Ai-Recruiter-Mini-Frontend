'use client';

import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { Input } from '@/components/ui/input';
import { updateResume } from '@/features/resumes/api/resume.api';
import { useResumeDetail } from '@/features/resumes/hooks/use-resume-detail';

type ResumeEditFormProps = {
  resumeId: string;
};

export function ResumeEditForm({ resumeId }: ResumeEditFormProps) {
  const t = useTranslations('resumes.editForm');
  const router = useRouter();
  const { resume, isLoading, errorMessage, refetchResume } = useResumeDetail(resumeId);
  const [candidateId, setCandidateId] = useState('');
  const [parserVersion, setParserVersion] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!resume) return;
    setCandidateId(resume.candidateId);
    setParserVersion(resume.parserVersion ?? '');
  }, [resume]);

  const handleSubmit = async () => {
    if (!candidateId.trim()) {
      showToast.warning(t('candidateIdRequired'));
      return;
    }

    try {
      setIsSaving(true);
      await updateResume(resumeId, {
        candidateId: candidateId.trim(),
        parserVersion: parserVersion.trim() || undefined,
      });
      showToast.success(t('successTitle'));
      router.push(`/resumes/${resumeId}`);
    } catch (error) {
      showToast.error(t('failedTitle'), {
        description: error instanceof Error ? error.message : t('failedFallback'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState title={t('loadingTitle')} description={t('loadingDescription')} />;
  }

  if (errorMessage || !resume) {
    return (
      <EmptyState
        title={errorMessage ? t('errorTitle') : t('notFoundTitle')}
        description={errorMessage ?? t('notFoundDescription')}
        action={<button type="button" onClick={() => void refetchResume()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover">{t('tryAgain')}</button>}
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
      <div className="border-b border-outline px-6 py-5">
        <h2 className="text-lg font-semibold text-on-surface">{t('title')}</h2>
        <p className="mt-1 text-sm text-on-surface-muted">{t('description')}</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label={t('candidateIdLabel')}
            value={candidateId}
            onChange={(event) => setCandidateId(event.target.value)}
            disabled={isSaving}
          />
          <Input
            label={t('parserVersionLabel')}
            value={parserVersion}
            onChange={(event) => setParserVersion(event.target.value)}
            disabled={isSaving}
            placeholder="v1"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-outline pt-5">
          <Link href={`/resumes/${resumeId}`} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant">{t('cancel')}</Link>
          <button type="submit" disabled={isSaving} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled">
            {isSaving ? t('saving') : t('save')}
          </button>
        </div>
      </form>
    </section>
  );
}
