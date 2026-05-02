import type {
  ParsedDataFieldProps,
  ParsedDataListProps,
  ParsedDataSectionProps,
  ParsedSkill,
  ResumeParsedDataProps,
} from '@/features/resumes/types/resume-parsed-data.type';
import {
  getParsedDataNamedList,
  getParsedDataRecord,
  getParsedDataRecordList,
  getParsedDataString,
  getParsedSkillList,
  getSkillIconLabel,
  isParsedDataRecord,
} from '@/features/resumes/utils/parsed-resume-data.util';
import { getDisplayValue } from '@/lib/utils/display-value.util';

function ParsedDataSection({
  title,
  description,
  icon,
  children,
}: ParsedDataSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-semibold text-blue-700">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-950">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function ParsedDataField({ label, value }: ParsedDataFieldProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {getDisplayValue(value ? String(value) : null)}
      </p>
    </div>
  );
}

function ParsedDataList({ items, emptyMessage }: ParsedDataListProps) {
  if (!items.length) {
    return <p className="text-sm text-slate-600">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.name}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
        >
          <span className="font-semibold text-slate-900">{item.name}</span>
          {item.description ? (
            <span className="text-slate-600"> — {item.description}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function SkillList({ skills }: { skills: ParsedSkill[] }) {
  if (!skills.length) {
    return <p className="text-sm text-slate-600">No skills were extracted.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => {
        const iconSource = skill.normalizedName ?? skill.name;

        return (
          <span
            key={`${skill.name}-${skill.category ?? 'general'}`}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
          >
            <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-white px-1 text-xs font-bold text-blue-700 shadow-sm">
              {getSkillIconLabel(iconSource)}
            </span>
            <span>{skill.name}</span>
            {skill.category ? (
              <span className="rounded-lg bg-white/80 px-2 py-0.5 text-xs font-semibold capitalize text-slate-500">
                {skill.category}
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

function RecordCard({
  record,
  fallbackTitle,
}: {
  record: Record<string, unknown>;
  fallbackTitle: string;
}) {
  const title =
    getParsedDataString(record, 'title') ??
    getParsedDataString(record, 'role') ??
    getParsedDataString(record, 'position') ??
    getParsedDataString(record, 'job_title') ??
    getParsedDataString(record, 'name') ??
    getParsedDataString(record, 'company') ??
    getParsedDataString(record, 'school') ??
    fallbackTitle;

  const rawSubtitle =
    getParsedDataString(record, 'company') ??
    getParsedDataString(record, 'duration');

  const subtitle = rawSubtitle === title ? null : rawSubtitle;
  const description =
    getParsedDataString(record, 'description') ??
    getParsedDataString(record, 'summary');
  const technologies = Array.isArray(record.technologies)
    ? record.technologies.filter(
        (technology): technology is string => typeof technology === 'string',
      )
    : [];

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-semibold text-slate-950">{title}</h4>
      {subtitle ? (
        <p className="mt-1 text-sm font-medium text-slate-600">{subtitle}</p>
      ) : null}
      {description ? (
        <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
      ) : null}
      {technologies.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600"
            >
              {technology}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function EducationCard({
  education,
  fallbackTitle,
}: {
  education: Record<string, unknown>;
  fallbackTitle: string;
}) {
  const institution = getParsedDataString(education, 'institution') ?? fallbackTitle;
  const degree = getParsedDataString(education, 'degree');
  const fieldOfStudy = getParsedDataString(education, 'field_of_study');
  const startYear = education.start_year;
  const endYear = education.end_year;
  const description = getParsedDataString(education, 'description');
  const yearRange = `${getDisplayValue(startYear ? String(startYear) : null)} - ${getDisplayValue(endYear ? String(endYear) : null)}`;

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-950">{institution}</h4>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {[degree, fieldOfStudy].filter(Boolean).join(' · ') || 'Not provided'}
          </p>
        </div>

        <span className="inline-flex w-fit rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          {yearRange}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ParsedDataField label="Degree" value={degree} />
        <ParsedDataField label="Field of study" value={fieldOfStudy} />
        <ParsedDataField label="Start year" value={startYear} />
        <ParsedDataField label="End year" value={endYear} />
      </div>

      {description ? (
        <p className="mt-4 whitespace-pre-line rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
          {description}
        </p>
      ) : null}
    </article>
  );
}

export function ResumeParsedData({ parsedData }: ResumeParsedDataProps) {
  if (!isParsedDataRecord(parsedData)) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        Parsed CV data is available, but it does not match the expected display
        structure.
      </div>
    );
  }

  const personal = getParsedDataRecord(parsedData, 'personal');
  const skills = getParsedSkillList(parsedData);
  const education = getParsedDataRecordList(parsedData, 'education');
  const experience = getParsedDataRecordList(parsedData, 'experience');
  const projects = getParsedDataRecordList(parsedData, 'projects');
  const certifications = getParsedDataNamedList(parsedData, 'certifications');
  const languages = getParsedDataNamedList(parsedData, 'languages');
  const summary = getParsedDataString(parsedData, 'summary');

  return (
    <div className="space-y-5">
      <ParsedDataSection
        title="Personal information"
        description="Candidate identity and contact fields extracted from the CV."
        icon="👤"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <ParsedDataField
            label="Name"
            value={
              getParsedDataString(personal, 'name') ??
              getParsedDataString(personal, 'full_name')
            }
          />
          <ParsedDataField label="Email" value={getParsedDataString(personal, 'email')} />
          <ParsedDataField label="Phone" value={getParsedDataString(personal, 'phone')} />
          <ParsedDataField
            label="Location"
            value={getParsedDataString(personal, 'location')}
          />
        </div>
      </ParsedDataSection>

      <ParsedDataSection
        title="Professional summary"
        description="Short profile summary detected by the parser."
        icon="📝"
      >
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
          {getDisplayValue(summary)}
        </p>
      </ParsedDataSection>

      <ParsedDataSection
        title={`Technical skills (${skills.length})`}
        description="Skills are shown as compact tags with category and technology indicators."
        icon="⚙"
      >
        <SkillList skills={skills} />
      </ParsedDataSection>

      <ParsedDataSection
        title="Experience"
        description="Work history extracted from the CV."
        icon="💼"
      >
        <div className="space-y-3">
          {experience.length ? (
            experience.map((item, index) => (
              <RecordCard
                key={`${getParsedDataString(item, 'company') ?? 'experience'}-${index}`}
                record={item}
                fallbackTitle={`Experience ${index + 1}`}
              />
            ))
          ) : (
            <p className="text-sm text-slate-600">No experience was extracted.</p>
          )}
        </div>
      </ParsedDataSection>

      <ParsedDataSection
        title="Education"
        description="Education records detected from the CV."
        icon="🎓"
      >
        <div className="space-y-3">
          {education.length ? (
            education.map((item, index) => (
              <EducationCard
                key={`${getParsedDataString(item, 'institution') ?? 'education'}-${index}`}
                education={item}
                fallbackTitle={`Education ${index + 1}`}
              />
            ))
          ) : (
            <p className="text-sm text-slate-600">No education was extracted.</p>
          )}
        </div>
      </ParsedDataSection>

      <ParsedDataSection
        title="Projects"
        description="Project highlights extracted from the CV."
        icon="🚀"
      >
        <div className="space-y-3">
          {projects.length ? (
            projects.map((item, index) => (
              <RecordCard
                key={`${getParsedDataString(item, 'name') ?? 'project'}-${index}`}
                record={item}
                fallbackTitle={`Project ${index + 1}`}
              />
            ))
          ) : (
            <p className="text-sm text-slate-600">No projects were extracted.</p>
          )}
        </div>
      </ParsedDataSection>

      <div className="grid gap-5 lg:grid-cols-2">
        <ParsedDataSection
          title="Certifications"
          description="Certificates found in the CV."
          icon="🏅"
        >
          <ParsedDataList
            items={certifications}
            emptyMessage="No certifications were extracted."
          />
        </ParsedDataSection>

        <ParsedDataSection
          title="Languages"
          description="Languages found in the CV."
          icon="🌐"
        >
          <ParsedDataList
            items={languages}
            emptyMessage="No languages were extracted."
          />
        </ParsedDataSection>
      </div>
    </div>
  );
}
