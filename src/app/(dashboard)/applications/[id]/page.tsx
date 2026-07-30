import Link from 'next/link';

import { ApplicationDetail } from '@/features/applications/components/application-detail';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <Link
        href="/applications"
        className="inline-flex cursor-pointer text-sm font-semibold text-primary transition hover:underline"
      >
        ← Back to applications
      </Link>

      <ApplicationDetail applicationId={id} />
    </div>
  );
}
