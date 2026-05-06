'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

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

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not recorded';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

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

const ScorePill = ({ score }: { score?: number | null }) => (
  <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-blue-100 bg-blue-50 text-center">
    <div>
      <p className="text-3xl font-bold text-blue-700">
        {typeof score === 'number' ? Math.round(score) : '--'}
      </p>
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">/ 100</p>
    </div>
  </div>
);

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
    {children}
  </section>
);

const SkillList = ({ skills, emptyLabel }: { skills: EvaluationSkill[]; emptyLabel: string }) => {
  if (skills.length === 0) {
    return <p className="text-sm text-slate-500">{emptyLabel}</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {skills.map((skill) => (
        <div key={skill.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-950">{skill.skillName}</p>
              {skill.normalizedSkillName ? (
                <p className="text-xs text-slate-500">{skill.normalizedSkillName}</p>
              ) : null}
            </div>
            {skill.importance ? (
              <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                {skill.importance}
              </span>
            ) : null}
          </div>
          {skill.note ? <p className="mt-3 text-sm text-slate-600">{skill.note}</p> : null}
          {asTextList(skill.evidence).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
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

const CriterionBreakdown = ({ criteria }: { criteria: EvaluationCriterionScore[] }) => {
  if (criteria.length === 0) {
    return <p className="text-sm text-slate-500">No score breakdown available.</p>;
  }

  return (
    <div className="space-y-4">
      {criteria.map((criterion) => {
        const percent = Math.round(criterion.scoreNormalized * 100);
        const contribution = criterion.scoreNormalized * criterion.weight * 100;

        return (
          <div key={criterion.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-950">{formatLabel(criterion.criterion)}</p>
                <p className="text-sm text-slate-500">
                  Weight {Math.round(criterion.weight * 100)}% · Contribution {contribution.toFixed(1)}
                </p>
              </div>
              <span className="text-lg font-bold text-blue-700">{percent}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
            </div>
            {criterion.reason ? <p className="mt-3 text-sm text-slate-700">{criterion.reason}</p> : null}
            {asTextList(criterion.evidence).length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
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

const InterviewQuestions = ({ questions }: { questions: EvaluationInterviewQuestion[] }) => {
  if (questions.length === 0) {
    return <p className="text-sm text-slate-500">No interview questions generated.</p>;
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <div key={question.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-blue-600">Question {question.displayOrder ?? index + 1}</p>
          <p className="mt-2 font-medium text-slate-950">{question.question}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            {question.category ? <span className="rounded-full bg-white px-2 py-1">{question.category}</span> : null}
            {question.linkedSkill ? <span className="rounded-full bg-white px-2 py-1">{question.linkedSkill}</span> : null}
            {question.difficulty ? <span className="rounded-full bg-white px-2 py-1">{question.difficulty}</span> : null}
          </div>
          {question.rationale ? <p className="mt-3 text-sm text-slate-600">{question.rationale}</p> : null}
        </div>
      ))}
    </div>
  );
};

export function EvaluationResultDetail({ evaluationId }: { evaluationId: string }) {
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
        const message = error instanceof Error ? error.message : 'Failed to load evaluation';
        setErrorMessage(message);
        showToast.error('Failed to load evaluation', { description: message });
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvaluation();
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
      showToast.success('Evaluation retried successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retry evaluation';
      showToast.error('Failed to retry evaluation', { description: message });
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        title="Loading evaluation result..."
        description="Please wait while the evaluation result is being loaded."
      />
    );
  }

  if (errorMessage || !evaluation) {
    return (
      <EmptyState
        title="Evaluation not found"
        description={errorMessage || 'Unable to load this evaluation.'}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ScorePill score={evaluation.overallScore} />
            <div>
              <p className="text-sm font-medium text-blue-600">Evaluation result</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {evaluation.application?.candidate?.fullName || 'Candidate evaluation'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {evaluation.application?.jobDescription?.title || 'Job description'} · Status{' '}
                <span className="font-semibold text-slate-900">{evaluation.status}</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Started {formatDate(evaluation.startedAt)} · Completed {formatDate(evaluation.completedAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {evaluation.applicationId ? (
              <button
                type="button"
                onClick={() => router.push(`/applications/${evaluation.applicationId}`)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View application
              </button>
            ) : null}
            {evaluation.status === 'FAILED' ? (
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRetrying ? 'Retrying...' : 'Retry evaluation'}
              </button>
            ) : null}
          </div>
        </div>

        {evaluation.status === 'FAILED' && evaluation.evaluationError ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {evaluation.evaluationError}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Summary">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {evaluation.summary || 'No summary available.'}
          </p>
        </Section>

        <Section title="Skill gap summary">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {evaluation.skillGapSummary || 'No skill gap summary available.'}
          </p>
        </Section>
      </div>

      <Section title="Explanation">
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {evaluation.explanation || 'No explanation available.'}
        </p>
      </Section>

      <Section title="Score breakdown" description="Per-criterion normalized score, weight, contribution, reason, and evidence.">
        <CriterionBreakdown criteria={evaluation.criterionScores ?? []} />
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Matched skills">
          <SkillList skills={matchedSkills} emptyLabel="No matched skills available." />
        </Section>
        <Section title="Missing skills">
          <SkillList skills={missingSkills} emptyLabel="No missing skills available." />
        </Section>
      </div>

      {relatedSkills.length > 0 ? (
        <Section title="Related skills">
          <SkillList skills={relatedSkills} emptyLabel="No related skills available." />
        </Section>
      ) : null}

      <Section title="Evidence" description="Raw evidence map returned by the scoring pipeline.">
        <pre className="max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
          {JSON.stringify(evaluation.evidenceMap ?? {}, null, 2)}
        </pre>
      </Section>

      <Section title="Interview questions">
        <InterviewQuestions questions={evaluation.interviewQuestionRows ?? []} />
      </Section>
    </div>
  );
}
