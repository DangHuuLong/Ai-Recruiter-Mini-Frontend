'use client';

import { ArrowLeftIcon, PlusIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes.config';
import {
  CRITERION_LABELS,
  CRITERION_OPTIONS,
  getMockEvaluationConfig,
  type CriterionDefinition,
  type CriterionName,
  type MockEvaluationConfig,
} from '@/features/evaluation-configs/mock/evaluation-config-mock-data';
import { cn } from '@/lib/utils/cn';

const WEIGHT_TOLERANCE = 0.001;

type EvaluationConfigFormProps = {
  configId?: string;
};

function toFormCriteria(config: MockEvaluationConfig | null): CriterionDefinition[] {
  if (config) return config.criteriaDefinition;
  return [
    { criterion: 'SKILLS_MATCH', weight: 0.4 },
    { criterion: 'EXPERIENCE_RELEVANCE', weight: 0.3 },
    { criterion: 'PROJECT_RELEVANCE', weight: 0.15 },
    { criterion: 'EDUCATION_CERTIFICATION', weight: 0.1 },
    { criterion: 'KEYWORD_DOMAIN_ALIGNMENT', weight: 0.05 },
  ];
}

export function EvaluationConfigForm({ configId }: EvaluationConfigFormProps) {
  const router = useRouter();
  const existing = configId ? getMockEvaluationConfig(configId) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [isDefault, setIsDefault] = useState(existing?.isDefault ?? false);
  const [criteria, setCriteria] = useState<CriterionDefinition[]>(toFormCriteria(existing));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalWeight = criteria.reduce((sum, item) => sum + item.weight, 0);
  const isWeightValid = Math.abs(totalWeight - 1) <= WEIGHT_TOLERANCE;

  const usedCriteria = new Set(criteria.map((item) => item.criterion));
  const duplicateCriteria = criteria.length !== usedCriteria.size;

  const availableToAdd = CRITERION_OPTIONS.filter((option) => !usedCriteria.has(option));

  const updateCriterion = (index: number, patch: Partial<CriterionDefinition>) => {
    setCriteria((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeCriterion = (index: number) => {
    setCriteria((current) => current.filter((_, i) => i !== index));
  };

  const addCriterion = () => {
    const next = availableToAdd[0];
    if (!next) return;
    setCriteria((current) => [...current, { criterion: next, weight: 0 }]);
  };

  const isValid = name.trim().length > 0 && criteria.length > 0 && isWeightValid && !duplicateCriteria;

  const handleSubmit = () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      showToast.success(existing ? 'Config updated' : 'Config created', { description: name });
      router.push(ROUTES.EVALUATION_CONFIGS);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={ROUTES.EVALUATION_CONFIGS}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
      >
        <ArrowLeftIcon className="size-4" />
        Back to configs
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-on-surface">
          {existing ? 'Edit config' : 'New evaluation config'}
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Define how much each criterion counts toward the overall match score.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <Input label="Config name" value={name} onChange={(e) => setName(e.target.value)} />

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-outline bg-surface-lowest p-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="size-4 cursor-pointer rounded border-outline text-primary"
          />
          Set as default for this scope
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface">Criteria weights</h2>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-bold',
                isWeightValid
                  ? 'bg-success-container text-success'
                  : 'bg-error-container text-error',
              )}
            >
              Total: {Math.round(totalWeight * 100)}%
            </span>
          </div>

          <div className="space-y-3">
            {criteria.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <select
                  value={item.criterion}
                  onChange={(e) =>
                    updateCriterion(index, { criterion: e.target.value as CriterionName })
                  }
                  className="h-11 flex-1 cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                >
                  {CRITERION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {CRITERION_LABELS[option]}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={item.weight}
                  onChange={(e) => updateCriterion(index, { weight: Number(e.target.value) })}
                  className="h-11 w-24 rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                />
                <button
                  type="button"
                  onClick={() => removeCriterion(index)}
                  disabled={criteria.length <= 1}
                  className="cursor-pointer rounded-full p-1.5 text-on-surface-muted transition-colors hover:bg-error-container hover:text-error disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {duplicateCriteria ? (
            <p className="mt-2 text-xs font-semibold text-error">
              Each criterion can only be used once.
            </p>
          ) : !isWeightValid ? (
            <p className="mt-2 text-xs font-semibold text-error">
              Weights must add up to 100% (currently {Math.round(totalWeight * 100)}%).
            </p>
          ) : null}

          {availableToAdd.length > 0 ? (
            <button
              type="button"
              onClick={addCriterion}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-container hover:text-on-primary-container hover:underline"
            >
              <PlusIcon className="size-4" />
              Add criterion
            </button>
          ) : null}
        </div>
      </div>

      <Button disabled={!isValid} isLoading={isSubmitting} onClick={handleSubmit}>
        {isSubmitting ? 'Saving...' : existing ? 'Save changes' : 'Create config'}
      </Button>
    </div>
  );
}
