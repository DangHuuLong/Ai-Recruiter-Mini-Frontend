'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, LoaderCircleIcon, XIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { AnimatedGlowBackground } from '@/components/decorative/animated-glow-background';
import { LoadingState } from '@/components/feedback';
import { ROUTES } from '@/config/routes.config';
import { CRITERION_LABELS, getScoreTier, type CriterionName } from '@/features/batch-scoring/types/batch-scoring.type';
import { getPublicBatch } from '@/features/public-batches/api/public-batch.api';
import type { PublicBatchSnapshot, PublicResult } from '@/features/public-batches/types/public-batch.type';
import { cn } from '@/lib/utils/cn';

const IN_PROGRESS_STATUSES = new Set(['PENDING', 'PARSING', 'SCORING']);
const POLL_INTERVAL_MS = 3000;

const SKILL_TYPE_CLASSES: Record<string, string> = {
  MATCHED: 'bg-success-container text-success',
  MISSING: 'bg-error-container text-error',
  PARTIAL: 'bg-warning-container text-on-surface',
};

type PublicBatchResultsProps = {
  batchId: string;
};

export function PublicBatchResults({ batchId }: PublicBatchResultsProps) {
  const t = useTranslations('publicBatchResults');
  const [snapshot, setSnapshot] = useState<PublicBatchSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<
    (PublicResult & { candidateLabel: string; jdLabel: string }) | null
  >(null);

  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async () => {
    try {
      setErrorMessage(null);
      const result = await getPublicBatch(batchId);
      setSnapshot(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('notFoundFallback'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  useEffect(() => {
    if (!snapshot || !IN_PROGRESS_STATUSES.has(snapshot.status)) {
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
  }, [snapshot?.status]);

  const openCell = (result: PublicResult) => {
    if (result.status !== 'COMPLETED' || result.overallScore == null || !snapshot) return;

    const resumeItem = snapshot.resumeItems.find((r) => r.id === result.resumeItemId);
    const jdItem = snapshot.jdItems.find((j) => j.id === result.jdItemId);

    setSelectedCell({
      ...result,
      candidateLabel: resumeItem?.candidateLabel ?? t('candidateFallback'),
      jdLabel: jdItem?.label ?? t('jobDescriptionFallback'),
    });
  };

  if (isLoading) {
    return <LoadingState title={t('loadingTitle')} description={t('loadingDescription')} />;
  }

  if (errorMessage || !snapshot) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)]">
        <AnimatedGlowBackground />
        <div className="relative mx-auto max-w-md px-4 py-20 text-center">
          <p className="text-sm font-semibold text-on-surface">{errorMessage ?? t('batchNotFound')}</p>
          <Link
            href={ROUTES.PUBLIC_TRY}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeftIcon className="size-4" />
            {t('tryAgain')}
          </Link>
        </div>
      </div>
    );
  }

  const isInProgress = IN_PROGRESS_STATUSES.has(snapshot.status);

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <AnimatedGlowBackground />

      <div className="relative mx-auto max-w-6xl px-4 py-10 pb-28 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.PUBLIC_TRY}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
        >
          <ArrowLeftIcon className="size-4" />
          {t('back')}
        </Link>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">{t('eyebrow')}</p>
          <h1 className="mt-1 text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {isInProgress ? t('scoringInProgress') : t('clickToSeeBreakdown')}
          </p>
        </div>

        {isInProgress ? (
          <div className="rounded-2xl border border-outline bg-surface-lowest/95 p-8 text-center shadow-card backdrop-blur-sm">
            <LoaderCircleIcon className="mx-auto size-8 animate-spin text-primary" />
            <p className="mt-4 text-sm font-semibold text-on-surface">
              {t('pairsScored', {
                completed: snapshot.progress.completedPairCount,
                total: snapshot.progress.totalPairCount,
              })}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold text-on-surface-variant">
              {(
                [
                  ['excellent', 90],
                  ['strong', 75],
                  ['moderate', 60],
                  ['weak', 45],
                  ['poor', 20],
                ] as const
              ).map(([key, score]) => {
                const tier = getScoreTier(score);
                return (
                  <span key={key} className="flex items-center gap-1.5">
                    <span className={cn('size-3 rounded-full', tier.containerClass)} />
                    {t(`scoreTiers.${key}`)}
                  </span>
                );
              })}
            </div>

            <div className="no-scrollbar overflow-x-auto rounded-2xl border border-outline bg-surface-lowest/95 shadow-card backdrop-blur-sm">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 border-b border-r border-outline bg-surface-variant p-3 text-left font-semibold text-on-surface-variant">
                      {t('candidateColumn')}
                    </th>
                    {snapshot.jdItems.map((jd) => (
                      <th
                        key={jd.id}
                        className="border-b border-outline bg-surface-variant p-3 text-left font-semibold text-on-surface-variant"
                      >
                        {jd.label ?? t('jobDescriptionFallback')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {snapshot.resumeItems.map((resume) => (
                    <tr key={resume.id}>
                      <td className="sticky left-0 z-10 border-r border-outline bg-surface-lowest p-3 font-semibold text-on-surface">
                        {resume.candidateLabel ?? t('candidateFallback')}
                      </td>
                      {snapshot.jdItems.map((jd) => {
                        const result = snapshot.results.find(
                          (r) => r.resumeItemId === resume.id && r.jdItemId === jd.id,
                        );
                        const tier = result?.overallScore != null ? getScoreTier(result.overallScore) : null;

                        return (
                          <td key={jd.id} className="border-b border-outline p-2">
                            {!result || result.status === 'FAILED' ? (
                              <div
                                title={result?.error ?? t('failed')}
                                className="flex h-14 w-full items-center justify-center rounded-lg bg-error-container text-xs font-semibold text-error"
                              >
                                {t('failed')}
                              </div>
                            ) : result.status === 'PENDING' || !tier ? (
                              <div className="flex h-14 w-full items-center justify-center rounded-lg bg-surface-variant text-xs font-semibold text-on-surface-muted">
                                {t('pending')}
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openCell(result)}
                                title={tier.label}
                                className={cn(
                                  'flex h-14 w-full cursor-pointer items-center justify-center rounded-lg text-base font-bold transition-opacity hover:opacity-75',
                                  tier.containerClass,
                                  tier.textClass,
                                )}
                              >
                                {Math.round(result.overallScore ?? 0)}
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
          </>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-outline bg-surface-variant/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-on-surface">{t('signupBanner')}</p>
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            {t('createOrg')}
          </Link>
        </div>
      </div>

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
                    {t('matchScore', { tier: getScoreTier(selectedCell.overallScore ?? 0).label })}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-on-surface">
                    {selectedCell.overallScore != null ? Math.round(selectedCell.overallScore) : '—'}
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
                <h3 className="text-sm font-bold text-on-surface">{t('scoreBreakdown')}</h3>
                {(selectedCell.criteria ?? []).map((criterion) => (
                  <div key={criterion.criterion}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-on-surface">
                        {CRITERION_LABELS[criterion.criterion as CriterionName] ?? criterion.criterion}
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
                <h3 className="text-sm font-bold text-on-surface">{t('skills')}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(selectedCell.skills ?? []).map((skill) => (
                    <span
                      key={skill.skillName}
                      title={`${t('importance', { level: skill.importance })}${skill.evidence ? ` — ${skill.evidence}` : ''}`}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        SKILL_TYPE_CLASSES[skill.type],
                      )}
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>

              {(selectedCell.interviewQuestions ?? []).length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-on-surface">{t('suggestedQuestions')}</h3>
                  <ol className="mt-2 space-y-3">
                    {(selectedCell.interviewQuestions ?? []).map((item) => (
                      <li key={item.displayOrder} className="text-sm text-on-surface-variant">
                        <div className="flex gap-2">
                          <span className="font-semibold text-on-surface-muted">{item.displayOrder}.</span>
                          <div>
                            <p className="text-on-surface">{item.question}</p>
                            <p className="mt-0.5 text-xs text-on-surface-muted">
                              {item.category} · {item.difficulty}
                              {item.linkedSkill ? ` ${t('relatedTo', { skill: item.linkedSkill })}` : ''}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
