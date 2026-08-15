'use client';

import { CheckIcon, SearchIcon, SparklesIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import {
  searchInterviewQuestions,
  searchOrGenerateInterviewQuestions,
  updateInterviewQuestion,
} from '@/features/interview-questions/api/interview-question.api';
import {
  QUALITY_GATE_CLASSES,
  QUALITY_GATE_LABEL_KEYS,
  type InterviewQuestion,
  type SearchResultRow,
} from '@/features/interview-questions/types/interview-question.type';
import {
  getSpecializationsFor,
  OCCUPATION_FAMILY_LABEL_KEYS,
  type OccupationFamily,
} from '@/features/interview-questions/types/interview-question-taxonomy.type';
import { ApiError } from '@/lib/api/api-error';

const OCCUPATION_FAMILIES = Object.keys(OCCUPATION_FAMILY_LABEL_KEYS) as OccupationFamily[];

export function InterviewQuestionSearchTest() {
  const t = useTranslations('interviewQuestions');
  const [queryText, setQueryText] = useState('');
  const [occupationFamily, setOccupationFamily] = useState<OccupationFamily | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [results, setResults] = useState<SearchResultRow[] | null>(null);
  const [generated, setGenerated] = useState<InterviewQuestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const specializationOptions = getSpecializationsFor(occupationFamily);
  const canSearch = Boolean(queryText.trim() && occupationFamily && specialization);

  const handleSearch = async () => {
    if (!canSearch || !occupationFamily) return;

    try {
      setIsSearching(true);
      setGenerated([]);
      const rows = await searchInterviewQuestions({ queryText, occupationFamily, specialization });
      setResults(rows);
    } catch (error) {
      showToast.error(t('searchTest.toast.searchFailedTitle'), {
        description: error instanceof ApiError ? error.message : t('searchTest.toast.genericFailedFallback'),
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchOrGenerate = async () => {
    if (!canSearch || !occupationFamily) return;

    try {
      setIsGenerating(true);
      const result = await searchOrGenerateInterviewQuestions({ queryText, occupationFamily, specialization });
      setResults(result.existing);
      setGenerated(result.generated);
    } catch (error) {
      showToast.error(t('searchTest.toast.generateFailedTitle'), {
        description: error instanceof ApiError ? error.message : t('searchTest.toast.genericFailedFallback'),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (question: InterviewQuestion) => {
    try {
      await updateInterviewQuestion(question.id, { qualityGateStatus: 'APPROVED' });
      setApprovedIds((current) => new Set(current).add(question.id));
      showToast.success(t('searchTest.toast.approveSuccess'), {
        description: t('searchTest.toast.approveSuccessDescription'),
      });
    } catch (error) {
      showToast.error(t('searchTest.toast.approveFailedTitle'), {
        description: error instanceof Error ? error.message : t('searchTest.toast.genericFailedFallback'),
      });
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href={ROUTES.INTERVIEW_QUESTIONS}
        className="inline-flex cursor-pointer text-sm font-semibold text-primary transition hover:underline"
      >
        {t('backToBank')}
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-on-surface">{t('searchTest.title')}</h1>
          <span className="rounded-full bg-surface-variant px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
            {t('internalToolBadge')}
          </span>
        </div>
        <p className="mt-1 text-sm text-on-surface-variant">{t('searchTest.subtitle')}</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            {t('searchTest.queryTextLabel')}
          </label>
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            rows={2}
            placeholder={t('searchTest.queryTextPlaceholder')}
            className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {t('fields.occupationFamilyLabel')}
            </label>
            <select
              value={occupationFamily}
              onChange={(e) => {
                setOccupationFamily(e.target.value as OccupationFamily | '');
                setSpecialization('');
              }}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">{t('fields.selectFamily')}</option>
              {OCCUPATION_FAMILIES.map((family) => (
                <option key={family} value={family}>
                  {t(`labels.occupationFamily.${OCCUPATION_FAMILY_LABEL_KEYS[family]}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {t('fields.specializationLabel')}
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              disabled={!occupationFamily}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
            >
              <option value="">{t('fields.selectSpecialization')}</option>
              {specializationOptions.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className="w-auto gap-2 px-4"
            disabled={!canSearch || isSearching}
            isLoading={isSearching}
            onClick={() => void handleSearch()}
          >
            <SearchIcon className="size-4" />
            {t('searchTest.searchButton')}
          </Button>
          <Button
            type="button"
            className="w-auto gap-2 px-4"
            disabled={!canSearch || isGenerating}
            isLoading={isGenerating}
            onClick={() => void handleSearchOrGenerate()}
          >
            <SparklesIcon className="size-4" />
            {isGenerating ? t('searchTest.generatingButton') : t('searchTest.generateButton')}
          </Button>
        </div>
        <p className="text-xs text-on-surface-muted">
          {t.rich('searchTest.helpText', { b: (chunks) => <span className="font-semibold">{chunks}</span> })}
        </p>
      </div>

      {results ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-on-surface">
            {results.length === 0 ? t('searchTest.noResults') : t('searchTest.topMatches', { count: results.length })}
          </p>

          {results.map((result, index) => (
            <div
              key={result.id}
              className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {index + 1}. {result.questionText}
                  </p>
                  <p className="mt-1 text-xs text-on-surface-muted">
                    {result.competency} · {result.questionType}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-primary-container px-2.5 py-1 text-xs font-bold text-on-primary-container">
                  {result.similarity.toFixed(2)}
                </span>
              </div>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.round(result.similarity * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {isGenerating ? (
        <div className="rounded-2xl border border-dashed border-primary/40 bg-primary-container/20 p-4 text-sm text-on-surface-variant">
          {t('searchTest.generatingNotice')}
        </div>
      ) : null}

      {generated.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-t border-outline pt-4">
            <SparklesIcon className="size-4 text-primary" />
            <p className="text-sm font-semibold text-on-surface">{t('searchTest.newlyGeneratedTitle')}</p>
          </div>

          {generated.map((question) => {
            const isApproved = approvedIds.has(question.id);
            return (
              <div
                key={question.id}
                className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-on-surface">{question.questionText}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${QUALITY_GATE_CLASSES[isApproved ? 'APPROVED' : 'PENDING_REVIEW']}`}
                  >
                    {t(`labels.qualityGate.${QUALITY_GATE_LABEL_KEYS[isApproved ? 'APPROVED' : 'PENDING_REVIEW']}`)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-on-surface-muted">{question.competency}</p>
                {!isApproved ? (
                  <button
                    type="button"
                    onClick={() => void handleApprove(question)}
                    className="mt-3 inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-success transition-colors hover:bg-success-container hover:underline"
                  >
                    <CheckIcon className="size-3.5" />
                    {t('searchTest.approve')}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
