import { InterviewQuestionForm } from '@/features/interview-questions/components/interview-question-form';

type EditInterviewQuestionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditInterviewQuestionPage({ params }: EditInterviewQuestionPageProps) {
  const { id } = await params;

  return <InterviewQuestionForm questionId={id} />;
}
