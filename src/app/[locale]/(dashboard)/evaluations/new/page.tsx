import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { EvaluationForm } from '@/features/evaluations/components/evaluation-form';

export default async function NewEvaluationPage() {
  const t = await getTranslations('evaluations');

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title={t('newPage.title')}
        description={t('newPage.description')}
        backHref="/evaluations"
        backLabel={t('backToEvaluations')}
      />

      <EvaluationForm />
    </div>
  );
}
