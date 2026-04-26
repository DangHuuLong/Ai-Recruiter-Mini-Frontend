import { ResumeUploadForm } from '@/features/resumes/components/resume-upload-form';

export default function ResumesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Resume Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Resumes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Upload candidate CV files, connect them with candidate profiles,
            and prepare resume records for parsing, scoring, and AI evaluation.
          </p>
        </div>
      </div>

      <ResumeUploadForm />
    </div>
  );
}