import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { DynamicListSection } from '@/components/batch-input/dynamic-list-section';
import { LineListField } from '@/components/batch-input/line-list-field';
import {
  EMPTY_JD_SKILL,
  type JobDescriptionStructuredValues,
} from '@/components/batch-input/structured-input.type';

type JdStructuredFormProps = {
  value: JobDescriptionStructuredValues;
  onChange: (value: JobDescriptionStructuredValues) => void;
};

export function JdStructuredForm({ value, onChange }: JdStructuredFormProps) {
  const t = useTranslations('common.batchInput.jdForm');

  return (
    <div className="mt-4 space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label={t('labelOptional')}
          placeholder={t('labelPlaceholder')}
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
        />
        <Input
          label={t('jobTitle')}
          placeholder={t('jobTitlePlaceholder')}
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
        <Input
          label={t('seniority')}
          placeholder={t('seniorityPlaceholder')}
          value={value.seniority}
          onChange={(e) => onChange({ ...value, seniority: e.target.value })}
        />
        <Input
          label={t('employmentType')}
          placeholder={t('employmentTypePlaceholder')}
          value={value.employmentType}
          onChange={(e) => onChange({ ...value, employmentType: e.target.value })}
        />
        <Input
          label={t('minExperience')}
          value={value.minExperienceYears}
          onChange={(e) => onChange({ ...value, minExperienceYears: e.target.value })}
        />
        <Input
          label={t('educationRequirement')}
          placeholder={t('educationRequirementPlaceholder')}
          value={value.educationRequirement}
          onChange={(e) => onChange({ ...value, educationRequirement: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <LineListField
          label={t('responsibilities')}
          value={value.responsibilities}
          onChange={(v) => onChange({ ...value, responsibilities: v })}
        />
        <LineListField
          label={t('requirements')}
          value={value.requirements}
          onChange={(v) => onChange({ ...value, requirements: v })}
        />
        <LineListField
          label={t('niceToHave')}
          value={value.niceToHave}
          onChange={(v) => onChange({ ...value, niceToHave: v })}
        />
        <LineListField
          label={t('domainKeywords')}
          value={value.domainKeywords}
          onChange={(v) => onChange({ ...value, domainKeywords: v })}
        />
      </div>

      <DynamicListSection
        title={t('requiredSkills')}
        items={value.requiredSkills}
        addLabel={t('addRequiredSkill')}
        onAdd={() => onChange({ ...value, requiredSkills: [...value.requiredSkills, { ...EMPTY_JD_SKILL }] })}
        onRemove={(index) =>
          onChange({ ...value, requiredSkills: value.requiredSkills.filter((_, i) => i !== index) })
        }
        renderFields={(item, index) => {
          const update = (patch: Partial<typeof item>) =>
            onChange({
              ...value,
              requiredSkills: value.requiredSkills.map((s, i) => (i === index ? { ...s, ...patch } : s)),
            });
          return (
            <>
              <Input label={t('name')} value={item.name} onChange={(e) => update({ name: e.target.value })} />
              <Input
                label={t('weightHint')}
                value={item.weightHint}
                onChange={(e) => update({ weightHint: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-on-surface">
                <input
                  type="checkbox"
                  checked={item.isCore}
                  onChange={(e) => update({ isCore: e.target.checked })}
                  className="size-4 rounded border-outline text-primary"
                />
                {t('coreSkill')}
              </label>
            </>
          );
        }}
      />

      <DynamicListSection
        title={t('preferredSkills')}
        items={value.preferredSkills}
        addLabel={t('addPreferredSkill')}
        onAdd={() => onChange({ ...value, preferredSkills: [...value.preferredSkills, { ...EMPTY_JD_SKILL }] })}
        onRemove={(index) =>
          onChange({ ...value, preferredSkills: value.preferredSkills.filter((_, i) => i !== index) })
        }
        renderFields={(item, index) => {
          const update = (patch: Partial<typeof item>) =>
            onChange({
              ...value,
              preferredSkills: value.preferredSkills.map((s, i) => (i === index ? { ...s, ...patch } : s)),
            });
          return (
            <>
              <Input label={t('name')} value={item.name} onChange={(e) => update({ name: e.target.value })} />
              <Input
                label={t('weightHint')}
                value={item.weightHint}
                onChange={(e) => update({ weightHint: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-on-surface">
                <input
                  type="checkbox"
                  checked={item.isCore}
                  onChange={(e) => update({ isCore: e.target.checked })}
                  className="size-4 rounded border-outline text-primary"
                />
                {t('coreSkill')}
              </label>
            </>
          );
        }}
      />
    </div>
  );
}
