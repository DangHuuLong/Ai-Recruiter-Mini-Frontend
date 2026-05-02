import { JobDescriptionForm } from '@/features/job-descriptions/components/job-description-form';

export default function NewJobDescriptionPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Job Description Management</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Create Job Description
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Add a new hiring position and paste the original raw JD text for later parsing.
        </p>
      </div>

      <JobDescriptionForm />
    </div>
  );
}
