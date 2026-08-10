import { PlusIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';

import { PageHeader } from '@/components/common';
import { ApplicationList } from '@/features/applications/components/application-list';

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Track candidates applying to active job descriptions using a specific resume."
        actions={
          <Link
            href="/applications/new"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <PlusIcon className="size-4" />
            Create Application
          </Link>
        }
      />

      <ApplicationList />
    </div>
  );
}
