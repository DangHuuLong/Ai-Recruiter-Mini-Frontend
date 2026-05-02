import Link from 'next/link';

import { ApplicationList } from '@/features/applications/components/application-list';

export default function ApplicationsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Application Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Applications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Track candidates applying to active job descriptions using a specific resume.
          </p>
        </div>

        <Link
          href="/applications/new"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Create Application
        </Link>
      </div>

      <ApplicationList />
    </div>
  );
}
