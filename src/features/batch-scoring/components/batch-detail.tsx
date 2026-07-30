'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  DownloadIcon,
  LoaderCircleIcon,
  UserPlusIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { LoadingState, showToast } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import {
  cancelScoringBatch,
  downloadScoringBatchCsv,
  getScoringBatchCell,
  getScoringBatchMatrix,
  getScoringBatchStatus,
  getSkillGapSummary,
  promoteScoringBatchItems,
} from '@/features/batch-scoring/api/batch-scoring.api';
import {
  CRITERION_LABELS,
  STATUS_CLASSES,
  STATUS_LABELS,
  getScoreTier,
  type BatchMatrix,
  type BatchStatusResult,
  type CellDetail,
  type MatrixCell,
  type SkillGapEntry,
} from '@/features/batch-scoring/types/batch-scoring.type';
import { ApiError } from '@/lib/api/api-error';
import { cn } from '@/lib/utils/cn';

const IN_PROGRESS_STATUSES = new Set(['PENDING', 'PARSING', 'SCORING']);
const POLL_INTERVAL_MS = 3000;

type BatchDetailProps = {
  batchId: string;
};

export function BatchDetail({ batchId }: BatchDetailProps) {
  const [status, setStatus] = useState<BatchStatusResult | null>(null);
  const [matrix, setMatrix] = useState<BatchMatrix | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [selectedCell, setSelectedCell] = useState<
    (CellDetail & { candidateLabel: string; jdLabel: string }) | null
  >(null);
  const [isLoadingCell, setIsLoadingCell] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMatrixAndSkillGap = async () => {
    const [matrixResult, skillGapResult] = await Promise.all([
      getScoringBatchMatrix(batchId, { limit: 100 }),
      getSkillGapSummary(batchId).catch(() => ({ missingSkills: [] as SkillGapEntry[] })),
    ]);
    setMatrix(matrixResult);
    setSkillGap('missingSkills' in skillGapResult ? skillGapResult.missingSkills : []);
  };

  const load = async () => {
    try {
      setErrorMessage(null);
      const statusResult = await getScoringBatchStatus(batchId);
      setStatus(statusResult);

      if (!IN_PROGRESS_STATUSES.has(statusResult.status)) {
        await loadMatrixAndSkillGap();
      }
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Failed to load this batch');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  useEffect(() => {
    if (!status || !IN_PROGRESS_STATUSES.has(status.status)) {
      if (pollTimer.current) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
      return;
    }

    pollTimer.current = setInterval(() => {
      void load();
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollTimer.current) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.status]);

  const openCell = async (cell: MatrixCell) => {
    if (cell.status !== 'COMPLETED' || cell.overallScore === null || !matrix) return;

    const row = matrix.rows.find((r) => r.resumeItemId === cell.resumeItemId);
    const column = matrix.columns.find((c) => c.jdItemId === cell.jdItemId);

    try {
      setIsLoadingCell(true);
      const detail = await getScoringBatchCell(batchId, cell.resumeItemId, cell.jdItemId);
      setSelectedCell({
        ...detail,
        candidateLabel: row?.candidateName ?? row?.fileName ?? 'Candidate',
        jdLabel: column?.label ?? 'Job description',
      });
    } catch (error) {
      showToast.error('Failed to load cell detail', {
        description: error instanceof ApiError ? error.message : 'Something went wrong.',
      });
    } finally {
      setIsLoadingCell(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      await cancelScoringBatch(batchId);
      showToast.success('Batch cancelled');
      await load();
    } catch (error) {
      showToast.error('Failed to cancel batch', {
        description: error instanceof ApiError ? error.message : 'Something went wrong.',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await downloadScoringBatchCsv(batchId, status?.name ?? null);
    } catch (error) {
      showToast.error('Failed to export CSV', {
        description: error instanceof Error ? error.message : 'Something went wrong.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePromote = async () => {
    if (!selectedCell) return;

    try {
      setIsPromoting(true);
      await promoteScoringBatchItems(batchId, [
        { resumeItemId: selectedCell.resumeItemId, jdItemId: selectedCell.jdItemId },
      ]);
      showToast.success('Promoted to candidate pipeline', {
        description: `${selectedCell.candidateLabel} → ${selectedCell.jdLabel}`,
      });
      setSelectedCell(null);
    } catch (error) {
      showToast.error('Failed to promote', {
        description: error instanceof ApiError ? error.message : 'Something went wrong.',
      });
    } finally {
      setIsPromoting(false);
    }
  };

  if (isLoading) {
    return <LoadingState title="Loading batch..." description="Please wait while the batch is being loaded." />;
  }

  if (errorMessage || !status) {
    return (
      <div className="rounded-2xl border border-outline bg-surface-lowest p-10 text-center shadow-card">
        <p className="text-sm font-semibold text-on-surface">{errorMessage ?? 'Batch not found'}</p>
      </div>
    );
  }

  const isInProgress = IN_PROGRESS_STATUSES.has(status.status);

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
            <h1 className="text-2xl font-bold text-on-surface">{status.name || 'Untitled batch'}</h1>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                STATUS_CLASSES[status.status],
              )}
            >
              {STATUS_LABELS[status.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            {status.progress.totalCvCount} CVs × {status.progress.totalJdCount} JDs · {status.progress.completedPairCount}/
            {status.progress.totalPairCount} pairs scored
          </p>
        </div>

        <div className="flex gap-2">
          {status.status === 'COMPLETED' || status.status === 'COMPLETED_WITH_ERRORS' ? (
            <Button variant="secondary" className="w-auto gap-2 px-4" isLoading={isExporting} onClick={() => void handleExport()}>
              <DownloadIcon className="size-4" />
              Export CSV
            </Button>
          ) : null}
          {isInProgress ? (
            <Button variant="secondary" className="w-auto px-4" isLoading={isCancelling} onClick={() => void handleCancel()}>
              Cancel batch
            </Button>
          ) : null}
        </div>
      </div>

      {isInProgress ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-8 text-center shadow-card">
          <LoaderCircleIcon className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-semibold text-on-surface">
            {STATUS_LABELS[status.status]}...
          </p>
          <div className="mx-auto mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-surface-variant">
            <div className="h-full rounded-full bg-primary" style={{ width: `${status.progress.percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-on-surface-muted">
            {status.progress.completedPairCount} / {status.progress.totalPairCount} pairs · {status.progress.percent}%
          </p>
        </div>
      ) : status.status === 'FAILED' || status.status === 'CANCELLED' ? (
        <div className="rounded-2xl border border-outline bg-surface-lowest p-8 text-center shadow-card">
          <p className="text-sm font-semibold text-on-surface">
            This batch {status.status === 'FAILED' ? 'failed to complete' : 'was cancelled'}.
          </p>
        </div>
      ) : matrix ? (
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
                      key={column.jdItemId}
                      className="border-b border-outline bg-surface-variant p-3 text-left font-semibold text-on-surface-variant"
                    >
                      {column.label ?? 'Job description'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.rows.map((row) => (
                  <tr key={row.resumeItemId}>
                    <td className="sticky left-0 z-10 border-r border-outline bg-surface-lowest p-3 font-semibold text-on-surface">
                      {row.candidateName ?? row.fileName ?? 'Candidate'}
                    </td>
                    {matrix.columns.map((column) => {
                      const cell = matrix.cells.find(
                        (c) => c.resumeItemId === row.resumeItemId && c.jdItemId === column.jdItemId,
                      );
                      if (!cell) return <td key={column.jdItemId} className="border-b border-outline p-2" />;

                      const tier = cell.overallScore !== null ? getScoreTier(cell.overallScore) : null;

                      return (
                        <td key={column.jdItemId} className="border-b border-outline p-2">
                          {cell.status === 'FAILED' ? (
                            <div
                              title={cell.error ?? 'Failed'}
                              className="flex h-14 w-full items-center justify-center rounded-lg bg-error-container text-xs font-semibold text-error"
                            >
                              Failed
                            </div>
                          ) : cell.status === 'PENDING' || cell.status === 'PROCESSING' || !tier ? (
                            <div className="flex h-14 w-full items-center justify-center rounded-lg bg-surface-variant text-xs font-semibold text-on-surface-muted">
                              Pending
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => void openCell(cell)}
                              disabled={isLoadingCell}
                              title={tier.label}
                              className={cn(
                                'flex h-14 w-full cursor-pointer items-center justify-center rounded-lg text-base font-bold transition-opacity hover:opacity-75 disabled:cursor-wait',
                                tier.containerClass,
                                tier.textClass,
                              )}
                            >
                              {Math.round(cell.overallScore ?? 0)}
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

          {skillGap.length > 0 ? (
            <div className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
              <h2 className="text-base font-bold text-on-surface">Skill gap summary</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Most frequently missing skills across this batch.
              </p>
              <div className="mt-4 space-y-3">
                {skillGap.slice(0, 10).map((entry) => {
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
          ) : null}
        </>
      ) : null}

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
                    {selectedCell.overallScore !== null ? Math.round(selectedCell.overallScore) : '—'}
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
                {(selectedCell.criteria ?? []).map((criterion) => (
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
                  {(selectedCell.skills ?? []).map((skill) => (
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

              {(selectedCell.interviewQuestions ?? []).length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-on-surface">Suggested interview questions</h3>
                  <ol className="mt-2 space-y-3">
                    {(selectedCell.interviewQuestions ?? []).map((item) => (
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
                </div>
              ) : null}

              <Button className="mt-6 gap-2" isLoading={isPromoting} onClick={() => void handlePromote()}>
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
