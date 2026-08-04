import { EvaluationConfigForm } from '@/features/evaluation-configs/components/evaluation-config-form';

type EditEvaluationConfigPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditEvaluationConfigPage({ params }: EditEvaluationConfigPageProps) {
  const { id } = await params;

  return <EvaluationConfigForm configId={id} />;
}
