import { PlusIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { EvaluationList } from '@/features/evaluations/components/evaluation-list';

export default async function EvaluationsPage() {
  const t = await getTranslations('evaluations');

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pageTitle')}
        description={t('pageDescription')}
        actions={
          <Link
            href="/evaluations/new"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <PlusIcon className="size-4" />
            {t('newEvaluation')}
          </Link>
        }
      />

      <EvaluationList />
    </div>
  );
}
