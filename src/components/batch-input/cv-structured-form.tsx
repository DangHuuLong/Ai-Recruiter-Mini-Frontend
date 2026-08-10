import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { DynamicListSection } from '@/components/batch-input/dynamic-list-section';
import { LineListField } from '@/components/batch-input/line-list-field';
import {
  EMPTY_RESUME_ACHIEVEMENT,
  EMPTY_RESUME_CERTIFICATION,
  EMPTY_RESUME_EDUCATION,
  EMPTY_RESUME_EXPERIENCE,
  EMPTY_RESUME_LANGUAGE,
  EMPTY_RESUME_PROJECT,
  EMPTY_RESUME_SKILL,
  type ResumeStructuredValues,
} from '@/components/batch-input/structured-input.type';

type CvStructuredFormProps = {
  value: ResumeStructuredValues;
  onChange: (value: ResumeStructuredValues) => void;
};

export function CvStructuredForm({ value, onChange }: CvStructuredFormProps) {
  const t = useTranslations('common.batchInput.cvForm');

  return (
    <div className="mt-4 space-y-6">
      <Input
        label={t('labelOptional')}
        placeholder={t('labelPlaceholder')}
        value={value.label}
        onChange={(e) => onChange({ ...value, label: e.target.value })}
      />

      <div>
        <h3 className="text-sm font-bold text-on-surface">{t('personalInfo')}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input
            label={t('fullName')}
            placeholder={t('fullNamePlaceholder')}
            value={value.personal.fullName}
            onChange={(e) => onChange({ ...value, personal: { ...value.personal, fullName: e.target.value } })}
          />
          <Input
            label={t('email')}
            type="email"
            placeholder={t('emailPlaceholder')}
            value={value.personal.email}
            onChange={(e) => onChange({ ...value, personal: { ...value.personal, email: e.target.value } })}
          />
          <Input
            label={t('phone')}
            placeholder={t('phonePlaceholder')}
            value={value.personal.phone}
            onChange={(e) => onChange({ ...value, personal: { ...value.personal, phone: e.target.value } })}
          />
          <Input
            label={t('location')}
            placeholder={t('locationPlaceholder')}
            value={value.personal.location}
            onChange={(e) => onChange({ ...value, personal: { ...value.personal, location: e.target.value } })}
          />
          <Input
            label={t('linkedinUrl')}
            placeholder="https://linkedin.com/in/..."
            value={value.personal.linkedinUrl}
            onChange={(e) => onChange({ ...value, personal: { ...value.personal, linkedinUrl: e.target.value } })}
          />
          <Input
            label={t('githubUrl')}
            placeholder="https://github.com/..."
            value={value.personal.githubUrl}
            onChange={(e) => onChange({ ...value, personal: { ...value.personal, githubUrl: e.target.value } })}
          />
          <Input
            label={t('portfolioUrl')}
            placeholder="https://..."
            value={value.personal.portfolioUrl}
            onChange={(e) => onChange({ ...value, personal: { ...value.personal, portfolioUrl: e.target.value } })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          {t('summary')}
        </label>
        <textarea
          value={value.summary}
          onChange={(e) => onChange({ ...value, summary: e.target.value })}
          rows={3}
          placeholder={t('summaryPlaceholder')}
          className="w-full rounded-lg border border-outline bg-surface-lowest p-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
        />
      </div>

      <DynamicListSection
        title={t('skills')}
        items={value.skills}
        addLabel={t('addSkill')}
        onAdd={() => onChange({ ...value, skills: [...value.skills, { ...EMPTY_RESUME_SKILL }] })}
        onRemove={(index) => onChange({ ...value, skills: value.skills.filter((_, i) => i !== index) })}
        renderFields={(item, index) => (
          <>
            <Input
              label={t('name')}
              value={item.name}
              onChange={(e) =>
                onChange({
                  ...value,
                  skills: value.skills.map((s, i) => (i === index ? { ...s, name: e.target.value } : s)),
                })
              }
            />
            <Input
              label={t('category')}
              value={item.category}
              onChange={(e) =>
                onChange({
                  ...value,
                  skills: value.skills.map((s, i) => (i === index ? { ...s, category: e.target.value } : s)),
                })
              }
            />
            <Input
              label={t('level')}
              placeholder={t('levelPlaceholder')}
              value={item.level}
              onChange={(e) =>
                onChange({
                  ...value,
                  skills: value.skills.map((s, i) => (i === index ? { ...s, level: e.target.value } : s)),
                })
              }
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                {t('evidence')}
              </label>
              <textarea
                value={item.evidence}
                onChange={(e) =>
                  onChange({
                    ...value,
                    skills: value.skills.map((s, i) => (i === index ? { ...s, evidence: e.target.value } : s)),
                  })
                }
                rows={2}
                className="w-full rounded-lg border border-outline bg-surface-lowest p-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
              />
            </div>
          </>
        )}
      />

      <DynamicListSection
        title={t('education')}
        items={value.education}
        addLabel={t('addEducation')}
        onAdd={() => onChange({ ...value, education: [...value.education, { ...EMPTY_RESUME_EDUCATION }] })}
        onRemove={(index) => onChange({ ...value, education: value.education.filter((_, i) => i !== index) })}
        renderFields={(item, index) => {
          const update = (patch: Partial<typeof item>) =>
            onChange({
              ...value,
              education: value.education.map((e, i) => (i === index ? { ...e, ...patch } : e)),
            });
          return (
            <>
              <Input label={t('institution')} value={item.institution} onChange={(e) => update({ institution: e.target.value })} />
              <Input label={t('degree')} value={item.degree} onChange={(e) => update({ degree: e.target.value })} />
              <Input label={t('fieldOfStudy')} value={item.fieldOfStudy} onChange={(e) => update({ fieldOfStudy: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label={t('startYear')} value={item.startYear} onChange={(e) => update({ startYear: e.target.value })} />
                <Input label={t('endYear')} value={item.endYear} onChange={(e) => update({ endYear: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label={t('gpa')} value={item.gpa} onChange={(e) => update({ gpa: e.target.value })} />
                <Input label={t('gpaScale')} value={item.gpaScale} onChange={(e) => update({ gpaScale: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  {t('description')}
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-outline bg-surface-lowest p-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                />
              </div>
            </>
          );
        }}
      />

      <DynamicListSection
        title={t('experience')}
        items={value.experience}
        addLabel={t('addExperience')}
        onAdd={() => onChange({ ...value, experience: [...value.experience, { ...EMPTY_RESUME_EXPERIENCE }] })}
        onRemove={(index) => onChange({ ...value, experience: value.experience.filter((_, i) => i !== index) })}
        renderFields={(item, index) => {
          const update = (patch: Partial<typeof item>) =>
            onChange({
              ...value,
              experience: value.experience.map((e, i) => (i === index ? { ...e, ...patch } : e)),
            });
          return (
            <>
              <Input label={t('company')} value={item.company} onChange={(e) => update({ company: e.target.value })} />
              <Input label={t('role')} value={item.role} onChange={(e) => update({ role: e.target.value })} />
              <Input label={t('location')} value={item.location} onChange={(e) => update({ location: e.target.value })} />
              <Input label={t('durationMonths')} value={item.durationMonths} onChange={(e) => update({ durationMonths: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label={t('startDate')} value={item.startDate} onChange={(e) => update({ startDate: e.target.value })} />
                <Input label={t('endDate')} value={item.endDate} onChange={(e) => update({ endDate: e.target.value })} />
              </div>
              <LineListField
                label={t('responsibilities')}
                value={item.responsibilities}
                onChange={(v) => update({ responsibilities: v })}
              />
              <LineListField
                label={t('technologies')}
                value={item.technologies}
                onChange={(v) => update({ technologies: v })}
              />
            </>
          );
        }}
      />

      <DynamicListSection
        title={t('projects')}
        items={value.projects}
        addLabel={t('addProject')}
        onAdd={() => onChange({ ...value, projects: [...value.projects, { ...EMPTY_RESUME_PROJECT }] })}
        onRemove={(index) => onChange({ ...value, projects: value.projects.filter((_, i) => i !== index) })}
        renderFields={(item, index) => {
          const update = (patch: Partial<typeof item>) =>
            onChange({
              ...value,
              projects: value.projects.map((p, i) => (i === index ? { ...p, ...patch } : p)),
            });
          return (
            <>
              <Input label={t('name')} value={item.name} onChange={(e) => update({ name: e.target.value })} />
              <Input label={t('role')} value={item.role} onChange={(e) => update({ role: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label={t('startDate')} value={item.startDate} onChange={(e) => update({ startDate: e.target.value })} />
                <Input label={t('endDate')} value={item.endDate} onChange={(e) => update({ endDate: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  {t('description')}
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-outline bg-surface-lowest p-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                />
              </div>
              <LineListField label={t('technologies')} value={item.technologies} onChange={(v) => update({ technologies: v })} />
              <LineListField label={t('urls')} value={item.urls} onChange={(v) => update({ urls: v })} />
            </>
          );
        }}
      />

      <DynamicListSection
        title={t('certifications')}
        items={value.certifications}
        addLabel={t('addCertification')}
        onAdd={() =>
          onChange({ ...value, certifications: [...value.certifications, { ...EMPTY_RESUME_CERTIFICATION }] })
        }
        onRemove={(index) =>
          onChange({ ...value, certifications: value.certifications.filter((_, i) => i !== index) })
        }
        renderFields={(item, index) => {
          const update = (patch: Partial<typeof item>) =>
            onChange({
              ...value,
              certifications: value.certifications.map((c, i) => (i === index ? { ...c, ...patch } : c)),
            });
          return (
            <>
              <Input label={t('name')} value={item.name} onChange={(e) => update({ name: e.target.value })} />
              <Input label={t('issuer')} value={item.issuer} onChange={(e) => update({ issuer: e.target.value })} />
              <Input label={t('issuedYear')} value={item.issuedYear} onChange={(e) => update({ issuedYear: e.target.value })} />
              <Input label={t('url')} value={item.url} onChange={(e) => update({ url: e.target.value })} />
            </>
          );
        }}
      />

      <DynamicListSection
        title={t('achievements')}
        items={value.achievements}
        addLabel={t('addAchievement')}
        onAdd={() => onChange({ ...value, achievements: [...value.achievements, { ...EMPTY_RESUME_ACHIEVEMENT }] })}
        onRemove={(index) =>
          onChange({ ...value, achievements: value.achievements.filter((_, i) => i !== index) })
        }
        renderFields={(item, index) => {
          const update = (patch: Partial<typeof item>) =>
            onChange({
              ...value,
              achievements: value.achievements.map((a, i) => (i === index ? { ...a, ...patch } : a)),
            });
          return (
            <>
              <Input label={t('title')} value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <Input label={t('year')} value={item.year} onChange={(e) => update({ year: e.target.value })} />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  {t('description')}
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-outline bg-surface-lowest p-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                />
              </div>
            </>
          );
        }}
      />

      <DynamicListSection
        title={t('languages')}
        items={value.languages}
        addLabel={t('addLanguage')}
        onAdd={() => onChange({ ...value, languages: [...value.languages, { ...EMPTY_RESUME_LANGUAGE }] })}
        onRemove={(index) => onChange({ ...value, languages: value.languages.filter((_, i) => i !== index) })}
        renderFields={(item, index) => (
          <>
            <Input
              label={t('name')}
              value={item.name}
              onChange={(e) =>
                onChange({
                  ...value,
                  languages: value.languages.map((l, i) => (i === index ? { ...l, name: e.target.value } : l)),
                })
              }
            />
            <Input
              label={t('proficiency')}
              placeholder={t('proficiencyPlaceholder')}
              value={item.proficiency}
              onChange={(e) =>
                onChange({
                  ...value,
                  languages: value.languages.map((l, i) => (i === index ? { ...l, proficiency: e.target.value } : l)),
                })
              }
            />
          </>
        )}
      />
    </div>
  );
}
