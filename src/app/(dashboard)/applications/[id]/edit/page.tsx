import { ApplicationEditForm } from '@/features/applications/components/application-edit-form';

type ApplicationEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApplicationEditPage({
  params,
}: ApplicationEditPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Application Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Edit application
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Update application source and internal notes while preserving linked candidate, resume, and JD records.
        </p>
      </div>

      <ApplicationEditForm applicationId={id} />
    </div>
  );
}
