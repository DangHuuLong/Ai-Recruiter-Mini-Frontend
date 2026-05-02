import Link from 'next/link';

import { ApplicationForm } from '@/features/applications/components/application-form';

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          href="/applications"
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          ← Back to applications
        </Link>

        <p className="mt-6 text-sm font-medium text-blue-600">
          Create Application
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Link candidate, resume, and JD
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Select a candidate first, then choose one of their resumes and an active job description.
        </p>
      </div>

      <ApplicationForm />
    </div>
  );
}
