'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  DownloadIcon,
  LoaderCircleIcon,
  SparklesIcon,
  UserPlusIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import {
  CRITERION_LABELS,
  getMockBatch,
  getMockCellDetail,
  getMockMatrix,
  getMockSkillGap,
  getScoreTier,
  STATUS_CLASSES,
  STATUS_LABELS,
  type MockCellDetail,
  type MockMatrixCell,
} from '@/features/batch-scoring/mock/batch-scoring-mock-data';
import { cn } from '@/lib/utils/cn';

const IN_PROGRESS_STATUSES = new Set(['PENDING', 'PARSING', 'SCORING']);

type BatchDetailProps = {
  batchId: string;
};

export function BatchDetail({ batchId }: BatchDetailProps) {
  const batch = getMockBatch(batchId);
  const [selectedCell, setSelectedCell] = useState<
    (MockCellDetail & { candidateLabel: string; jdLabel: string }) | null
  >(null);
  const [questionsRevealed, setQuestionsRevealed] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  if (!batch) {
    return (
      <div className="rounded-2xl border border-outline bg-surface-lowest p-10 text-center shadow-card">
        <p className="text-sm font-semibold text-on-surface">Batch not found</p>
      </div>
    );
  }

  const matrix = getMockMatrix(batch);
  const skillGap = getMockSkillGap(batch);
  const isInProgress = IN_PROGRESS_STATUSES.has(batch.status);
  const progressPercent =
    batch.totalPairCount === 0
      ? 0
      : Math.round((batch.completedPairCount / batch.totalPairCount) * 100);

  const openCell = (cell: MockMatrixCell) => {
    if (cell.status !== 'COMPLETED' || cell.overallScore === null) return;

    const row = matrix.rows.find((r) => r.resumeItemId === cell.resumeItemId);
    const column = matrix.columns.find((c) => c.id === cell.jdItemId);
    const detail = getMockCellDetail(cell.overallScore);

    setSelectedCell({
      ...detail,
      candidateLabel: row?.candidateLabel ?? 'Candidate',
      jdLabel: column?.label ?? 'Job description',
    });
    setQuestionsRevealed(false);
    setIsGeneratingQuestions(false);
  };

  const handleGenerateQuestions = () => {
    setIsGeneratingQuestions(true);
    setTimeout(() => {
      setIsGeneratingQuestions(false);
      setQuestionsRevealed(true);
    }, 700);
  };

  const handlePromote = () => {
    showToast.success('Promoted to candidate pipeline', {
      description: `${selectedCell?.candidateLabel} → ${selectedCell?.jdLabel}`,
    });
    setSelectedCell(null);
  };

  return (
    <div className="space-y-6">
      <Link
        href={ROUTES.BATCH_SCORING}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
      >
        <ArrowLeftIcon className="size-4" />
        Back to batches
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-on-surface">{batch.name}</h1>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                STATUS_CLASSES[batch.status],
              )}
            >
              {STATUS_LABELS[batch.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            {batch.totalCvCount} CVs × {batch.totalJdCount} JDs · {batch.completedPairCount}/
            {batch.totalPairCount} pairs scored
          </p>
        </div>

        <div className="flex gap-2">
          {batch.status === 'COMPLETED' || batch.status === 'COMPLETED_WITH_ERRORS' ? (
            <Button variant="secondary" className="w-auto gap-2 px-4">
              <DownloadIcon className="size-4" />
              Export CSV
            </Button>
          ) : null}
          {isInProgress ? (
            <Button
              variant="secondary"
              className="w-auto px-4"
              onClick={() => showToast.info('Batch cancelled')}
            >
              Cancel batch
            </Button>
          ) : null}
        </div>
      </div>

      {isInProgress ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-8 text-center shadow-card">
          <LoaderCircleIcon className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-semibold text-on-surface">
            {STATUS_LABELS[batch.status]}...
          </p>
          <div className="mx-auto mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-surface-variant">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-2 text-xs text-on-surface-muted">
            {batch.completedPairCount} / {batch.totalPairCount} pairs · {progressPercent}%
          </p>
        </div>
      ) : batch.status === 'FAILED' || batch.status === 'CANCELLED' ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-8 text-center shadow-card">
          <p className="text-sm font-semibold text-on-surface">
            This batch {batch.status === 'FAILED' ? 'failed to complete' : 'was cancelled'}.
          </p>
        </div>
      ) : (
        <>
          <div className="no-scrollbar overflow-x-auto rounded-2xl border border-outline bg-surface-lowest shadow-card">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 border-b border-r border-outline bg-surface-variant p-3 text-left font-semibold text-on-surface-variant">
                    Candidate
                  </th>
                  {matrix.columns.map((column) => (
                    <th
                      key={column.id}
                      className="border-b border-outline bg-surface-variant p-3 text-left font-semibold text-on-surface-variant"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.rows.map((row) => (
                  <tr key={row.resumeItemId}>
                    <td className="sticky left-0 z-10 border-r border-outline bg-surface-lowest p-3 font-semibold text-on-surface">
                      {row.candidateLabel}
                    </td>
                    {matrix.columns.map((column) => {
                      const cell = matrix.cells.find(
                        (c) => c.resumeItemId === row.resumeItemId && c.jdItemId === column.id,
                      );
                      if (!cell) return <td key={column.id} className="border-b border-outline p-2" />;

                      const tier = cell.overallScore !== null ? getScoreTier(cell.overallScore) : null;

                      return (
                        <td key={column.id} className="border-b border-outline p-2">
                          {cell.status === 'FAILED' ? (
                            <div
                              title={cell.error ?? 'Failed'}
                              className="flex h-14 w-full items-center justify-center rounded-lg bg-error-container text-xs font-semibold text-error"
                            >
                              Failed
                            </div>
                          ) : cell.status === 'PENDING' || !tier ? (
                            <div className="flex h-14 w-full items-center justify-center rounded-lg bg-surface-variant text-xs font-semibold text-on-surface-muted">
                              Pending
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openCell(cell)}
                              title={tier.label}
                              className={cn(
                                'flex h-14 w-full cursor-pointer items-center justify-center rounded-lg text-base font-bold transition-opacity hover:opacity-75',
                                tier.containerClass,
                                tier.textClass,
                              )}
                            >
                              {cell.overallScore}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
            <h2 className="text-base font-bold text-on-surface">Skill gap summary</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Most frequently missing skills across this batch.
            </p>
            <div className="mt-4 space-y-3">
              {skillGap.map((entry) => {
                const maxCount = skillGap[0]?.missingCount ?? 1;
                return (
                  <div key={entry.skillName}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-on-surface">{entry.skillName}</span>
                      <span className="text-on-surface-muted">{entry.missingCount} candidates</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                      <div
                        className="h-full rounded-full bg-error"
                        style={{ width: `${(entry.missingCount / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedCell ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCell(null)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-surface-lowest p-6 shadow-panel"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-on-surface-muted">
                    {selectedCell.candidateLabel} · {selectedCell.jdLabel}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-on-surface">
                    {selectedCell.overallScore}
                  </p>
                  <p className="mt-1 text-sm text-on-surface-variant">{selectedCell.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCell(null)}
                  className="cursor-pointer rounded-full p-1.5 text-on-surface-muted transition-colors hover:bg-surface-variant hover:text-on-surface"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-bold text-on-surface">Score breakdown</h3>
                {selectedCell.criteria.map((criterion) => (
                  <div key={criterion.criterion}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-on-surface">
                        {CRITERION_LABELS[criterion.criterion]}
                      </span>
                      <span className="text-on-surface-muted">
                        {Math.round(criterion.scoreNormalized * 100)}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${criterion.scoreNormalized * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-on-surface">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedCell.skills.map((skill) => (
                    <span
                      key={skill.skillName}
                      title={`${skill.importance} importance${skill.evidence ? ` — ${skill.evidence}` : ''}`}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        skill.type === 'MATCHED'
                          ? 'bg-success-container text-success'
                          : skill.type === 'MISSING'
                            ? 'bg-error-container text-error'
                            : 'bg-warning-container text-on-surface',
                      )}
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-on-surface">Suggested interview questions</h3>

                {!questionsRevealed ? (
                  <Button
                    variant="secondary"
                    className="mt-3 w-auto gap-2 px-4"
                    isLoading={isGeneratingQuestions}
                    onClick={handleGenerateQuestions}
                  >
                    {isGeneratingQuestions ? (
                      <LoaderCircleIcon className="size-4 animate-spin" />
                    ) : (
                      <SparklesIcon className="size-4" />
                    )}
                    {isGeneratingQuestions ? 'Generating...' : 'Generate interview questions'}
                  </Button>
                ) : (
                  <ol className="mt-2 space-y-3">
                    {selectedCell.interviewQuestions.map((item) => (
                      <li key={item.displayOrder} className="text-sm text-on-surface-variant">
                        <div className="flex gap-2">
                          <span className="font-semibold text-on-surface-muted">{item.displayOrder}.</span>
                          <div>
                            <p className="text-on-surface">{item.question}</p>
                            <p className="mt-0.5 text-xs text-on-surface-muted">
                              {item.category} · {item.difficulty}
                              {item.linkedSkill ? ` · Related to ${item.linkedSkill}` : ''}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <Button className="mt-6 gap-2" onClick={handlePromote}>
                <UserPlusIcon className="size-4" />
                Promote to pipeline
              </Button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
