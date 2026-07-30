import { PublicBatchResults } from '@/features/public-batches/components/public-batch-results';

type PageProps = {
  params: Promise<{
    batchId: string;
  }>;
};

export default async function PublicBatchResultsPage({ params }: PageProps) {
  const { batchId } = await params;

  return <PublicBatchResults batchId={batchId} />;
}
