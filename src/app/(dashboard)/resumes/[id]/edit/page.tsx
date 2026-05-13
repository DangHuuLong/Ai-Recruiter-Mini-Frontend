import { ResumeEditForm } from '@/features/resumes/components/resume-edit-form';

type ResumeEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResumeEditPage({ params }: ResumeEditPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Resume Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Edit resume metadata
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Update metadata used to organize and process this resume record.
        </p>
      </div>

      <ResumeEditForm resumeId={id} />
    </div>
  );
}
