'use client';

import { CheckIcon, SearchIcon, SparklesIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';

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
  QUALITY_GATE_LABELS,
  type InterviewQuestion,
  type SearchResultRow,
} from '@/features/interview-questions/types/interview-question.type';
import {
  getSpecializationsFor,
  OCCUPATION_FAMILY_LABELS,
  type OccupationFamily,
} from '@/features/interview-questions/types/interview-question-taxonomy.type';
import { ApiError } from '@/lib/api/api-error';

export function InterviewQuestionSearchTest() {
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
      showToast.error('Search failed', {
        description: error instanceof ApiError ? error.message : 'Something went wrong.',
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
      showToast.error('Search + Generate failed', {
        description: error instanceof ApiError ? error.message : 'Something went wrong.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (question: InterviewQuestion) => {
    try {
      await updateInterviewQuestion(question.id, { qualityGateStatus: 'APPROVED' });
      setApprovedIds((current) => new Set(current).add(question.id));
      showToast.success('Question approved', {
        description: 'It now shows up in Search results for this bucket.',
      });
    } catch (error) {
      showToast.error('Failed to approve question', {
        description: error instanceof Error ? error.message : 'Something went wrong.',
      });
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href={ROUTES.INTERVIEW_QUESTIONS}
        className="inline-flex cursor-pointer text-sm font-semibold text-primary transition hover:underline"
      >
        ← Back to Interview Question Bank
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-on-surface">Test retrieval</h1>
          <span className="rounded-full bg-surface-variant px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
            Internal tool
          </span>
        </div>
        <p className="mt-1 text-sm text-on-surface-variant">
          Sanity-check how well the retrieval system ranks matches for a given query, and preview the
          AI-fallback generation used when the existing bank comes up thin.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Query text
          </label>
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            rows={2}
            placeholder="e.g. how would you design a caching strategy for a read-heavy API"
            className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Occupation family
            </label>
            <select
              value={occupationFamily}
              onChange={(e) => {
                setOccupationFamily(e.target.value as OccupationFamily | '');
                setSpecialization('');
              }}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">Select a family</option>
              {(Object.keys(OCCUPATION_FAMILY_LABELS) as OccupationFamily[]).map((family) => (
                <option key={family} value={family}>
                  {OCCUPATION_FAMILY_LABELS[family]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              disabled={!occupationFamily}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
            >
              <option value="">Select a specialization</option>
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
            Search
          </Button>
          <Button
            type="button"
            className="w-auto gap-2 px-4"
            disabled={!canSearch || isGenerating}
            isLoading={isGenerating}
            onClick={() => void handleSearchOrGenerate()}
          >
            <SparklesIcon className="size-4" />
            {isGenerating ? 'Generating...' : 'Search + Generate if needed'}
          </Button>
        </div>
        <p className="text-xs text-on-surface-muted">
          <span className="font-semibold">Search</span> only checks existing approved questions.{' '}
          <span className="font-semibold">Search + Generate if needed</span> also asks the AI to draft new
          candidate questions when the existing bank has too few strong matches — new questions land as
          Pending Review, not immediately reusable.
        </p>
      </div>

      {results ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-on-surface">
            {results.length === 0 ? 'No approved questions in this bucket yet' : `Top ${results.length} matches`}
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
          Generating new candidate questions with AI fallback...
        </div>
      ) : null}

      {generated.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-t border-outline pt-4">
            <SparklesIcon className="size-4 text-primary" />
            <p className="text-sm font-semibold text-on-surface">Newly generated — pending review</p>
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
                    {QUALITY_GATE_LABELS[isApproved ? 'APPROVED' : 'PENDING_REVIEW']}
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
                    Approve
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
