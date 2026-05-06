import Link from 'next/link';

import { EvaluationResultDetail } from '@/features/evaluations/components/evaluation-result-detail';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EvaluationResultPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link
        href="/evaluations"
        className="inline-flex text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        ← Back to evaluations
      </Link>

      <EvaluationResultDetail evaluationId={id} />
    </div>
  );
}
