import { JobDescriptionDetail } from '@/features/job-descriptions/components/job-description-detail';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDescriptionDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <JobDescriptionDetail id={id} />;
}
