import { ResumeUploadForm } from '@/features/resumes/components/resume-upload-form';

export default function ResumesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Resumes</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Upload candidate CV files and create resume records for parsing.
        </p>
      </div>

      <ResumeUploadForm />
    </div>
  );
}
