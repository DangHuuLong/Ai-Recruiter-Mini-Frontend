'use client';

import { useState } from 'react';

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
      showToast.error('Invalid skill information', {
        description: validation.error.issues[0]?.message ?? 'Please check the skill form.',
      });
      return;
    }

    const payload: CreateJobSkillPayload = validation.data;

    try {
      setIsSubmitting(true);
      if (editingSkillId) {
        const updatedSkill = await updateJobSkill(editingSkillId, payload);
        onSkillsChange(skills.map((skill) => (skill.id === updatedSkill.id ? updatedSkill : skill)));
        showToast.success('Job skill updated successfully');
      } else {
        const createdSkill = await createJobSkill(jobDescriptionId, payload);
        onSkillsChange([...skills, createdSkill]);
        showToast.success('Job skill added successfully');
      }
      resetForm();
    } catch (error) {
      showToast.error(editingSkillId ? 'Failed to update job skill' : 'Failed to add job skill', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (skill: JobSkill) => {
    const shouldDelete = window.confirm(`Delete skill "${skill.name}"?`);
    if (!shouldDelete) return;

    try {
      setDeletingSkillId(skill.id);
      await deleteJobSkill(skill.id);
      onSkillsChange(skills.filter((item) => item.id !== skill.id));
      if (editingSkillId === skill.id) resetForm();
      showToast.success('Job skill deleted successfully');
    } catch (error) {
      showToast.error('Failed to delete job skill', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setDeletingSkillId(null);
    }
  };

  const requiredSkills = skills.filter((skill) => skill.type === 'REQUIRED');
  const preferredSkills = skills.filter((skill) => skill.type === 'PREFERRED');

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Job Skills</h2>
        <p className="mt-1 text-sm text-slate-500">Review parsed skills or manage skills manually for matching and scoring.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label htmlFor="skillName" className="mb-1 block text-sm font-medium text-slate-800">Skill name</label>
            <input id="skillName" value={formValues.name} onChange={(event) => updateField('name', event.target.value)} disabled={isSubmitting} placeholder="NestJS" className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
            {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
          </div>
          <div>
            <label htmlFor="normalizedName" className="mb-1 block text-sm font-medium text-slate-800">Normalized name</label>
            <input id="normalizedName" value={formValues.normalizedName ?? ''} onChange={(event) => updateField('normalizedName', event.target.value)} disabled={isSubmitting} placeholder="nestjs" className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
            {errors.normalizedName ? <p className="mt-1 text-xs text-red-600">{errors.normalizedName}</p> : null}
          </div>
          <div>
            <label htmlFor="skillType" className="mb-1 block text-sm font-medium text-slate-800">Type</label>
            <select id="skillType" value={formValues.type} onChange={(event) => updateField('type', event.target.value)} disabled={isSubmitting} className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
              <option value="REQUIRED">Required</option>
              <option value="PREFERRED">Preferred</option>
            </select>
          </div>
          <div>
            <label htmlFor="weightHint" className="mb-1 block text-sm font-medium text-slate-800">Weight</label>
            <input id="weightHint" type="number" step="0.1" min="0" max="1" value={formValues.weightHint as number} onChange={(event) => updateField('weightHint', Number(event.target.value))} disabled={isSubmitting} className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
            {errors.weightHint ? <p className="mt-1 text-xs text-red-600">{errors.weightHint}</p> : null}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={formValues.isCore} onChange={(event) => updateField('isCore', event.target.checked)} disabled={isSubmitting} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
            Mark as core skill
          </label>
          <div className="flex gap-2">
            {editingSkillId ? <button type="button" onClick={resetForm} disabled={isSubmitting} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-white">Cancel edit</button> : null}
            <button type="submit" disabled={isSubmitting} className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
              {isSubmitting ? 'Saving...' : editingSkillId ? 'Update skill' : 'Add skill'}
            </button>
          </div>
        </div>
      </form>

      <SkillGroup title="Required skills" skills={requiredSkills} onEdit={startEditing} onDelete={handleDelete} deletingSkillId={deletingSkillId} />
      <SkillGroup title="Preferred skills" skills={preferredSkills} onEdit={startEditing} onDelete={handleDelete} deletingSkillId={deletingSkillId} />
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
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {skills.length > 0 ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {skills.map((skill) => (
            <div key={skill.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{skill.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{skill.normalizedName || 'Not normalized'}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${skill.type === 'REQUIRED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{skill.type}</span>
                  {skill.isCore ? <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">CORE</span> : null}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">Weight: {skill.weightHint ?? 'N/A'}</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => onEdit(skill)} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Edit</button>
                  <button type="button" onClick={() => onDelete(skill)} disabled={deletingSkillId === skill.id} className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:text-red-300">
                    {deletingSkillId === skill.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-500">No {title.toLowerCase()} yet.</p>
      )}
    </div>
  );
}
