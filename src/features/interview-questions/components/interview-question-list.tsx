'use client';

import { CheckIcon, FlaskConicalIcon, PlusIcon, UploadIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import {
  MOCK_INTERVIEW_QUESTIONS,
  QUALITY_GATE_CLASSES,
  QUALITY_GATE_LABELS,
  QUESTION_TYPE_LABELS,
  SOURCE_LABELS,
  type InterviewQuestionType,
  type MockInterviewQuestion,
  type QuestionQualityGateStatus,
} from '@/features/interview-questions/mock/interview-question-mock-data';
import {
  getSpecializationsFor,
  OCCUPATION_FAMILY_LABELS,
  type OccupationFamily,
} from '@/features/interview-questions/mock/interview-question-taxonomy';
import { cn } from '@/lib/utils/cn';

export function InterviewQuestionList() {
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>(MOCK_INTERVIEW_QUESTIONS);
  const [occupationFamily, setOccupationFamily] = useState<OccupationFamily | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [questionType, setQuestionType] = useState<InterviewQuestionType | ''>('');
  const [qualityGateStatus, setQualityGateStatus] = useState<QuestionQualityGateStatus | ''>('');

  const specializationOptions = getSpecializationsFor(occupationFamily);

  const filtered = questions.filter((q) => {
    if (occupationFamily && q.occupationFamily !== occupationFamily) return false;
    if (specialization && q.specialization !== specialization) return false;
    if (questionType && q.questionType !== questionType) return false;
    if (qualityGateStatus && q.qualityGateStatus !== qualityGateStatus) return false;
    return true;
  });

  const handleApprove = (question: MockInterviewQuestion) => {
    setQuestions((current) =>
      current.map((q) => (q.id === question.id ? { ...q, qualityGateStatus: 'APPROVED' } : q)),
    );
    showToast.success('Question approved');
  };

  const handleDelete = (question: MockInterviewQuestion) => {
    setQuestions((current) => current.filter((q) => q.id !== question.id));
    showToast.success('Question deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">Interview Question Bank</h1>
            <span className="rounded-full bg-surface-variant px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
              Internal tool
            </span>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            Curated + AI-generated interview questions used by the retrieval/search-or-generate engine.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={ROUTES.INTERVIEW_QUESTIONS_SEARCH_TEST}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-outline bg-surface-lowest px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
          >
            <FlaskConicalIcon className="size-4" />
            Test retrieval
          </Link>
          <Link
            href={ROUTES.INTERVIEW_QUESTIONS_BULK_CREATE}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-outline bg-surface-lowest px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
          >
            <UploadIcon className="size-4" />
            Bulk create
          </Link>
          <Link
            href={ROUTES.INTERVIEW_QUESTION_CREATE}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <PlusIcon className="size-4" />
            New question
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={occupationFamily}
          onChange={(e) => {
            setOccupationFamily(e.target.value as OccupationFamily | '');
            setSpecialization('');
          }}
          className="h-10 cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
        >
          <option value="">All families</option>
          {(Object.keys(OCCUPATION_FAMILY_LABELS) as OccupationFamily[]).map((family) => (
            <option key={family} value={family}>
              {OCCUPATION_FAMILY_LABELS[family]}
            </option>
          ))}
        </select>

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          disabled={!occupationFamily}
          className="h-10 cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
        >
          <option value="">All specializations</option>
          {specializationOptions.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value as InterviewQuestionType | '')}
          className="h-10 cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
        >
          <option value="">All question types</option>
          {(Object.keys(QUESTION_TYPE_LABELS) as InterviewQuestionType[]).map((type) => (
            <option key={type} value={type}>
              {QUESTION_TYPE_LABELS[type]}
            </option>
          ))}
        </select>

        <select
          value={qualityGateStatus}
          onChange={(e) => setQualityGateStatus(e.target.value as QuestionQualityGateStatus | '')}
          className="h-10 cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
        >
          <option value="">All quality statuses</option>
          {(Object.keys(QUALITY_GATE_LABELS) as QuestionQualityGateStatus[]).map((status) => (
            <option key={status} value={status}>
              {QUALITY_GATE_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-12 text-center shadow-card">
          <p className="text-sm font-semibold text-on-surface">No questions match these filters</p>
          <p className="mt-1 text-sm text-on-surface-variant">Try clearing a filter or add a new question.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-surface-variant">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Question
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Family / Specialization
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Competency
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Quality
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Source
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Usage
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filtered.map((question) => (
                <tr key={question.id} className="transition-colors hover:bg-surface-variant/60">
                  <td className="max-w-xs px-5 py-4">
                    <p className="truncate font-medium text-on-surface">{question.questionText}</p>
                    <p className="mt-0.5 text-xs text-on-surface-muted">
                      {QUESTION_TYPE_LABELS[question.questionType]}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">
                    {OCCUPATION_FAMILY_LABELS[question.occupationFamily]}
                    <span className="block text-xs text-on-surface-muted">{question.specialization}</span>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{question.competency}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        QUALITY_GATE_CLASSES[question.qualityGateStatus],
                      )}
                    >
                      {QUALITY_GATE_LABELS[question.qualityGateStatus]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
                      {SOURCE_LABELS[question.source]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{question.usageCount}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">
                      {question.qualityGateStatus === 'PENDING_REVIEW' ? (
                        <button
                          type="button"
                          onClick={() => handleApprove(question)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-success transition-colors hover:bg-success-container hover:underline"
                        >
                          <CheckIcon className="size-3.5" />
                          Approve
                        </button>
                      ) : null}
                      <Link
                        href={`${ROUTES.INTERVIEW_QUESTIONS}/${question.id}/edit`}
                        className="cursor-pointer text-sm font-semibold text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(question)}
                        className="cursor-pointer text-sm font-semibold text-error hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
