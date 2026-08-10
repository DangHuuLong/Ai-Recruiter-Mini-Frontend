import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { JobDescriptionForm } from '@/features/job-descriptions/components/job-description-form';

export default async function NewJobDescriptionPage() {
  const t = await getTranslations('jobDescriptions');

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title={t('createJd')}
        description={t('newPageDescription')}
        backHref="/job-descriptions"
        backLabel={t('backToList')}
      />

      <JobDescriptionForm />
    </div>
  );
}
