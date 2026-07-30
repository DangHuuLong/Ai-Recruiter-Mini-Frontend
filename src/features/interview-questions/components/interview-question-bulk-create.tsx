'use client';

import { CheckCircle2Icon, UploadIcon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { bulkCreateInterviewQuestions } from '@/features/interview-questions/api/interview-question.api';
import {
  ASSESSMENT_TARGET_LABELS,
  AUTONOMY_LEVEL_LABELS,
  COMPETENCY_TYPE_LABELS,
  EXPERIENCE_BUCKET_LABELS,
  QUESTION_TYPE_LABELS,
  type CreateInterviewQuestionPayload,
} from '@/features/interview-questions/types/interview-question.type';
import {
  INTERVIEW_QUESTION_TAXONOMY,
  OCCUPATION_FAMILY_LABELS,
  type OccupationFamily,
} from '@/features/interview-questions/types/interview-question-taxonomy.type';
import { cn } from '@/lib/utils/cn';

type RawItem = Record<string, unknown>;

type PreviewRow = {
  index: number;
  raw: RawItem;
  errors: string[];
};

type SubmitResult = {
  index: number;
  success: boolean;
  error?: string;
};

const REQUIRED_STRING_FIELDS = ['questionText', 'specialization', 'businessContext', 'competency'];

function validateItem(item: RawItem): string[] {
  const errors: string[] = [];

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof item[field] !== 'string' || (item[field] as string).trim().length === 0) {
      errors.push(`Missing "${field}"`);
    }
  }

  const family = item.occupationFamily as OccupationFamily | undefined;
  if (!family || !(family in INTERVIEW_QUESTION_TAXONOMY)) {
    errors.push('Invalid or missing "occupationFamily"');
  } else if (typeof item.specialization === 'string') {
    const known = INTERVIEW_QUESTION_TAXONOMY[family].specializations.includes(item.specialization);
    if (!known) errors.push(`"specialization" not known for ${family}`);
  }

  if (!Array.isArray(item.enablers)) errors.push('"enablers" must be an array of strings');
  if (typeof item.competencyType !== 'string' || !(item.competencyType in COMPETENCY_TYPE_LABELS)) {
    errors.push('Invalid or missing "competencyType"');
  }
  if (typeof item.assessmentTarget !== 'string' || !(item.assessmentTarget in ASSESSMENT_TARGET_LABELS)) {
    errors.push('Invalid or missing "assessmentTarget"');
  }
  if (typeof item.experienceBucket !== 'string' || !(item.experienceBucket in EXPERIENCE_BUCKET_LABELS)) {
    errors.push('Invalid or missing "experienceBucket"');
  }
  if (typeof item.autonomyLevel !== 'string' || !(item.autonomyLevel in AUTONOMY_LEVEL_LABELS)) {
    errors.push('Invalid or missing "autonomyLevel"');
  }
  if (typeof item.questionType !== 'string' || !(item.questionType in QUESTION_TYPE_LABELS)) {
    errors.push('Invalid or missing "questionType"');
  }
  if (!Array.isArray(item.rubric) || item.rubric.length === 0) {
    errors.push('"rubric" must be a non-empty array of strings');
  }

  return errors;
}

export function InterviewQuestionBulkCreate() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawText, setRawText] = useState('');
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [results, setResults] = useState<SubmitResult[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleParse = () => {
    setResults(null);
    try {
      const parsed = JSON.parse(rawText);
      if (!Array.isArray(parsed)) {
        showToast.error('Expected a JSON array of question objects');
        return;
      }
      if (parsed.length === 0) {
        showToast.error('The array is empty');
        return;
      }
      if (parsed.length > 200) {
        showToast.error('Maximum 200 items per bulk request');
        return;
      }
      const rows: PreviewRow[] = parsed.map((item, index) => ({
        index,
        raw: item as RawItem,
        errors: validateItem(item as RawItem),
      }));
      setPreview(rows);
    } catch {
      showToast.error('Invalid JSON — check the syntax and try again');
    }
  };

  const handleFileUpload = (file: File) => {
    file.text().then((text) => setRawText(text));
  };

  const handleSubmit = async () => {
    if (!preview) return;

    const invalidResults: SubmitResult[] = preview
      .filter((row) => row.errors.length > 0)
      .map((row) => ({ index: row.index, success: false, error: row.errors[0] }));
    const validRows = preview.filter((row) => row.errors.length === 0);

    if (validRows.length === 0) {
      setResults(invalidResults);
      return;
    }

    try {
      setIsSubmitting(true);
      const items = validRows.map((row) => row.raw as unknown as CreateInterviewQuestionPayload);
      const apiResults = await bulkCreateInterviewQuestions(items);
      const mapped: SubmitResult[] = apiResults.map((result, i) => ({
        index: validRows[i].index,
        success: result.success,
        error: result.success ? undefined : result.error,
      }));
      const combined = [...invalidResults, ...mapped].sort((a, b) => a.index - b.index);
      setResults(combined);
      const successCount = combined.filter((r) => r.success).length;
      showToast.success(`Created ${successCount} of ${combined.length} questions`);
    } catch (error) {
      showToast.error('Bulk create failed', {
        description: error instanceof Error ? error.message : 'Something went wrong.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validCount = preview?.filter((row) => row.errors.length === 0).length ?? 0;

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href={ROUTES.INTERVIEW_QUESTIONS}
        className="inline-flex cursor-pointer text-sm font-semibold text-primary transition hover:underline"
      >
        ← Back to Interview Question Bank
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-on-surface">Bulk create questions</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Paste a JSON array of question objects (up to 200), matching the same fields as the create form.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Question JSON array
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary-container hover:text-on-primary-container hover:underline"
          >
            <UploadIcon className="size-3.5" />
            Upload .json file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = '';
            }}
          />
        </div>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={10}
          placeholder='[{"questionText": "...", "occupationFamily": "IT", "specialization": "Backend", ...}]'
          className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-2.5 font-mono text-xs text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
        />

        <Button type="button" className="w-auto px-4" onClick={handleParse} disabled={!rawText.trim()}>
          Preview
        </Button>
      </div>

      {preview ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-on-surface">
            {validCount} of {preview.length} items are valid
          </p>

          <div className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-surface-variant">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    Question text
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    Family
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {preview.map((row) => {
                  const result = results?.find((r) => r.index === row.index);
                  const family = row.raw.occupationFamily as OccupationFamily | undefined;
                  return (
                    <tr key={row.index} className="transition-colors hover:bg-surface-variant/60">
                      <td className="px-4 py-3 text-on-surface-muted">{row.index + 1}</td>
                      <td className="max-w-md px-4 py-3">
                        <p className="truncate text-on-surface">
                          {typeof row.raw.questionText === 'string' ? row.raw.questionText : '—'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        {family ? (OCCUPATION_FAMILY_LABELS[family] ?? String(family)) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {result ? (
                          result.success ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                              <CheckCircle2Icon className="size-4" />
                              Created
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-error">
                              <XCircleIcon className="size-4" />
                              {result.error}
                            </span>
                          )
                        ) : row.errors.length > 0 ? (
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 text-xs font-semibold text-error',
                            )}
                            title={row.errors.join('; ')}
                          >
                            <XCircleIcon className="size-4" />
                            {row.errors[0]}
                            {row.errors.length > 1 ? ` (+${row.errors.length - 1} more)` : ''}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-on-surface-muted">Ready</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              className="w-auto px-4"
              onClick={() => router.push(ROUTES.INTERVIEW_QUESTIONS)}
            >
              {results ? 'Done' : 'Cancel'}
            </Button>
            {!results ? (
              <Button
                type="button"
                className="w-auto px-4"
                disabled={validCount === 0}
                isLoading={isSubmitting}
                onClick={() => void handleSubmit()}
              >
                Create {validCount} question{validCount === 1 ? '' : 's'}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
