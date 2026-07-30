import { PageHeader } from '@/components/common';
import { EvaluationForm } from '@/features/evaluations/components/evaluation-form';

export default function NewEvaluationPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="New evaluation"
        description="Select an application to run the AI scoring pipeline against."
        backHref="/evaluations"
        backLabel="Back to evaluations"
      />

      <EvaluationForm />
    </div>
  );
}
