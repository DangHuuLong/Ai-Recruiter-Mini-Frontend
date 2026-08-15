import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { JobDescriptionEditForm } from '@/features/job-descriptions/components/job-description-edit-form';

type JobDescriptionEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDescriptionEditPage({
  params,
}: JobDescriptionEditPageProps) {
  const { id } = await params;
  const t = await getTranslations('jobDescriptions.form');

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title={t('editTitle')}
        description={t('editPageDescription')}
      />

      <JobDescriptionEditForm jobDescriptionId={id} />
    </div>
  );
}
