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
      <div>
        <p className="text-sm font-medium text-blue-600">Candidate Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Edit candidate
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Update candidate profile details while keeping related resumes and applications linked.
        </p>
      </div>

      <CandidateEditForm candidateId={id} />
    </div>
  );
}
