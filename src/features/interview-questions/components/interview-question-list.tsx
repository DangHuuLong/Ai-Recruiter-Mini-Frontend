'use client';

import {
  CheckIcon,
  FlaskConicalIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
  UploadIcon,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';

import {
  ActionIconButton,
  ConfirmDialog,
  DataTable,
  ListControls,
  type DataTableColumn,
} from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import {
  deleteInterviewQuestion,
  getInterviewQuestions,
  reembedInterviewQuestion,
  updateInterviewQuestion,
} from '@/features/interview-questions/api/interview-question.api';
import {
  QUALITY_GATE_CLASSES,
  QUALITY_GATE_LABELS,
  QUESTION_TYPE_LABELS,
  SOURCE_LABELS,
  type InterviewQuestion,
  type InterviewQuestionType,
  type QuestionQualityGateStatus,
} from '@/features/interview-questions/types/interview-question.type';
import {
  OCCUPATION_FAMILY_LABELS,
  type OccupationFamily,
} from '@/features/interview-questions/types/interview-question-taxonomy.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { cn } from '@/lib/utils/cn';

const PAGE_SIZE = 20;

const OCCUPATION_FAMILY_FILTER_OPTIONS = (Object.keys(OCCUPATION_FAMILY_LABELS) as OccupationFamily[]).map(
  (family) => ({ label: OCCUPATION_FAMILY_LABELS[family], value: family }),
);

const QUESTION_TYPE_FILTER_OPTIONS = (Object.keys(QUESTION_TYPE_LABELS) as InterviewQuestionType[]).map(
  (type) => ({ label: QUESTION_TYPE_LABELS[type], value: type }),
);

const QUALITY_GATE_FILTER_OPTIONS = (Object.keys(QUALITY_GATE_LABELS) as QuestionQualityGateStatus[]).map(
  (status) => ({ label: QUALITY_GATE_LABELS[status], value: status }),
);

function buildColumns(
  occupationFamily: OccupationFamily | '',
  questionType: InterviewQuestionType | '',
  qualityGateStatus: QuestionQualityGateStatus | '',
  reembeddingId: string | null,
  onApprove: (question: InterviewQuestion) => void,
  onReembed: (question: InterviewQuestion) => void,
  onDelete: (question: InterviewQuestion) => void,
): DataTableColumn<InterviewQuestion>[] {
  return [
    {
      key: 'question',
      header: 'Question',
      className: 'max-w-xs',
      filter: { key: 'questionType', options: QUESTION_TYPE_FILTER_OPTIONS, activeValue: questionType },
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
      render: (question) => (
        <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          {SOURCE_LABELS[question.source]}
        </span>
      ),
    },
    {
      key: 'usage',
      header: 'Usage',
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
            icon={
              reembeddingId === question.id ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <RefreshCwIcon className="size-4" />
              )
            }
            label="Re-embed"
            disabled={reembeddingId !== null}
            onClick={() => onReembed(question)}
          />
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
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [occupationFamily, setOccupationFamily] = useState<OccupationFamily | ''>('');
  const [questionType, setQuestionType] = useState<InterviewQuestionType | ''>('');
  const [qualityGateStatus, setQualityGateStatus] = useState<QuestionQualityGateStatus | ''>('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reembeddingId, setReembeddingId] = useState<string | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<InterviewQuestion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getInterviewQuestions({
        page,
        limit: PAGE_SIZE,
        occupationFamily: occupationFamily || undefined,
        questionType: questionType || undefined,
        qualityGateStatus: qualityGateStatus || undefined,
      });
      setQuestions(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load interview questions';
      setErrorMessage(message);
      showToast.error('Failed to load interview questions', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, occupationFamily, questionType, qualityGateStatus]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'occupationFamily') setOccupationFamily(value as OccupationFamily | '');
    if (key === 'questionType') setQuestionType(value as InterviewQuestionType | '');
    if (key === 'qualityGateStatus') setQualityGateStatus(value as QuestionQualityGateStatus | '');
    setPage(1);
  };

  const handleApprove = async (question: InterviewQuestion) => {
    try {
      await updateInterviewQuestion(question.id, { qualityGateStatus: 'APPROVED' });
      showToast.success('Question approved');
      await loadQuestions();
    } catch (error) {
      showToast.error('Failed to approve question', {
        description: error instanceof Error ? error.message : 'Something went wrong.',
      });
    }
  };

  const handleReembed = async (question: InterviewQuestion) => {
    try {
      setReembeddingId(question.id);
      await reembedInterviewQuestion(question.id);
      showToast.success('Embedding recomputed', { description: question.questionText });
    } catch (error) {
      showToast.error('Failed to re-embed question', {
        description: error instanceof Error ? error.message : 'Something went wrong.',
      });
    } finally {
      setReembeddingId(null);
    }
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;

    try {
      setIsDeleting(true);
      await deleteInterviewQuestion(questionToDelete.id);
      showToast.success('Question deleted');
      setQuestionToDelete(null);
      await loadQuestions();
    } catch (error) {
      showToast.error('Failed to delete question', {
        description: error instanceof Error ? error.message : 'Something went wrong.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && questions.length === 0) {
    return <LoadingState title="Loading interview questions..." description="Please wait while questions are being loaded." />;
  }

  if (errorMessage && questions.length === 0) {
    return (
      <EmptyState
        title="Failed to load interview questions"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadQuestions()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Try again
          </button>
        }
      />
    );
  }

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

      <ListControls pagination={{ ...meta, onPageChange: setPage }} />

      {questions.length === 0 ? (
        <EmptyState
          title="No questions match these filters"
          description="Try clearing a filter or add a new question."
        />
      ) : (
        <DataTable
          data={questions}
          columns={buildColumns(
            occupationFamily,
            questionType,
            qualityGateStatus,
            reembeddingId,
            (question) => void handleApprove(question),
            (question) => void handleReembed(question),
            setQuestionToDelete,
          )}
          getRowKey={(question) => question.id}
          onFilterChange={handleFilterChange}
        />
      )}

      <ConfirmDialog
        open={Boolean(questionToDelete)}
        title="Delete question?"
        description="This action removes the question from the bank. This cannot be undone."
        confirmLabel="Delete question"
        isLoading={isDeleting}
        onCancel={() => setQuestionToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
