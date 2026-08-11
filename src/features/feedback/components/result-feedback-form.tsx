'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { submitEvaluationFeedback, submitPublicFeedback } from '@/features/feedback/api/feedback.api';
import {
  FEEDBACK_REASON_SLUGS,
  type FeedbackAccuracy,
  type FeedbackReasonSlug,
  type FeedbackSpeed,
} from '@/features/feedback/types/feedback.type';
import { cn } from '@/lib/utils/cn';

type FeedbackReference =
  | { evaluationId: string }
  | { batchId: string; resumeItemId: string; jdItemId: string };

type ResultFeedbackFormProps = {
  reference: FeedbackReference;
};

const ACCURACY_OPTIONS: FeedbackAccuracy[] = ['ACCURATE', 'OK', 'INACCURATE'];
const SPEED_OPTIONS: FeedbackSpeed[] = ['FAST', 'NORMAL', 'SLOW'];

const ACCURACY_LABEL_KEYS: Record<FeedbackAccuracy, string> = {
  ACCURATE: 'accuracyAccurate',
  OK: 'accuracyOk',
  INACCURATE: 'accuracyInaccurate',
};

const SPEED_LABEL_KEYS: Record<FeedbackSpeed, string> = {
  FAST: 'speedFast',
  NORMAL: 'speedNormal',
  SLOW: 'speedSlow',
};

const REASON_LABEL_KEYS: Record<FeedbackReasonSlug, string> = {
  SCORE_TOO_LOW: 'reasonScoreTooLow',
  SCORE_TOO_HIGH: 'reasonScoreTooHigh',
  MISSING_SKILLS: 'reasonMissingSkills',
  WRONG_SKILLS: 'reasonWrongSkills',
  WRONG_EXTRACTION: 'reasonWrongExtraction',
  WRONG_INTERVIEW_QUESTIONS: 'reasonWrongInterviewQuestions',
  OTHER: 'reasonOther',
};

export function ResultFeedbackForm({ reference }: ResultFeedbackFormProps) {
  const t = useTranslations('feedback');

  const [accuracy, setAccuracy] = useState<FeedbackAccuracy | ''>('');
  const [reasons, setReasons] = useState<Set<FeedbackReasonSlug>>(new Set());
  const [otherText, setOtherText] = useState('');
  const [speed, setSpeed] = useState<FeedbackSpeed | ''>('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showReasons = accuracy === 'OK' || accuracy === 'INACCURATE';
  const isValid = accuracy !== '' && speed !== '' && (!showReasons || reasons.size > 0);

  const toggleReason = (reason: FeedbackReasonSlug) => {
    setReasons((current) => {
      const next = new Set(current);
      if (next.has(reason)) {
        next.delete(reason);
      } else {
        next.add(reason);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    const trimmedOther = otherText.trim();
    const trimmedComment = comment.trim();
    const finalComment =
      trimmedOther && trimmedComment
        ? `${trimmedOther}\n\n${trimmedComment}`
        : trimmedOther || trimmedComment || undefined;

    const payload = {
      accuracy,
      reasons: showReasons ? Array.from(reasons) : undefined,
      speed,
      comment: finalComment,
    };

    try {
      setIsSubmitting(true);

      if ('evaluationId' in reference) {
        await submitEvaluationFeedback(reference.evaluationId, payload);
      } else {
        await submitPublicFeedback(reference.batchId, reference.resumeItemId, reference.jdItemId, payload);
      }

      setIsSubmitted(true);
      showToast.success(t('toast.success'));
    } catch (error) {
      showToast.error(t('toast.failedTitle'), {
        description: error instanceof Error ? error.message : t('toast.failedFallback'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success-container/40 p-5 text-center">
        <p className="text-sm font-bold text-on-surface">{t('submittedTitle')}</p>
        <p className="mt-1 text-sm text-on-surface-variant">{t('submittedDescription')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-semibold text-on-surface">{t('accuracyLabel')}</p>
        <div className="space-y-2">
          {ACCURACY_OPTIONS.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-on-surface">
              <input
                type="radio"
                name="feedback-accuracy"
                checked={accuracy === option}
                onChange={() => setAccuracy(option)}
                className="size-4 cursor-pointer border-outline text-primary"
              />
              {t(ACCURACY_LABEL_KEYS[option])}
            </label>
          ))}
        </div>
      </div>

      {showReasons ? (
        <div>
          <p className="mb-2 text-sm font-semibold text-on-surface">{t('reasonsLabel')}</p>
          <div className="space-y-2">
            {FEEDBACK_REASON_SLUGS.map((reason) => (
              <div key={reason}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface">
                  <input
                    type="checkbox"
                    checked={reasons.has(reason)}
                    onChange={() => toggleReason(reason)}
                    className="size-4 cursor-pointer rounded border-outline text-primary"
                  />
                  {t(REASON_LABEL_KEYS[reason])}
                </label>
                {reason === 'OTHER' && reasons.has('OTHER') ? (
                  <input
                    type="text"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder={t('reasonOtherPlaceholder')}
                    className="mt-1.5 ml-6 h-9 w-[calc(100%-1.5rem)] rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-2 text-sm font-semibold text-on-surface">{t('speedLabel')}</p>
        <div className={cn('flex flex-wrap gap-4')}>
          {SPEED_OPTIONS.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-on-surface">
              <input
                type="radio"
                name="feedback-speed"
                checked={speed === option}
                onChange={() => setSpeed(option)}
                className="size-4 cursor-pointer border-outline text-primary"
              />
              {t(SPEED_LABEL_KEYS[option])}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          {t('commentLabel')}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder={t('commentPlaceholder')}
          className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
        />
      </div>

      <Button
        type="button"
        className="w-auto px-4"
        disabled={!isValid}
        isLoading={isSubmitting}
        onClick={() => void handleSubmit()}
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </div>
  );
}
