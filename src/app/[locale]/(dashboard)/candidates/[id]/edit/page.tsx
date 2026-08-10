import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { CandidateEditForm } from '@/features/candidates/components/candidate-edit-form';

type CandidateEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CandidateEditPage({ params }: CandidateEditPageProps) {
  const { id } = await params;
  const t = await getTranslations('candidates');

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader title={t('form.editTitle')} description={t('editPageDescription')} />

      <CandidateEditForm candidateId={id} />
    </div>
  );
}
