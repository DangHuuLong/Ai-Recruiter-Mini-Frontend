import { JobDescriptionEditForm } from '@/features/job-descriptions/components/job-description-edit-form';

type JobDescriptionEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDescriptionEditPage({
  params,
}: JobDescriptionEditPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Job Description Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Edit job description
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Update JD metadata and raw text used for parsing, matching, and evaluation.
        </p>
      </div>

      <JobDescriptionEditForm jobDescriptionId={id} />
    </div>
  );
}
