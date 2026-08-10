import {
  AwardIcon,
  BriefcaseIcon,
  FileTextIcon,
  GlobeIcon,
  GraduationCapIcon,
  RocketIcon,
  TagsIcon,
  UserIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

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
    <section className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-on-surface">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
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
  const t = useTranslations('resumes');

  return (
    <div className="rounded-xl border border-outline bg-surface-variant px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-on-surface">
        {getDisplayValue(value ? String(value) : null, t('notProvided'))}
      </p>
    </div>
  );
}

function ParsedDataList({ items, emptyMessage }: ParsedDataListProps) {
  if (!items.length) {
    return <p className="text-sm text-on-surface-variant">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.name}
          className="rounded-xl border border-outline bg-surface-variant px-4 py-3 text-sm leading-6 text-on-surface-variant"
        >
          <span className="font-semibold text-on-surface">{item.name}</span>
          {item.description ? (
            <span className="text-on-surface-variant"> — {item.description}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function SkillList({ skills }: { skills: ParsedSkill[] }) {
  const t = useTranslations('resumes.parsedData');

  if (!skills.length) {
    return <p className="text-sm text-on-surface-variant">{t('noSkills')}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={`${skill.name}-${skill.category ?? 'general'}`}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary-container px-3 py-2 text-sm font-semibold text-on-primary-container"
        >
          <span>{skill.name}</span>
          {skill.category ? (
            <span className="rounded-lg bg-surface-lowest/80 px-2 py-0.5 text-xs font-semibold capitalize text-on-surface-muted">
              {skill.category}
            </span>
          ) : null}
        </span>
      ))}
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
    <article className="rounded-xl border border-outline bg-surface-variant p-4">
      <h4 className="text-sm font-semibold text-on-surface">{title}</h4>
      {subtitle ? (
        <p className="mt-1 text-sm font-medium text-on-surface-variant">{subtitle}</p>
      ) : null}
      {description ? (
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">{description}</p>
      ) : null}
      {technologies.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-lg border border-outline bg-surface-lowest px-2 py-1 text-xs font-semibold text-on-surface-variant"
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
  const t = useTranslations('resumes.parsedData');
  const tRoot = useTranslations('resumes');
  const institution = getParsedDataString(education, 'institution') ?? fallbackTitle;
  const degree = getParsedDataString(education, 'degree');
  const fieldOfStudy = getParsedDataString(education, 'field_of_study');
  const startYear = education.start_year;
  const endYear = education.end_year;
  const description = getParsedDataString(education, 'description');
  const notProvided = tRoot('notProvided');
  const yearRange = `${getDisplayValue(startYear ? String(startYear) : null, notProvided)} - ${getDisplayValue(endYear ? String(endYear) : null, notProvided)}`;

  return (
    <article className="rounded-xl border border-outline bg-surface-variant p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-sm font-semibold text-on-surface">{institution}</h4>
          <p className="mt-1 text-sm font-medium text-on-surface-variant">
            {[degree, fieldOfStudy].filter(Boolean).join(' · ') || notProvided}
          </p>
        </div>

        <span className="inline-flex w-fit rounded-lg border border-outline bg-surface-lowest px-3 py-1 text-xs font-semibold text-on-surface-variant">
          {yearRange}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ParsedDataField label={t('degree')} value={degree} />
        <ParsedDataField label={t('fieldOfStudy')} value={fieldOfStudy} />
        <ParsedDataField label={t('startYear')} value={startYear} />
        <ParsedDataField label={t('endYear')} value={endYear} />
      </div>

      {description ? (
        <p className="mt-4 whitespace-pre-line rounded-xl border border-outline bg-surface-lowest px-4 py-3 text-sm leading-6 text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </article>
  );
}

export function ResumeParsedData({ parsedData }: ResumeParsedDataProps) {
  const t = useTranslations('resumes.parsedData');
  const tRoot = useTranslations('resumes');

  if (!isParsedDataRecord(parsedData)) {
    return (
      <div className="rounded-2xl border border-warning/30 bg-warning-container p-4 text-sm text-on-surface">
        {t('invalidStructure')}
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
      <div className="grid gap-5 lg:grid-cols-2">
        <ParsedDataSection
          title={t('personalInfo')}
          description={t('personalInfoDescription')}
          icon={<UserIcon className="size-5" />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <ParsedDataField
              label={t('name')}
              value={
                getParsedDataString(personal, 'name') ??
                getParsedDataString(personal, 'full_name')
              }
            />
            <ParsedDataField label={t('email')} value={getParsedDataString(personal, 'email')} />
            <ParsedDataField label={t('phone')} value={getParsedDataString(personal, 'phone')} />
            <ParsedDataField
              label={t('location')}
              value={getParsedDataString(personal, 'location')}
            />
          </div>
        </ParsedDataSection>

        <ParsedDataSection
          title={t('professionalSummary')}
          description={t('professionalSummaryDescription')}
          icon={<FileTextIcon className="size-5" />}
        >
          <p className="rounded-xl border border-outline bg-surface-variant px-4 py-3 text-sm leading-6 text-on-surface-variant">
            {getDisplayValue(summary, tRoot('notProvided'))}
          </p>
        </ParsedDataSection>
      </div>

      <ParsedDataSection
        title={t('skills', { count: skills.length })}
        description={t('skillsDescription')}
        icon={<TagsIcon className="size-5" />}
      >
        <SkillList skills={skills} />
      </ParsedDataSection>

      <ParsedDataSection
        title={t('experience')}
        description={t('experienceDescription')}
        icon={<BriefcaseIcon className="size-5" />}
      >
        <div className="space-y-3">
          {experience.length ? (
            experience.map((item, index) => (
              <RecordCard
                key={`${getParsedDataString(item, 'company') ?? 'experience'}-${index}`}
                record={item}
                fallbackTitle={t('experienceFallback', { index: index + 1 })}
              />
            ))
          ) : (
            <p className="text-sm text-on-surface-variant">{t('noExperience')}</p>
          )}
        </div>
      </ParsedDataSection>

      <ParsedDataSection
        title={t('education')}
        description={t('educationDescription')}
        icon={<GraduationCapIcon className="size-5" />}
      >
        <div className="space-y-3">
          {education.length ? (
            education.map((item, index) => (
              <EducationCard
                key={`${getParsedDataString(item, 'institution') ?? 'education'}-${index}`}
                education={item}
                fallbackTitle={t('educationFallback', { index: index + 1 })}
              />
            ))
          ) : (
            <p className="text-sm text-on-surface-variant">{t('noEducation')}</p>
          )}
        </div>
      </ParsedDataSection>

      <ParsedDataSection
        title={t('projects')}
        description={t('projectsDescription')}
        icon={<RocketIcon className="size-5" />}
      >
        <div className="space-y-3">
          {projects.length ? (
            projects.map((item, index) => (
              <RecordCard
                key={`${getParsedDataString(item, 'name') ?? 'project'}-${index}`}
                record={item}
                fallbackTitle={t('projectFallback', { index: index + 1 })}
              />
            ))
          ) : (
            <p className="text-sm text-on-surface-variant">{t('noProjects')}</p>
          )}
        </div>
      </ParsedDataSection>

      <div className="grid gap-5 lg:grid-cols-2">
        <ParsedDataSection
          title={t('certifications')}
          description={t('certificationsDescription')}
          icon={<AwardIcon className="size-5" />}
        >
          <ParsedDataList
            items={certifications}
            emptyMessage={t('noCertifications')}
          />
        </ParsedDataSection>

        <ParsedDataSection
          title={t('languages')}
          description={t('languagesDescription')}
          icon={<GlobeIcon className="size-5" />}
        >
          <ParsedDataList
            items={languages}
            emptyMessage={t('noLanguages')}
          />
        </ParsedDataSection>
      </div>
    </div>
  );
}
