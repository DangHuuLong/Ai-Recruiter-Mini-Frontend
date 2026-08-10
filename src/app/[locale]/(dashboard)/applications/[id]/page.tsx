import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import { ApplicationDetail } from '@/features/applications/components/application-detail';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations('applications');

  return (
    <div className="space-y-8">
      <Link
        href="/applications"
        className="inline-flex cursor-pointer text-sm font-semibold text-primary transition hover:underline"
      >
        {t('backToList')}
      </Link>

      <ApplicationDetail applicationId={id} />
    </div>
  );
}
