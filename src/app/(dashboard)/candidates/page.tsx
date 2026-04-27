import Link from 'next/link';

import { CandidateList } from '@/features/candidates/components/candidate-list';

export default function CandidatesPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Candidate Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Candidates
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Manage candidate profiles before linking resumes, applications, and
            evaluations.
          </p>
        </div>

        <Link
          href="/candidates/new"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Create Candidate
        </Link>
      </div>

      <CandidateList />
    </div>
  );
}