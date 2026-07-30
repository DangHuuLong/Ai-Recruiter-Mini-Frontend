import { PageHeader } from '@/components/common';
import { ResumeEditForm } from '@/features/resumes/components/resume-edit-form';

type ResumeEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResumeEditPage({ params }: ResumeEditPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Edit resume metadata"
        description="Update metadata used to organize and process this resume record."
      />

      <ResumeEditForm resumeId={id} />
    </div>
  );
}
