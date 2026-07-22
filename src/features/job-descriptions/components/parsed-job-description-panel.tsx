import type { ParsedJobDescriptionData, ParsedJobSkill } from '@/features/job-descriptions/types/job-description.type';

type ParsedJobDescriptionPanelProps = {
  parsedData?: ParsedJobDescriptionData | null;
};

export function ParsedJobDescriptionPanel({ parsedData }: ParsedJobDescriptionPanelProps) {
  if (!parsedData) {
    return (
      <section className="rounded-2xl border border-dashed border-outline bg-surface-lowest p-6">
        <h2 className="text-lg font-semibold text-on-surface">Parsed JD Data</h2>
        <p className="mt-2 text-sm text-on-surface-muted">
          Parsed data is not available yet. Click Parse JD to extract structured data from the raw job description text.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">Parsed JD Data</h2>
        <p className="mt-1 text-sm text-on-surface-muted">Structured data returned by the AI Service parser.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard label="Parsed Title" value={parsedData.title ?? 'Not detected'} />
        <InfoCard label="Seniority" value={parsedData.seniority ?? 'Not detected'} />
        <InfoCard label="Employment Type" value={parsedData.employment_type ?? 'Not detected'} />
        <InfoCard label="Minimum Experience" value={parsedData.min_experience_years != null ? `${parsedData.min_experience_years} year(s)` : 'Not detected'} />
        <InfoCard label="Education" value={parsedData.education_requirement ?? 'Not detected'} className="md:col-span-2" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <ListSection title="Responsibilities" items={parsedData.responsibilities} />
        <ListSection title="Requirements" items={parsedData.requirements} />
        <ListSection title="Nice to have" items={parsedData.nice_to_have} />
      </div>

      <SkillSection title="Required skills" skills={parsedData.required_skills} />
      <SkillSection title="Preferred skills" skills={parsedData.preferred_skills} />

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-on-surface-muted">Domain keywords</h3>
        {parsedData.domain_keywords.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {parsedData.domain_keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-surface-variant px-3 py-1 text-xs font-semibold text-on-surface-variant">
                {keyword}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-on-surface-muted">No domain keywords detected.</p>
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
        <p className="mt-2 text-sm text-on-surface-muted">No {title.toLowerCase()} detected.</p>
      )}
    </div>
  );
}

function SkillSection({ title, skills }: { title: string; skills: ParsedJobSkill[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-on-surface-muted">{title}</h3>
      {skills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={`${skill.normalized_name ?? skill.name}-${skill.name}`} className="rounded-full border border-primary/20 bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
              {skill.name} · {skill.normalized_name ?? 'not normalized'} · {skill.is_core ? 'core' : 'optional'}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-on-surface-muted">No {title.toLowerCase()} detected.</p>
      )}
    </div>
  );
}
