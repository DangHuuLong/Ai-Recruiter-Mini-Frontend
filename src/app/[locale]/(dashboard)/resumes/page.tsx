import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { ResumeList } from '@/features/resumes/components/resume-list';
import { ResumeUploadForm } from '@/features/resumes/components/resume-upload-form';

export default async function ResumesPage() {
  const t = await getTranslations('resumes');

  return (
    <div className="space-y-6">
      <PageHeader title={t('pageTitle')} description={t('pageDescription')} />

      <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
        <ResumeUploadForm />
        <ResumeList />
      </div>
    </div>
  );
}