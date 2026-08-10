import { UserPlusIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common';
import { CandidateList } from '@/features/candidates/components/candidate-list';

export default async function CandidatesPage() {
  const t = await getTranslations('candidates');

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pageTitle')}
        description={t('pageDescription')}
        actions={
          <Link
            href="/candidates/new"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <UserPlusIcon className="size-4" />
            {t('createCandidate')}
          </Link>
        }
      />

      <CandidateList />
    </div>
  );
}