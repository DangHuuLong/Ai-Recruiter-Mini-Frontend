import { PageHeader } from '@/components/common';
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
      <PageHeader
        title="Edit job description"
        description="Update JD metadata and raw text used for parsing, matching, and evaluation."
      />

      <JobDescriptionEditForm jobDescriptionId={id} />
    </div>
  );
}
