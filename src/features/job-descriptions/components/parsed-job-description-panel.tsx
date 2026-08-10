import { useTranslations } from 'next-intl';

import type { ParsedJobDescriptionData, ParsedJobSkill } from '@/features/job-descriptions/types/job-description.type';

type ParsedJobDescriptionPanelProps = {
  parsedData?: ParsedJobDescriptionData | null;
};

export function ParsedJobDescriptionPanel({ parsedData }: ParsedJobDescriptionPanelProps) {
  const t = useTranslations('jobDescriptions.parsedPanel');

  if (!parsedData) {
    return (
      <section className="rounded-2xl border border-dashed border-outline bg-surface-lowest p-6">
        <h2 className="text-lg font-semibold text-on-surface">{t('title')}</h2>
        <p className="mt-2 text-sm text-on-surface-muted">{t('emptyDescription')}</p>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">{t('title')}</h2>
        <p className="mt-1 text-sm text-on-surface-muted">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard label={t('parsedTitle')} value={parsedData.title ?? t('notDetected')} />
        <InfoCard label={t('seniority')} value={parsedData.seniority ?? t('notDetected')} />
        <InfoCard label={t('employmentType')} value={parsedData.employment_type ?? t('notDetected')} />
        <InfoCard label={t('minExperience')} value={parsedData.min_experience_years != null ? t('years', { count: parsedData.min_experience_years }) : t('notDetected')} />
        <InfoCard label={t('education')} value={parsedData.education_requirement ?? t('notDetected')} className="md:col-span-2" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <ListSection title={t('responsibilities')} items={parsedData.responsibilities} />
        <ListSection title={t('requirements')} items={parsedData.requirements} />
        <ListSection title={t('niceToHave')} items={parsedData.nice_to_have} />
      </div>

      <SkillSection title={t('requiredSkills')} skills={parsedData.required_skills} />
      <SkillSection title={t('preferredSkills')} skills={parsedData.preferred_skills} />

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-on-surface-muted">{t('domainKeywords')}</h3>
        {parsedData.domain_keywords.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {parsedData.domain_keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-surface-variant px-3 py-1 text-xs font-semibold text-on-surface-variant">
                {keyword}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-on-surface-muted">{t('noKeywords')}</p>
        )}
      </div>
    </section>
  );
}

type InfoCardProps = { label: string; value: string; className?: string };

function InfoCard({ label, value, className }: InfoCardProps) {
  return (
    <div className={`rounded-xl border border-outline bg-surface-variant p-4 ${className ?? ''}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">{label}</p>
      <p className="mt-2 text-sm font-medium text-on-surface">{value}</p>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  const t = useTranslations('jobDescriptions.parsedPanel');

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-on-surface-muted">{title}</h3>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="rounded-xl border border-outline bg-surface-lowest px-4 py-3 text-sm text-on-surface-variant">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-on-surface-muted">{t('noItemsDetected', { title: title.toLowerCase() })}</p>
      )}
    </div>
  );
}

function SkillSection({ title, skills }: { title: string; skills: ParsedJobSkill[] }) {
  const t = useTranslations('jobDescriptions.parsedPanel');

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-on-surface-muted">{title}</h3>
      {skills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={`${skill.normalized_name ?? skill.name}-${skill.name}`} className="rounded-full border border-primary/20 bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
              {skill.name} · {skill.normalized_name ?? t('notNormalized')} · {skill.is_core ? t('core') : t('optional')}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-on-surface-muted">{t('noItemsDetected', { title: title.toLowerCase() })}</p>
      )}
    </div>
  );
}
