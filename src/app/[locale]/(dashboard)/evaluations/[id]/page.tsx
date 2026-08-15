import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import { EvaluationResultDetail } from '@/features/evaluations/components/evaluation-result-detail';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EvaluationResultPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations('evaluations');

  return (
    <div className="space-y-8">
      <Link
        href="/evaluations"
        className="inline-flex cursor-pointer text-sm font-semibold text-primary transition hover:underline"
      >
        {t('backToList')}
      </Link>

      <EvaluationResultDetail evaluationId={id} />
    </div>
  );
}
