import { PageHeader } from '@/components/common';
import { ApplicationEditForm } from '@/features/applications/components/application-edit-form';

type ApplicationEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApplicationEditPage({
  params,
}: ApplicationEditPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Edit application"
        description="Update application source and internal notes while preserving linked candidate, resume, and JD records."
      />

      <ApplicationEditForm applicationId={id} />
    </div>
  );
}
