import { AiActivityLogDetail } from '@/features/ai-activity-log/components/ai-activity-log-detail';

type AiActivityLogDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AiActivityLogDetailPage({ params }: AiActivityLogDetailPageProps) {
  const { id } = await params;

  return <AiActivityLogDetail id={id} />;
}
