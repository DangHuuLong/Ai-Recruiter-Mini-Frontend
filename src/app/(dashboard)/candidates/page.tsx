import { UserPlusIcon } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/common';
import { CandidateList } from '@/features/candidates/components/candidate-list';

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        description="Manage candidate profiles before linking resumes, applications, and evaluations."
        actions={
          <Link
            href="/candidates/new"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <UserPlusIcon className="size-4" />
            Create Candidate
          </Link>
        }
      />

      <CandidateList />
    </div>
  );
}