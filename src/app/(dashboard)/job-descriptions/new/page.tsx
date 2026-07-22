import { PageHeader } from '@/components/common';
import { JobDescriptionForm } from '@/features/job-descriptions/components/job-description-form';

export default function NewJobDescriptionPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Create Job Description"
        description="Add a new hiring position and paste the original raw JD text for later parsing."
        backHref="/job-descriptions"
        backLabel="Back to job descriptions"
      />

      <JobDescriptionForm />
    </div>
  );
}
