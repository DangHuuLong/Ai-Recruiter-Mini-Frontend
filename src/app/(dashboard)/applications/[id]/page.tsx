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
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href="/applications"
        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        ← Back to applications
      </Link>

      <ApplicationDetail applicationId={id} />
    </div>
  );
}
