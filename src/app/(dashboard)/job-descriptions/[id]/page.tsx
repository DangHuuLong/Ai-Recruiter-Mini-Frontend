import { JobDescriptionDetail } from '@/features/job-descriptions/components/job-description-detail';

type PageProps = {
  params: {
    id: string;
  };
};

export default function JobDescriptionDetailPage({ params }: PageProps) {
  return (
    <div className="max-w-6xl">
      <JobDescriptionDetail id={params.id} />
    </div>
  );
}
