import { PageHeader } from '@/components/common';
import { CandidateEditForm } from '@/features/candidates/components/candidate-edit-form';

type CandidateEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CandidateEditPage({ params }: CandidateEditPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Edit candidate"
        description="Update candidate profile details while keeping related resumes and applications linked."
      />

      <CandidateEditForm candidateId={id} />
    </div>
  );
}
