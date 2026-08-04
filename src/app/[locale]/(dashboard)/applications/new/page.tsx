import { Link } from '@/i18n/navigation';

import { PageHeader } from '@/components/common';
import { ApplicationForm } from '@/features/applications/components/application-form';

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          href="/applications"
          className="cursor-pointer text-sm font-semibold text-primary transition hover:underline"
        >
          ← Back to applications
        </Link>

        <div className="mt-4">
          <PageHeader
            title="Link candidate, resume, and JD"
            description="Select a candidate first, then choose one of their resumes and an active job description."
          />
        </div>
      </div>

      <ApplicationForm />
    </div>
  );
}
