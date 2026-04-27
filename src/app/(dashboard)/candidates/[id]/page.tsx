import { CandidateDetail } from '@/features/candidates/components/candidate-detail';

type CandidateDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CandidateDetailPage({
  params,
}: CandidateDetailPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl space-y-6">
      <CandidateDetail candidateId={id} />
    </div>
  );
}