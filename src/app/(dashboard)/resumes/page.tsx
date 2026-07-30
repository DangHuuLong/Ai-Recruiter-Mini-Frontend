import { PageHeader } from '@/components/common';
import { ResumeList } from '@/features/resumes/components/resume-list';
import { ResumeUploadForm } from '@/features/resumes/components/resume-upload-form';

export default function ResumesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumes"
        description="Upload candidate CV files, connect them with candidate profiles, and prepare resume records for parsing, scoring, and AI evaluation."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
        <ResumeUploadForm />
        <ResumeList />
      </div>
    </div>
  );
}