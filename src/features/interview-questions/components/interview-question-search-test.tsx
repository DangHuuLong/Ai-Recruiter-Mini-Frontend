'use client';

import { CheckIcon, SearchIcon, SparklesIcon } from 'lucide-react';
import { useState } from 'react';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import {
  MOCK_INTERVIEW_QUESTIONS,
  QUALITY_GATE_CLASSES,
  QUALITY_GATE_LABELS,
  QUESTION_TYPE_LABELS,
  nextMockInterviewQuestionId,
  type MockInterviewQuestion,
} from '@/features/interview-questions/mock/interview-question-mock-data';
import {
  getBusinessContextsFor,
  getEnablersFor,
  getSpecializationsFor,
  OCCUPATION_FAMILY_LABELS,
  type OccupationFamily,
} from '@/features/interview-questions/mock/interview-question-taxonomy';
import { mockDelay } from '@/lib/utils/mock-delay';

const SIMILARITY_THRESHOLD = 0.55;
const RESULT_LIMIT = 5;
const GENERATE_COUNT = 3;

type ResultRow = {
  id: string;
  questionText: string;
  competency: string;
  questionType: string;
  similarity: number;
};

// Deterministic pseudo-similarity score, purely for mock UI purposes — not a real embedding search.
function fakeSimilarity(query: string, questionText: string): number {
  const q = query.toLowerCase();
  const t = questionText.toLowerCase();
  const queryWords = q.split(/\s+/).filter((w) => w.length > 2);
  if (queryWords.length === 0) return 0.4;
  const hits = queryWords.filter((w) => t.includes(w)).length;
  const base = 0.45 + (hits / queryWords.length) * 0.4;
  const seed = (query.length + questionText.length) % 7;
  return Math.min(0.97, Math.max(0.35, base + seed / 100));
}

function buildGeneratedQuestion(
  family: OccupationFamily,
  specialization: string,
  queryText: string,
  index: number,
): MockInterviewQuestion {
  const enablers = getEnablersFor(family, specialization);
  const businessContexts = getBusinessContextsFor(family, specialization);
  const now = new Date().toISOString();

  return {
    id: nextMockInterviewQuestionId(),
    questionText: `Based on "${queryText.trim()}" — describe how you'd approach this in a ${businessContexts[index % Math.max(businessContexts.length, 1)] ?? specialization} context.`,
    occupationFamily: family,
    specialization,
    enablers: enablers.slice(0, 3),
    businessContext: businessContexts[index % Math.max(businessContexts.length, 1)] ?? specialization,
    competency: `${specialization} fundamentals`,
    competencyType: 'HARD_SKILL',
    assessmentTarget: 'APPLICATION',
    experienceBucket: 'TWO_TO_FOUR',
    autonomyLevel: 'WORKS_INDEPENDENTLY',
    questionType: 'KNOWLEDGE_CHECK',
    rubric: ['Covers the core concept clearly', 'Gives a concrete example or trade-off'],
    source: 'AI_GENERATED',
    qualityGateStatus: 'PENDING_REVIEW',
    usageCount: 0,
    lastUsedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function InterviewQuestionSearchTest() {
  const [queryText, setQueryText] = useState('');
  const [occupationFamily, setOccupationFamily] = useState<OccupationFamily | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [generated, setGenerated] = useState<MockInterviewQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const specializationOptions = getSpecializationsFor(occupationFamily);
  const canSearch = Boolean(queryText.trim() && occupationFamily && specialization);

  const rankPool = (): ResultRow[] => {
    const pool = MOCK_INTERVIEW_QUESTIONS.filter(
      (q) =>
        q.qualityGateStatus === 'APPROVED' &&
        q.occupationFamily === occupationFamily &&
        q.specialization === specialization,
    );

    return pool
      .map((q) => ({
        id: q.id,
        questionText: q.questionText,
        competency: q.competency,
        questionType: QUESTION_TYPE_LABELS[q.questionType],
        similarity: fakeSimilarity(queryText, q.questionText),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, RESULT_LIMIT);
  };

  const handleSearch = () => {
    if (!canSearch) return;
    setGenerated([]);
    setResults(rankPool());
  };

  const handleSearchOrGenerate = async () => {
    if (!canSearch || !occupationFamily) return;

    const ranked = rankPool();
    setResults(ranked);
    setGenerated([]);

    const topSimilarity = ranked[0]?.similarity ?? 0;
    const isThin = ranked.length < RESULT_LIMIT || topSimilarity < SIMILARITY_THRESHOLD;

    if (!isThin) return;

    setIsGenerating(true);
    await mockDelay(900);
    const newQuestions = Array.from({ length: GENERATE_COUNT }, (_, index) =>
      buildGeneratedQuestion(occupationFamily, specialization, queryText, index),
    );
    setGenerated(newQuestions);
    setIsGenerating(false);
  };

  const handleApprove = (question: MockInterviewQuestion) => {
    MOCK_INTERVIEW_QUESTIONS.push({ ...question, qualityGateStatus: 'APPROVED' });
    setApprovedIds((current) => new Set(current).add(question.id));
    showToast.success('Question approved', {
      description: 'It now shows up in Search results for this bucket.',
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
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
          <Button type="button" variant="secondary" className="w-auto gap-2 px-4" disabled={!canSearch} onClick={handleSearch}>
            <SearchIcon className="size-4" />
            Search
          </Button>
          <Button
            type="button"
            className="w-auto gap-2 px-4"
            disabled={!canSearch || isGenerating}
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
                <p className="mt-1 text-xs text-on-surface-muted">
                  {question.competency} · {QUESTION_TYPE_LABELS[question.questionType]}
                </p>
                {!isApproved ? (
                  <button
                    type="button"
                    onClick={() => handleApprove(question)}
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
