import { CandidateForm } from '@/features/candidates/components/candidate-form';

export default function NewCandidatePage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Candidate Management
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Create Candidate
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Add a candidate profile that can be linked with resumes, applications,
          and evaluations.
        </p>
      </div>

      <CandidateForm />
    </div>
  );
}