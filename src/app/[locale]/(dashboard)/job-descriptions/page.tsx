import { FilePlusIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { JobDescriptionList } from '@/features/job-descriptions/components/job-description-list';

export default async function JobDescriptionsPage() {
  const t = await getTranslations('jobDescriptions');

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pageTitle')}
        description={t('pageDescription')}
        actions={
          <Link
            href="/job-descriptions/new"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <FilePlusIcon className="size-4" />
            {t('createJd')}
          </Link>
        }
      />

      <JobDescriptionList />
    </div>
  );
}
