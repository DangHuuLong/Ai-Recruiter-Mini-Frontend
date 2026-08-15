import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { ApplicationEditForm } from '@/features/applications/components/application-edit-form';

type ApplicationEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApplicationEditPage({
  params,
}: ApplicationEditPageProps) {
  const { id } = await params;
  const t = await getTranslations('applications.editForm');

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title={t('editPageTitle')}
        description={t('editPageDescription')}
      />

      <ApplicationEditForm applicationId={id} />
    </div>
  );
}
