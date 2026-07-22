'use client';

import { CheckIcon, FlaskConicalIcon, PencilIcon, PlusIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  ActionIconButton,
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from '@/components/common';
import { showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import {
  MOCK_INTERVIEW_QUESTIONS,
  QUALITY_GATE_CLASSES,
  QUALITY_GATE_LABELS,
  QUESTION_TYPE_LABELS,
  SOURCE_LABELS,
  type InterviewQuestionSource,
  type InterviewQuestionType,
  type MockInterviewQuestion,
  type QuestionQualityGateStatus,
} from '@/features/interview-questions/mock/interview-question-mock-data';
import {
  getSpecializationsFor,
  OCCUPATION_FAMILY_LABELS,
  type OccupationFamily,
} from '@/features/interview-questions/mock/interview-question-taxonomy';
import { sortMock } from '@/lib/utils/mock-delay';
import { cn } from '@/lib/utils/cn';

const OCCUPATION_FAMILY_FILTER_OPTIONS = (Object.keys(OCCUPATION_FAMILY_LABELS) as OccupationFamily[]).map(
  (family) => ({ label: OCCUPATION_FAMILY_LABELS[family], value: family }),
);

const QUALITY_GATE_FILTER_OPTIONS = (Object.keys(QUALITY_GATE_LABELS) as QuestionQualityGateStatus[]).map(
  (status) => ({ label: QUALITY_GATE_LABELS[status], value: status }),
);

const SOURCE_FILTER_OPTIONS = (Object.keys(SOURCE_LABELS) as InterviewQuestionSource[]).map((source) => ({
  label: SOURCE_LABELS[source],
  value: source,
}));

function buildColumns(
  occupationFamily: OccupationFamily | '',
  qualityGateStatus: QuestionQualityGateStatus | '',
  source: InterviewQuestionSource | '',
  onApprove: (question: MockInterviewQuestion) => void,
  onDelete: (question: MockInterviewQuestion) => void,
): DataTableColumn<MockInterviewQuestion>[] {
  return [
    {
      key: 'question',
      header: 'Question',
      sortKey: 'questionText',
      className: 'max-w-xs',
      render: (question) => (
        <div>
          <p className="truncate font-medium text-on-surface">{question.questionText}</p>
          <p className="mt-0.5 text-xs text-on-surface-muted">{QUESTION_TYPE_LABELS[question.questionType]}</p>
        </div>
      ),
    },
    {
      key: 'family',
      header: 'Family / Specialization',
      sortKey: 'occupationFamily',
      filter: { key: 'occupationFamily', options: OCCUPATION_FAMILY_FILTER_OPTIONS, activeValue: occupationFamily },
      render: (question) => (
        <div className="text-on-surface-variant">
          {OCCUPATION_FAMILY_LABELS[question.occupationFamily]}
          <span className="block text-xs text-on-surface-muted">{question.specialization}</span>
        </div>
      ),
    },
    {
      key: 'competency',
      header: 'Competency',
      sortKey: 'competency',
      render: (question) => <p className="text-on-surface-variant">{question.competency}</p>,
    },
    {
      key: 'quality',
      header: 'Quality',
      filter: { key: 'qualityGateStatus', options: QUALITY_GATE_FILTER_OPTIONS, activeValue: qualityGateStatus },
      render: (question) => (
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', QUALITY_GATE_CLASSES[question.qualityGateStatus])}>
          {QUALITY_GATE_LABELS[question.qualityGateStatus]}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      filter: { key: 'source', options: SOURCE_FILTER_OPTIONS, activeValue: source },
      render: (question) => (
        <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          {SOURCE_LABELS[question.source]}
        </span>
      ),
    },
    {
      key: 'usage',
      header: 'Usage',
      sortKey: 'usageCount',
      render: (question) => <p className="text-on-surface-variant">{question.usageCount}</p>,
    },
    {
      key: 'action',
      header: 'Actions',
      className: 'text-right',
      render: (question) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          {question.qualityGateStatus === 'PENDING_REVIEW' ? (
            <ActionIconButton
              icon={<CheckIcon className="size-4" />}
              label="Approve"
              variant="primary"
              onClick={() => onApprove(question)}
            />
          ) : null}
          <ActionIconButton
            href={`${ROUTES.INTERVIEW_QUESTIONS}/${question.id}/edit`}
            icon={<PencilIcon className="size-4" />}
            label="Edit"
          />
          <ActionIconButton
            icon={<Trash2Icon className="size-4" />}
            label="Delete"
            variant="danger"
            onClick={() => onDelete(question)}
          />
        </div>
      ),
    },
  ];
}

export function InterviewQuestionList() {
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>(MOCK_INTERVIEW_QUESTIONS);
  const [occupationFamily, setOccupationFamily] = useState<OccupationFamily | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [questionType, setQuestionType] = useState<InterviewQuestionType | ''>('');
  const [qualityGateStatus, setQualityGateStatus] = useState<QuestionQualityGateStatus | ''>('');
  const [source, setSource] = useState<InterviewQuestionSource | ''>('');
  const [sort, setSort] = useState<DataTableSort | null>(null);

  const specializationOptions = getSpecializationsFor(occupationFamily);

  const filtered = useMemo(() => {
    const result = questions.filter((q) => {
      if (occupationFamily && q.occupationFamily !== occupationFamily) return false;
      if (specialization && q.specialization !== specialization) return false;
      if (questionType && q.questionType !== questionType) return false;
      if (qualityGateStatus && q.qualityGateStatus !== qualityGateStatus) return false;
      if (source && q.source !== source) return false;
      return true;
    });
    return sortMock(result, sort?.key, sort?.order);
  }, [questions, occupationFamily, specialization, questionType, qualityGateStatus, source, sort]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'occupationFamily') {
      setOccupationFamily(value as OccupationFamily | '');
      setSpecialization('');
    }
    if (key === 'qualityGateStatus') setQualityGateStatus(value as QuestionQualityGateStatus | '');
    if (key === 'source') setSource(value as InterviewQuestionSource | '');
  };

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
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-12 text-center shadow-card">
          <p className="text-sm font-semibold text-on-surface">No questions match these filters</p>
          <p className="mt-1 text-sm text-on-surface-variant">Try clearing a filter or add a new question.</p>
        </div>
      ) : (
        <DataTable
          data={filtered}
          columns={buildColumns(occupationFamily, qualityGateStatus, source, handleApprove, handleDelete)}
          getRowKey={(question) => question.id}
          sort={sort}
          onSortChange={(key, order) => setSort({ key, order })}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
}
