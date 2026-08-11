import { apiClient, apiEndpoints } from '@/lib/api';
import type { ApiResponse } from '@/lib/api/api-types';
import { publicRequest } from '@/features/public-batches/api/public-batch.api';
import type { AiActivityFeedback, SubmitFeedbackPayload } from '@/features/feedback/types/feedback.type';

export async function submitEvaluationFeedback(
  evaluationId: string,
  payload: SubmitFeedbackPayload,
): Promise<AiActivityFeedback> {
  const response = await apiClient.post<ApiResponse<AiActivityFeedback>>(
    apiEndpoints.evaluations.feedback(evaluationId),
    payload,
  );
  return response.data;
}

export async function submitPublicFeedback(
  batchId: string,
  resumeItemId: string,
  jdItemId: string,
  payload: SubmitFeedbackPayload,
): Promise<AiActivityFeedback> {
  return publicRequest<AiActivityFeedback>('POST', '/public/feedback', {
    ...payload,
    batchId,
    resumeItemId,
    jdItemId,
  });
}
