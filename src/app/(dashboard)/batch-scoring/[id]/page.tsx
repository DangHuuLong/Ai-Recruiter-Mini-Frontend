import { BatchDetail } from '@/features/batch-scoring/components/batch-detail';

type BatchDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BatchDetailPage({ params }: BatchDetailPageProps) {
  const { id } = await params;

  return <BatchDetail batchId={id} />;
}
