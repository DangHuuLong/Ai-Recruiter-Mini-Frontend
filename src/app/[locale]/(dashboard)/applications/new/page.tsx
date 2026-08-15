import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { ApplicationForm } from '@/features/applications/components/application-form';

export default async function NewApplicationPage() {
  const t = await getTranslations('applications');

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          href="/applications"
          className="cursor-pointer text-sm font-semibold text-primary transition hover:underline"
        >
          {t('backToList')}
        </Link>

        <div className="mt-4">
          <PageHeader
            title={t('newPage.title')}
            description={t('newPage.description')}
          />
        </div>
      </div>

      <ApplicationForm />
    </div>
  );
}
