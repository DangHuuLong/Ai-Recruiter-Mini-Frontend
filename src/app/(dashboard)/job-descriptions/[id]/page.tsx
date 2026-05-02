import { JobDescriptionDetail } from '@/features/job-descriptions/components/job-description-detail';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDescriptionDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl">
      <JobDescriptionDetail id={id} />
    </div>
  );
}
