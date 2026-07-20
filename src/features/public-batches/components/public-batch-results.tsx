'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, LoaderCircleIcon, SparklesIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { AnimatedGlowBackground } from '@/components/decorative/animated-glow-background';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import {
  CRITERION_LABELS,
  getMockCell,
  getScoreTier,
  MOCK_JOB_DESCRIPTIONS,
  MOCK_RESUMES,
  type MockCell,
} from '@/features/public-batches/mock/public-batch-mock-data';
import { cn } from '@/lib/utils/cn';

const SKILL_TYPE_CLASSES: Record<string, string> = {
  MATCHED: 'bg-success-container text-success',
  MISSING: 'bg-error-container text-error',
  RELATED: 'bg-warning-container text-on-surface',
};

export function PublicBatchResults() {
  const [selectedCell, setSelectedCell] = useState<MockCell | null>(null);
  const [questionsRevealed, setQuestionsRevealed] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const openCell = (cell: MockCell) => {
    setSelectedCell(cell);
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

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <AnimatedGlowBackground />

      <div className="relative mx-auto max-w-6xl px-4 py-10 pb-28 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.PUBLIC_TRY}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Link>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Your results</p>
          <h1 className="mt-1 text-2xl font-bold text-on-surface">CV × Job Description matches</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Click any cell to see the full score breakdown.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold text-on-surface-variant">
          {(['Excellent', 'Strong', 'Moderate', 'Weak', 'Poor'] as const).map((label) => {
            const tier = getScoreTier(
              label === 'Excellent' ? 90 : label === 'Strong' ? 75 : label === 'Moderate' ? 60 : label === 'Weak' ? 45 : 20,
            );
            return (
              <span key={label} className="flex items-center gap-1.5">
                <span className={cn('size-3 rounded-full', tier.containerClass)} />
                {label}
              </span>
            );
          })}
        </div>

        <div className="no-scrollbar overflow-x-auto rounded-2xl border border-outline bg-surface-lowest/95 shadow-card backdrop-blur-sm">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-r border-outline bg-surface-variant p-3 text-left font-semibold text-on-surface-variant">
                  Candidate
                </th>
                {MOCK_JOB_DESCRIPTIONS.map((jd) => (
                  <th
                    key={jd.id}
                    className="border-b border-outline bg-surface-variant p-3 text-left font-semibold text-on-surface-variant"
                  >
                    {jd.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_RESUMES.map((resume) => (
                <tr key={resume.id}>
                  <td className="sticky left-0 z-10 border-r border-outline bg-surface-lowest p-3 font-semibold text-on-surface">
                    {resume.name}
                  </td>
                  {MOCK_JOB_DESCRIPTIONS.map((jd) => {
                    const cell = getMockCell(resume.id, jd.id);
                    const tier = getScoreTier(cell.overallScore);
                    return (
                      <td key={jd.id} className="border-b border-outline p-2">
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
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-outline bg-surface-variant/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-on-surface">
            Sign up to save these results and unlock full batch scoring
          </p>
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            Create an organization
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
                    Match score · {getScoreTier(selectedCell.overallScore).label}
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
                        SKILL_TYPE_CLASSES[skill.type],
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
                    className="mt-3 gap-2"
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
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
