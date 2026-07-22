'use client';

import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  MOCK_INTERVIEW_QUESTIONS,
  QUESTION_TYPE_LABELS,
} from '@/features/interview-questions/mock/interview-question-mock-data';
import {
  getSpecializationsFor,
  OCCUPATION_FAMILY_LABELS,
  type OccupationFamily,
} from '@/features/interview-questions/mock/interview-question-taxonomy';

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

export function InterviewQuestionSearchTest() {
  const [queryText, setQueryText] = useState('');
  const [occupationFamily, setOccupationFamily] = useState<OccupationFamily | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [results, setResults] = useState<ResultRow[] | null>(null);

  const specializationOptions = getSpecializationsFor(occupationFamily);

  const handleSearch = () => {
    if (!queryText.trim() || !occupationFamily || !specialization) return;

    const pool = MOCK_INTERVIEW_QUESTIONS.filter(
      (q) =>
        q.qualityGateStatus === 'APPROVED' &&
        q.occupationFamily === occupationFamily &&
        q.specialization === specialization,
    );

    const ranked = pool
      .map((q) => ({
        id: q.id,
        questionText: q.questionText,
        competency: q.competency,
        questionType: QUESTION_TYPE_LABELS[q.questionType],
        similarity: fakeSimilarity(queryText, q.questionText),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    setResults(ranked);
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
          Sanity-check how well the retrieval system ranks matches for a given query, before it&apos;s used by
          the search-or-generate engine.
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

        <Button
          type="button"
          className="w-auto gap-2 px-4"
          disabled={!queryText.trim() || !occupationFamily || !specialization}
          onClick={handleSearch}
        >
          <SearchIcon className="size-4" />
          Search
        </Button>
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
    </div>
  );
}
