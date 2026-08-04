import { PageHeader } from '@/components/common';
import { CandidateForm } from '@/features/candidates/components/candidate-form';

export default function NewCandidatePage() {
  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Create Candidate"
        description="Add a candidate profile that can be linked with resumes, applications, and evaluations."
        backHref="/candidates"
        backLabel="Back to candidates"
      />

      <CandidateForm />
    </div>
  );
}