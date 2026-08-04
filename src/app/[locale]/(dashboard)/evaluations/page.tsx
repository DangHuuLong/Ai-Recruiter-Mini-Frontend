import { PlusIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';

import { PageHeader } from '@/components/common';
import { EvaluationList } from '@/features/evaluations/components/evaluation-list';

export default function EvaluationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluations"
        description="Review AI-generated scoring results for candidate applications, or start a new evaluation."
        actions={
          <Link
            href="/evaluations/new"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <PlusIcon className="size-4" />
            New evaluation
          </Link>
        }
      />

      <EvaluationList />
    </div>
  );
}
