import { Input } from '@/components/ui/input';
import { DynamicListSection } from '@/features/public-batches/components/dynamic-list-section';
import { LineListField } from '@/features/public-batches/components/line-list-field';
import {
  EMPTY_JD_SKILL,
  type JobDescriptionStructuredValues,
} from '@/features/public-batches/types/structured-input.type';

type JdStructuredFormProps = {
  value: JobDescriptionStructuredValues;
  onChange: (value: JobDescriptionStructuredValues) => void;
};

export function JdStructuredForm({ value, onChange }: JdStructuredFormProps) {
  return (
    <div className="mt-4 space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Label (optional)"
          placeholder="e.g., Role A"
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
        />
        <Input
          label="Job title"
          placeholder="Senior Backend Engineer"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
        <Input
          label="Seniority"
          placeholder="Senior"
          value={value.seniority}
          onChange={(e) => onChange({ ...value, seniority: e.target.value })}
        />
        <Input
          label="Employment type"
          placeholder="Full-time"
          value={value.employmentType}
          onChange={(e) => onChange({ ...value, employmentType: e.target.value })}
        />
        <Input
          label="Min. experience (years)"
          value={value.minExperienceYears}
          onChange={(e) => onChange({ ...value, minExperienceYears: e.target.value })}
        />
        <Input
          label="Education requirement"
          placeholder="Bachelor's degree in CS"
          value={value.educationRequirement}
          onChange={(e) => onChange({ ...value, educationRequirement: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <LineListField
          label="Responsibilities"
          value={value.responsibilities}
          onChange={(v) => onChange({ ...value, responsibilities: v })}
        />
        <LineListField
          label="Requirements"
          value={value.requirements}
          onChange={(v) => onChange({ ...value, requirements: v })}
        />
        <LineListField
          label="Nice to have"
          value={value.niceToHave}
          onChange={(v) => onChange({ ...value, niceToHave: v })}
        />
        <LineListField
          label="Domain keywords"
          value={value.domainKeywords}
          onChange={(v) => onChange({ ...value, domainKeywords: v })}
        />
      </div>

      <DynamicListSection
        title="Required skills"
        items={value.requiredSkills}
        addLabel="Add required skill"
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
              <Input label="Name" value={item.name} onChange={(e) => update({ name: e.target.value })} />
              <Input
                label="Weight hint (0-1)"
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
                Core skill
              </label>
            </>
          );
        }}
      />

      <DynamicListSection
        title="Preferred skills"
        items={value.preferredSkills}
        addLabel="Add preferred skill"
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
              <Input label="Name" value={item.name} onChange={(e) => update({ name: e.target.value })} />
              <Input
                label="Weight hint (0-1)"
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
                Core skill
              </label>
            </>
          );
        }}
      />
    </div>
  );
}
