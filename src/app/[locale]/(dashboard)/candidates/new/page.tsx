import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { CandidateForm } from '@/features/candidates/components/candidate-form';

export default async function NewCandidatePage() {
  const t = await getTranslations('candidates');

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title={t('createCandidate')}
        description={t('createCandidatePageDescription')}
        backHref="/candidates"
        backLabel={t('backToCandidates')}
      />

      <CandidateForm />
    </div>
  );
}