import { ResumeDetail } from '@/features/resumes/components/resume-detail';

type ResumeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResumeDetailPage({
  params,
}: ResumeDetailPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl space-y-6">
      <ResumeDetail resumeId={id} />
    </div>
  );
}