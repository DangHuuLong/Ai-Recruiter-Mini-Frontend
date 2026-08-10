'use client';

import { DownloadIcon, RotateCcwIcon } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { DetailSection } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import {
  getEvaluationById,
  retryEvaluation,
} from '@/features/evaluations/api/evaluation.api';
import type {
  Evaluation,
  EvaluationCriterionScore,
  EvaluationInterviewQuestion,
  EvaluationSkill,
} from '@/features/evaluations/types/evaluation.type';
import { formatDateTime } from '@/lib/utils/format-date';

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const asTextList = (value: unknown): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === 'string') {
    return [value];
  }

  return [JSON.stringify(value, null, 2)];
};

const SCORE_RING_RADIUS = 50;
const SCORE_RING_CIRCUMFERENCE = 2 * Math.PI * SCORE_RING_RADIUS;

const ScorePill = ({ score }: { score?: number | null }) => {
  const clampedScore = typeof score === 'number' ? Math.max(0, Math.min(100, score)) : null;
  const offset =
    clampedScore === null ? SCORE_RING_CIRCUMFERENCE : SCORE_RING_CIRCUMFERENCE * (1 - clampedScore / 100);

  return (
    <div className="relative flex size-28 shrink-0 items-center justify-center">
      <svg viewBox="0 0 120 120" className="size-28 -rotate-90">
        <circle cx="60" cy="60" r={SCORE_RING_RADIUS} fill="none" strokeWidth="10" className="stroke-surface-variant" />
        <circle
          cx="60"
          cy="60"
          r={SCORE_RING_RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-500"
          strokeDasharray={SCORE_RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold text-on-surface">{clampedScore === null ? '--' : Math.round(clampedScore)}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">/ 100</p>
      </div>
    </div>
  );
};

const SkillList = ({ skills, emptyLabel }: { skills: EvaluationSkill[]; emptyLabel: string }) => {
  if (skills.length === 0) {
    return <p className="text-sm text-on-surface-muted">{emptyLabel}</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {skills.map((skill) => (
        <div key={skill.id} className="rounded-xl border border-outline bg-surface-variant p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-on-surface">{skill.skillName}</p>
              {skill.normalizedSkillName ? (
                <p className="text-xs text-on-surface-muted">{skill.normalizedSkillName}</p>
              ) : null}
            </div>
            {skill.importance ? (
              <span className="rounded-full bg-surface-lowest px-2 py-1 text-xs font-semibold text-on-surface-variant">
                {skill.importance}
              </span>
            ) : null}
          </div>
          {skill.note ? <p className="mt-3 text-sm text-on-surface-variant">{skill.note}</p> : null}
          {asTextList(skill.evidence).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
              {asTextList(skill.evidence).map((item, index) => (
                <li key={`${skill.id}-evidence-${index}`}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
};

const CriterionBreakdown = ({
  criteria,
  t,
}: {
  criteria: EvaluationCriterionScore[];
  t: ReturnType<typeof useTranslations<'evaluations.detail'>>;
}) => {
  if (criteria.length === 0) {
    return <p className="text-sm text-on-surface-muted">{t('noScoreBreakdown')}</p>;
  }

  return (
    <div className="space-y-4">
      {criteria.map((criterion) => {
        const percent = Math.round(criterion.scoreNormalized * 100);
        const contribution = criterion.scoreNormalized * criterion.weight * 100;

        return (
          <div key={criterion.id} className="rounded-xl border border-outline p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-on-surface">{formatLabel(criterion.criterion)}</p>
                <p className="text-sm text-on-surface-muted">
                  {t('weightContribution', {
                    weight: Math.round(criterion.weight * 100),
                    contribution: contribution.toFixed(1),
                  })}
                </p>
              </div>
              <span className="text-lg font-bold text-primary">{percent}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-variant">
              <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
            </div>
            {criterion.reason ? <p className="mt-3 text-sm text-on-surface-variant">{criterion.reason}</p> : null}
            {asTextList(criterion.evidence).length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
                {asTextList(criterion.evidence).map((item, index) => (
                  <li key={`${criterion.id}-evidence-${index}`}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const InterviewQuestions = ({
  questions,
  t,
}: {
  questions: EvaluationInterviewQuestion[];
  t: ReturnType<typeof useTranslations<'evaluations.detail'>>;
}) => {
  if (questions.length === 0) {
    return <p className="text-sm text-on-surface-muted">{t('noInterviewQuestions')}</p>;
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <div key={question.id} className="rounded-xl border border-outline bg-surface-variant p-4">
          <p className="text-sm font-semibold text-primary">{t('questionNumber', { number: question.displayOrder ?? index + 1 })}</p>
          <p className="mt-2 font-medium text-on-surface">{question.question}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-on-surface-variant">
            {question.category ? <span className="rounded-full bg-surface-lowest px-2 py-1">{question.category}</span> : null}
            {question.linkedSkill ? <span className="rounded-full bg-surface-lowest px-2 py-1">{question.linkedSkill}</span> : null}
            {question.difficulty ? <span className="rounded-full bg-surface-lowest px-2 py-1">{question.difficulty}</span> : null}
          </div>
          {question.rationale ? <p className="mt-3 text-sm text-on-surface-variant">{question.rationale}</p> : null}
        </div>
      ))}
    </div>
  );
};

export function EvaluationResultDetail({ evaluationId }: { evaluationId: string }) {
  const t = useTranslations('evaluations.detail');
  const tRoot = useTranslations('evaluations');
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await getEvaluationById(evaluationId);
        setEvaluation(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('errorTitle');
        setErrorMessage(message);
        showToast.error(t('errorTitle'), { description: message });
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationId]);

  const matchedSkills = useMemo(() => {
    return evaluation?.skills?.filter((skill) => skill.type === 'MATCHED') ?? [];
  }, [evaluation?.skills]);

  const missingSkills = useMemo(() => {
    return evaluation?.skills?.filter((skill) => skill.type === 'MISSING') ?? [];
  }, [evaluation?.skills]);

  const relatedSkills = useMemo(() => {
    return evaluation?.skills?.filter((skill) => skill.type === 'RELATED') ?? [];
  }, [evaluation?.skills]);

  const handleRetry = async () => {
    if (!evaluation) {
      return;
    }

    try {
      setIsRetrying(true);
      const retried = await retryEvaluation(evaluation.id);
      setEvaluation(retried);
      showToast.success(t('retrySuccess'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('retryFailedFallback');
      showToast.error(t('retryFailedTitle'), { description: message });
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        title={t('loadingTitle')}
        description={t('loadingDescription')}
      />
    );
  }

  if (errorMessage || !evaluation) {
    return (
      <EmptyState
        title={t('notFoundTitle')}
        description={errorMessage || t('notFoundFallback')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ScorePill score={evaluation.overallScore} />
            <div>
              <p className="text-sm font-medium text-primary">{t('resultLabel')}</p>
              <h1 className="mt-2 text-2xl font-bold text-on-surface">
                {evaluation.application?.candidate?.fullName || t('candidateFallback')}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                {evaluation.application?.jobDescription?.title || t('jobDescriptionFallback')} · {t('statusLabel')}{' '}
                <span className="font-semibold text-on-surface">{evaluation.status}</span>
              </p>
              <p className="mt-1 text-sm text-on-surface-muted">
                {t('started', { date: evaluation.startedAt ? formatDateTime(evaluation.startedAt) : tRoot('notRecorded') })} ·{' '}
                {t('completed', { date: evaluation.completedAt ? formatDateTime(evaluation.completedAt) : tRoot('notRecorded') })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {evaluation.applicationId ? (
              <button
                type="button"
                onClick={() => router.push(`/applications/${evaluation.applicationId}`)}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
              >
                {t('viewApplication')}
              </button>
            ) : null}
            {evaluation.status === 'FAILED' ? (
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCcwIcon className="size-4" />
                {isRetrying ? t('retrying') : t('retryEvaluation')}
              </button>
            ) : null}
          </div>
        </div>

        {evaluation.status === 'FAILED' && evaluation.evaluationError ? (
          <div className="mt-6 rounded-xl border border-error/30 bg-error-container p-4 text-sm text-error">
            {evaluation.evaluationError}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailSection title={t('summary')}>
          <p className="whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">
            {evaluation.summary || t('noSummary')}
          </p>
        </DetailSection>

        <DetailSection title={t('skillGapSummary')}>
          <p className="whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">
            {evaluation.skillGapSummary || t('noSkillGapSummary')}
          </p>
        </DetailSection>
      </div>

      <DetailSection title={t('explanation')}>
        <p className="whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">
          {evaluation.explanation || t('noExplanation')}
        </p>
      </DetailSection>

      <DetailSection title={t('scoreBreakdown')} description={t('scoreBreakdownDescription')}>
        <CriterionBreakdown criteria={evaluation.criterionScores ?? []} t={t} />
      </DetailSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailSection
          title={t('matchedSkills')}
          actions={
            <span className="rounded-full bg-success-container px-2.5 py-1 text-xs font-semibold text-success">
              {t('found', { count: matchedSkills.length })}
            </span>
          }
        >
          <SkillList skills={matchedSkills} emptyLabel={t('noMatchedSkills')} />
        </DetailSection>
        <DetailSection
          title={t('missingSkills')}
          actions={
            <span className="rounded-full bg-error-container px-2.5 py-1 text-xs font-semibold text-error">
              {t('absent', { count: missingSkills.length })}
            </span>
          }
        >
          <SkillList skills={missingSkills} emptyLabel={t('noMissingSkills')} />
        </DetailSection>
      </div>

      {relatedSkills.length > 0 ? (
        <DetailSection
          title={t('relatedSkills')}
          actions={
            <span className="rounded-full bg-warning-container px-2.5 py-1 text-xs font-semibold text-on-surface">
              {t('related', { count: relatedSkills.length })}
            </span>
          }
        >
          <SkillList skills={relatedSkills} emptyLabel={t('noRelatedSkills')} />
        </DetailSection>
      ) : null}

      <DetailSection
        title={t('evidence')}
        description={t('evidenceDescription')}
        actions={
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify(evaluation.evidenceMap ?? {}, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `evaluation-${evaluation.id}-evidence.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-container"
          >
            <DownloadIcon className="size-4" />
            {t('exportJson')}
          </button>
        }
      >
        <pre className="max-h-96 overflow-auto rounded-xl bg-surface-variant p-4 text-xs leading-5 text-on-surface-variant">
          {JSON.stringify(evaluation.evidenceMap ?? {}, null, 2)}
        </pre>
      </DetailSection>

      <DetailSection title={t('interviewQuestions')}>
        <InterviewQuestions questions={evaluation.interviewQuestionRows ?? []} t={t} />
      </DetailSection>
    </div>
  );
}
