import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { ResumeEditForm } from '@/features/resumes/components/resume-edit-form';

type ResumeEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResumeEditPage({ params }: ResumeEditPageProps) {
  const { id } = await params;
  const t = await getTranslations('resumes.editForm');

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader title={t('editPageTitle')} description={t('editPageDescription')} />

      <ResumeEditForm resumeId={id} />
    </div>
  );
}
