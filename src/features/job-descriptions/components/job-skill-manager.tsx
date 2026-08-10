'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { showToast } from '@/components/feedback';
import {
  createJobSkill,
  deleteJobSkill,
  updateJobSkill,
} from '@/features/job-descriptions/api/job-description.api';
import type {
  CreateJobSkillPayload,
  JobSkill,
} from '@/features/job-descriptions/types/job-description.type';
import {
  initialJobSkillFormValues,
  jobSkillSchema,
  type JobSkillFormValues,
} from '@/features/job-descriptions/validations/job-description.validation';

type JobSkillManagerProps = {
  jobDescriptionId: string;
  skills: JobSkill[];
  onSkillsChange: (skills: JobSkill[]) => void;
};

type SkillFormErrors = Partial<Record<keyof JobSkillFormValues, string>>;

export function JobSkillManager({ jobDescriptionId, skills, onSkillsChange }: JobSkillManagerProps) {
  const t = useTranslations('jobDescriptions.skillManager');
  const [formValues, setFormValues] = useState<JobSkillFormValues>(initialJobSkillFormValues);
  const [errors, setErrors] = useState<SkillFormErrors>({});
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  const updateField = (field: keyof JobSkillFormValues, value: string | boolean | number) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const resetForm = () => {
    setFormValues(initialJobSkillFormValues);
    setErrors({});
    setEditingSkillId(null);
  };

  const startEditing = (skill: JobSkill) => {
    setEditingSkillId(skill.id);
    setErrors({});
    setFormValues({
      name: skill.name,
      normalizedName: skill.normalizedName ?? '',
      type: skill.type,
      isCore: skill.isCore,
      weightHint: skill.weightHint ?? (skill.type === 'REQUIRED' ? 1 : 0.6),
    });
  };

  const handleSubmit = async () => {
    setErrors({});
    const validation = jobSkillSchema.safeParse(formValues);

    if (!validation.success) {
      const nextErrors: SkillFormErrors = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof JobSkillFormValues | undefined;
        if (field) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      showToast.error(t('invalidTitle'), {
        description: validation.error.issues[0]?.message ?? t('invalidFallback'),
      });
      return;
    }

    const payload: CreateJobSkillPayload = validation.data;

    try {
      setIsSubmitting(true);
      if (editingSkillId) {
        const updatedSkill = await updateJobSkill(editingSkillId, payload);
        onSkillsChange(skills.map((skill) => (skill.id === updatedSkill.id ? updatedSkill : skill)));
        showToast.success(t('updateSuccessTitle'));
      } else {
        const createdSkill = await createJobSkill(jobDescriptionId, payload);
        onSkillsChange([...skills, createdSkill]);
        showToast.success(t('addSuccessTitle'));
      }
      resetForm();
    } catch (error) {
      showToast.error(editingSkillId ? t('updateFailedTitle') : t('addFailedTitle'), {
        description: error instanceof Error ? error.message : t('genericFailedFallback'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (skill: JobSkill) => {
    const shouldDelete = window.confirm(t('deleteConfirm', { name: skill.name }));
    if (!shouldDelete) return;

    try {
      setDeletingSkillId(skill.id);
      await deleteJobSkill(skill.id);
      onSkillsChange(skills.filter((item) => item.id !== skill.id));
      if (editingSkillId === skill.id) resetForm();
      showToast.success(t('deleteSuccessTitle'));
    } catch (error) {
      showToast.error(t('deleteFailedTitle'), {
        description: error instanceof Error ? error.message : t('genericFailedFallback'),
      });
    } finally {
      setDeletingSkillId(null);
    }
  };

  const requiredSkills = skills.filter((skill) => skill.type === 'REQUIRED');
  const preferredSkills = skills.filter((skill) => skill.type === 'PREFERRED');

  return (
    <section className="space-y-5 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">{t('title')}</h2>
        <p className="mt-1 text-sm text-on-surface-muted">{t('description')}</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="rounded-2xl border border-outline bg-surface-variant p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label htmlFor="skillName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{t('skillNameLabel')}</label>
            <input id="skillName" value={formValues.name} onChange={(event) => updateField('name', event.target.value)} disabled={isSubmitting} placeholder="NestJS" className="h-10 w-full rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30" />
            {errors.name ? <p className="mt-1.5 text-xs font-medium text-error">{errors.name}</p> : null}
          </div>
          <div>
            <label htmlFor="normalizedName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{t('normalizedNameLabel')}</label>
            <input id="normalizedName" value={formValues.normalizedName ?? ''} onChange={(event) => updateField('normalizedName', event.target.value)} disabled={isSubmitting} placeholder="nestjs" className="h-10 w-full rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30" />
            {errors.normalizedName ? <p className="mt-1.5 text-xs font-medium text-error">{errors.normalizedName}</p> : null}
          </div>
          <div>
            <label htmlFor="skillType" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{t('typeLabel')}</label>
            <select id="skillType" value={formValues.type} onChange={(event) => updateField('type', event.target.value)} disabled={isSubmitting} className="h-10 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30">
              <option value="REQUIRED">{t('typeRequired')}</option>
              <option value="PREFERRED">{t('typePreferred')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="weightHint" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{t('weightLabel')}</label>
            <input id="weightHint" type="number" step="0.1" min="0" max="1" value={formValues.weightHint as number} onChange={(event) => updateField('weightHint', Number(event.target.value))} disabled={isSubmitting} className="h-10 w-full rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30" />
            {errors.weightHint ? <p className="mt-1.5 text-xs font-medium text-error">{errors.weightHint}</p> : null}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-on-surface-variant">
            <input type="checkbox" checked={formValues.isCore} onChange={(event) => updateField('isCore', event.target.checked)} disabled={isSubmitting} className="h-4 w-4 rounded border-outline text-primary" />
            {t('markAsCore')}
          </label>
          <div className="flex gap-2">
            {editingSkillId ? <button type="button" onClick={resetForm} disabled={isSubmitting} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-outline px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-lowest">{t('cancelEdit')}</button> : null}
            <button type="submit" disabled={isSubmitting} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled">
              {isSubmitting ? t('saving') : editingSkillId ? t('updateSkill') : t('addSkill')}
            </button>
          </div>
        </div>
      </form>

      <SkillGroup title={t('requiredSkills')} skills={requiredSkills} onEdit={startEditing} onDelete={handleDelete} deletingSkillId={deletingSkillId} />
      <SkillGroup title={t('preferredSkills')} skills={preferredSkills} onEdit={startEditing} onDelete={handleDelete} deletingSkillId={deletingSkillId} />
    </section>
  );
}

type SkillGroupProps = {
  title: string;
  skills: JobSkill[];
  deletingSkillId: string | null;
  onEdit: (skill: JobSkill) => void;
  onDelete: (skill: JobSkill) => void;
};

function SkillGroup({ title, skills, deletingSkillId, onEdit, onDelete }: SkillGroupProps) {
  const t = useTranslations('jobDescriptions.skillManager');

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-on-surface-muted">{title}</h3>
      {skills.length > 0 ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {skills.map((skill) => (
            <div key={skill.id} className="rounded-xl border border-outline bg-surface-lowest p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{skill.name}</p>
                  <p className="mt-1 text-xs text-on-surface-muted">{skill.normalizedName || t('notNormalized')}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${skill.type === 'REQUIRED' ? 'bg-error-container text-error' : 'bg-warning-container text-on-surface'}`}>{skill.type}</span>
                  {skill.isCore ? <span className="rounded-full bg-primary-container px-2 py-1 text-[11px] font-semibold text-on-primary-container">CORE</span> : null}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-outline pt-3">
                <p className="text-xs text-on-surface-muted">{t('weightLabelShort', { weight: skill.weightHint ?? t('weightNa') })}</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => onEdit(skill)} className="cursor-pointer text-xs font-semibold text-primary hover:underline">{t('editAction')}</button>
                  <button type="button" onClick={() => onDelete(skill)} disabled={deletingSkillId === skill.id} className="cursor-pointer text-xs font-semibold text-error hover:underline disabled:cursor-not-allowed disabled:text-disabled">
                    {deletingSkillId === skill.id ? t('deletingAction') : t('deleteAction')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-on-surface-muted">{t('noneYet', { group: title.toLowerCase() })}</p>
      )}
    </div>
  );
}
