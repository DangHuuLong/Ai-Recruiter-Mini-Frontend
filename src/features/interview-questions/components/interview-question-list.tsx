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
import { useTranslations } from 'next-intl';

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
  QUALITY_GATE_LABEL_KEYS,
  QUESTION_TYPE_LABEL_KEYS,
  SOURCE_LABEL_KEYS,
  type InterviewQuestion,
  type InterviewQuestionType,
  type QuestionQualityGateStatus,
} from '@/features/interview-questions/types/interview-question.type';
import {
  OCCUPATION_FAMILY_LABEL_KEYS,
  type OccupationFamily,
} from '@/features/interview-questions/types/interview-question-taxonomy.type';
import type { PaginationMeta } from '@/lib/api/api-types';
import { cn } from '@/lib/utils/cn';

const PAGE_SIZE = 20;

const OCCUPATION_FAMILIES = Object.keys(OCCUPATION_FAMILY_LABEL_KEYS) as OccupationFamily[];
const QUESTION_TYPES = Object.keys(QUESTION_TYPE_LABEL_KEYS) as InterviewQuestionType[];
const QUALITY_GATE_STATUSES = Object.keys(QUALITY_GATE_LABEL_KEYS) as QuestionQualityGateStatus[];

function buildColumns(
  t: ReturnType<typeof useTranslations<'interviewQuestions'>>,
  occupationFamily: OccupationFamily | '',
  questionType: InterviewQuestionType | '',
  qualityGateStatus: QuestionQualityGateStatus | '',
  reembeddingId: string | null,
  onApprove: (question: InterviewQuestion) => void,
  onReembed: (question: InterviewQuestion) => void,
  onDelete: (question: InterviewQuestion) => void,
): DataTableColumn<InterviewQuestion>[] {
  const occupationFamilyFilterOptions = OCCUPATION_FAMILIES.map((family) => ({
    label: t(`labels.occupationFamily.${OCCUPATION_FAMILY_LABEL_KEYS[family]}`),
    value: family,
  }));
  const questionTypeFilterOptions = QUESTION_TYPES.map((type) => ({
    label: t(`labels.questionType.${QUESTION_TYPE_LABEL_KEYS[type]}`),
    value: type,
  }));
  const qualityGateFilterOptions = QUALITY_GATE_STATUSES.map((status) => ({
    label: t(`labels.qualityGate.${QUALITY_GATE_LABEL_KEYS[status]}`),
    value: status,
  }));

  return [
    {
      key: 'question',
      header: t('list.columns.question'),
      className: 'max-w-xs',
      filter: { key: 'questionType', options: questionTypeFilterOptions, activeValue: questionType },
      render: (question) => (
        <div>
          <p className="truncate font-medium text-on-surface">{question.questionText}</p>
          <p className="mt-0.5 text-xs text-on-surface-muted">
            {t(`labels.questionType.${QUESTION_TYPE_LABEL_KEYS[question.questionType]}`)}
          </p>
        </div>
      ),
    },
    {
      key: 'family',
      header: t('list.columns.familySpecialization'),
      filter: { key: 'occupationFamily', options: occupationFamilyFilterOptions, activeValue: occupationFamily },
      render: (question) => (
        <div className="text-on-surface-variant">
          {t(`labels.occupationFamily.${OCCUPATION_FAMILY_LABEL_KEYS[question.occupationFamily]}`)}
          <span className="block text-xs text-on-surface-muted">{question.specialization}</span>
        </div>
      ),
    },
    {
      key: 'competency',
      header: t('list.columns.competency'),
      render: (question) => <p className="text-on-surface-variant">{question.competency}</p>,
    },
    {
      key: 'quality',
      header: t('list.columns.quality'),
      filter: { key: 'qualityGateStatus', options: qualityGateFilterOptions, activeValue: qualityGateStatus },
      render: (question) => (
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', QUALITY_GATE_CLASSES[question.qualityGateStatus])}>
          {t(`labels.qualityGate.${QUALITY_GATE_LABEL_KEYS[question.qualityGateStatus]}`)}
        </span>
      ),
    },
    {
      key: 'source',
      header: t('list.columns.source'),
      render: (question) => (
        <span className="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          {t(`labels.source.${SOURCE_LABEL_KEYS[question.source]}`)}
        </span>
      ),
    },
    {
      key: 'usage',
      header: t('list.columns.usage'),
      render: (question) => <p className="text-on-surface-variant">{question.usageCount}</p>,
    },
    {
      key: 'action',
      header: t('list.columns.actions'),
      className: 'text-right',
      render: (question) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          {question.qualityGateStatus === 'PENDING_REVIEW' ? (
            <ActionIconButton
              icon={<CheckIcon className="size-4" />}
              label={t('list.actions.approve')}
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
            label={t('list.actions.reembed')}
            disabled={reembeddingId !== null}
            onClick={() => onReembed(question)}
          />
          <ActionIconButton
            href={`${ROUTES.INTERVIEW_QUESTIONS}/${question.id}/edit`}
            icon={<PencilIcon className="size-4" />}
            label={t('list.actions.edit')}
          />
          <ActionIconButton
            icon={<Trash2Icon className="size-4" />}
            label={t('list.actions.delete')}
            variant="danger"
            onClick={() => onDelete(question)}
          />
        </div>
      ),
    },
  ];
}

export function InterviewQuestionList() {
  const t = useTranslations('interviewQuestions');
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
      const message = error instanceof Error ? error.message : t('list.errorFallback');
      setErrorMessage(message);
      showToast.error(t('list.errorFallback'), { description: message });
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
      showToast.success(t('list.toast.approveSuccess'));
      await loadQuestions();
    } catch (error) {
      showToast.error(t('list.toast.approveFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.toast.genericFailedFallback'),
      });
    }
  };

  const handleReembed = async (question: InterviewQuestion) => {
    try {
      setReembeddingId(question.id);
      await reembedInterviewQuestion(question.id);
      showToast.success(t('list.toast.reembedSuccess'), { description: question.questionText });
    } catch (error) {
      showToast.error(t('list.toast.reembedFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.toast.genericFailedFallback'),
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
      showToast.success(t('list.toast.deleteSuccess'));
      setQuestionToDelete(null);
      await loadQuestions();
    } catch (error) {
      showToast.error(t('list.toast.deleteFailedTitle'), {
        description: error instanceof Error ? error.message : t('list.toast.genericFailedFallback'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && questions.length === 0) {
    return <LoadingState title={t('list.loadingTitle')} description={t('list.loadingDescription')} />;
  }

  if (errorMessage && questions.length === 0) {
    return (
      <EmptyState
        title={t('list.errorTitle')}
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => void loadQuestions()}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            {t('list.tryAgain')}
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
            <h1 className="text-2xl font-bold text-on-surface">{t('list.title')}</h1>
            <span className="rounded-full bg-surface-variant px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
              {t('internalToolBadge')}
            </span>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">{t('list.subtitle')}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={ROUTES.INTERVIEW_QUESTIONS_SEARCH_TEST}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-outline bg-surface-lowest px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
          >
            <FlaskConicalIcon className="size-4" />
            {t('list.testRetrieval')}
          </Link>
          <Link
            href={ROUTES.INTERVIEW_QUESTIONS_BULK_CREATE}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-outline bg-surface-lowest px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
          >
            <UploadIcon className="size-4" />
            {t('list.bulkCreate')}
          </Link>
          <Link
            href={ROUTES.INTERVIEW_QUESTION_CREATE}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <PlusIcon className="size-4" />
            {t('list.newQuestion')}
          </Link>
        </div>
      </div>

      <ListControls pagination={{ ...meta, onPageChange: setPage }} />

      {questions.length === 0 ? (
        <EmptyState
          title={t('list.emptyTitle')}
          description={t('list.emptyDescription')}
        />
      ) : (
        <DataTable
          data={questions}
          columns={buildColumns(
            t,
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
        title={t('list.deleteConfirmTitle')}
        description={t('list.deleteConfirmDescription')}
        confirmLabel={t('list.deleteConfirmAction')}
        isLoading={isDeleting}
        onCancel={() => setQuestionToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
