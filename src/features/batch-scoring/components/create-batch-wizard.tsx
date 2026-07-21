'use client';

import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { BatchInputTabs, type InputMode } from '@/components/batch-input/batch-input-tabs';
import { CvStructuredForm } from '@/components/batch-input/cv-structured-form';
import { JdStructuredForm } from '@/components/batch-input/jd-structured-form';
import { MultiStructuredForm } from '@/components/batch-input/multi-structured-form';
import {
  EMPTY_JD_STRUCTURED,
  EMPTY_RESUME_STRUCTURED,
  type JobDescriptionStructuredValues,
  type ResumeStructuredValues,
} from '@/components/batch-input/structured-input.type';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { cn } from '@/lib/utils/cn';

const MAX_CVS = 2000;
const MAX_JDS = 50;

const MOCK_EVALUATION_CONFIGS = [
  { id: 'default', name: 'Organization default' },
  { id: 'senior-eng', name: 'Senior Engineering (weighted)' },
  { id: 'design', name: 'Design roles' },
];

const STEPS = [
  { step: 1, label: 'Add resumes' },
  { step: 2, label: 'Add job descriptions' },
  { step: 3, label: 'Review & submit' },
];

export function CreateBatchWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const [cvMode, setCvMode] = useState<InputMode>('upload');
  const [cvFiles, setCvFiles] = useState<string[]>([]);
  const [cvTexts, setCvTexts] = useState<string[]>(['']);
  const [cvStructuredList, setCvStructuredList] = useState<ResumeStructuredValues[]>([
    EMPTY_RESUME_STRUCTURED,
  ]);

  const [jdMode, setJdMode] = useState<InputMode>('paste');
  const [jdFiles, setJdFiles] = useState<string[]>([]);
  const [jdTexts, setJdTexts] = useState<string[]>(['']);
  const [jdStructuredList, setJdStructuredList] = useState<JobDescriptionStructuredValues[]>([
    EMPTY_JD_STRUCTURED,
  ]);

  const [evaluationConfigId, setEvaluationConfigId] = useState('default');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [notifyWebhookUrl, setNotifyWebhookUrl] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cvCount =
    cvMode === 'upload'
      ? cvFiles.length
      : cvMode === 'paste'
        ? cvTexts.filter((t) => t.trim()).length
        : cvStructuredList.filter((entry) => entry.personal.fullName.trim()).length;

  const jdCount =
    jdMode === 'upload'
      ? jdFiles.length
      : jdMode === 'paste'
        ? jdTexts.filter((t) => t.trim()).length
        : jdStructuredList.filter((entry) => entry.title.trim()).length;

  const totalPairs = cvCount * jdCount;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`${ROUTES.BATCH_SCORING}/batch-3`);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">New scoring batch</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Score many candidates against many job descriptions in one run.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {STEPS.map((item, index) => (
          <div key={item.step} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  currentStep === item.step
                    ? 'bg-primary text-on-primary'
                    : currentStep > item.step
                      ? 'bg-success-container text-success'
                      : 'bg-surface-variant text-on-surface-muted',
                )}
              >
                {currentStep > item.step ? <CheckIcon className="size-4" /> : item.step}
              </span>
              <span
                className={cn(
                  'hidden text-sm font-semibold sm:inline',
                  currentStep === item.step ? 'text-on-surface' : 'text-on-surface-muted',
                )}
              >
                {item.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? <div className="h-px flex-1 bg-outline" /> : null}
          </div>
        ))}
      </div>

      {currentStep === 1 ? (
        <BatchInputTabs
          title="Add resumes"
          maxCount={MAX_CVS}
          count={cvCount}
          mode={cvMode}
          onModeChange={setCvMode}
          files={cvFiles}
          onFilesChange={setCvFiles}
          texts={cvTexts}
          onTextsChange={setCvTexts}
          pastePlaceholder="Paste resume text here..."
          structuredForm={
            <MultiStructuredForm
              entryLabel="Candidate"
              items={cvStructuredList}
              emptyItem={EMPTY_RESUME_STRUCTURED}
              maxCount={MAX_CVS}
              onChange={setCvStructuredList}
              renderForm={(value, onChange) => (
                <CvStructuredForm value={value} onChange={onChange} />
              )}
            />
          }
        />
      ) : null}

      {currentStep === 2 ? (
        <BatchInputTabs
          title="Add job descriptions"
          maxCount={MAX_JDS}
          count={jdCount}
          mode={jdMode}
          onModeChange={setJdMode}
          files={jdFiles}
          onFilesChange={setJdFiles}
          texts={jdTexts}
          onTextsChange={setJdTexts}
          pastePlaceholder="Paste job description text here..."
          structuredForm={
            <MultiStructuredForm
              entryLabel="Job description"
              items={jdStructuredList}
              emptyItem={EMPTY_JD_STRUCTURED}
              maxCount={MAX_JDS}
              onChange={setJdStructuredList}
              renderForm={(value, onChange) => (
                <JdStructuredForm value={value} onChange={onChange} />
              )}
            />
          }
        />
      ) : null}

      {currentStep === 3 ? (
        <div className="space-y-5 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-outline bg-surface-variant p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                Resumes
              </p>
              <p className="mt-1 text-2xl font-bold text-on-surface">{cvCount}</p>
            </div>
            <div className="rounded-lg border border-outline bg-surface-variant p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                Job descriptions
              </p>
              <p className="mt-1 text-2xl font-bold text-on-surface">{jdCount}</p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Evaluation config
            </label>
            <select
              value={evaluationConfigId}
              onChange={(e) => setEvaluationConfigId(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              {MOCK_EVALUATION_CONFIGS.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="cursor-pointer text-sm font-semibold text-primary hover:underline"
            >
              {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
            </button>

            {showAdvanced ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    Notify webhook URL
                  </label>
                  <input
                    value={notifyWebhookUrl}
                    onChange={(e) => setNotifyWebhookUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-11 w-full rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    Notify email
                  </label>
                  <input
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-11 w-full rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <p className="text-xs text-on-surface-variant">
            Large batches can take a while to finish parsing and scoring. You&apos;ll be notified
            when it&apos;s ready.
          </p>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          className="w-auto px-5"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
        >
          Back
        </Button>

        {currentStep < 3 ? (
          <Button
            className="w-auto px-5"
            disabled={currentStep === 1 ? cvCount === 0 : jdCount === 0}
            onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}
          >
            Continue
          </Button>
        ) : (
          <Button
            className="w-auto px-5"
            disabled={totalPairs === 0}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Starting...' : `Start scoring ${totalPairs} pairs`}
          </Button>
        )}
      </div>
    </div>
  );
}
