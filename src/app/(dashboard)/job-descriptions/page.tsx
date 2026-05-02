import Link from 'next/link';

import { JobDescriptionList } from '@/features/job-descriptions/components/job-description-list';

export default function JobDescriptionsPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Job Description Management</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Job Descriptions
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Create hiring positions, parse raw JD text, and manage required or preferred skills for scoring.
          </p>
        </div>

        <Link
          href="/job-descriptions/new"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Create JD
        </Link>
      </div>

      <JobDescriptionList />
    </div>
  );
}
