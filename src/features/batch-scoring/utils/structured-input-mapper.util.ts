import type {
  JobDescriptionStructuredInput,
  ResumeStructuredInput,
} from '@/features/batch-scoring/types/batch-scoring.type';
import type {
  JobDescriptionStructuredValues,
  ResumeStructuredValues,
} from '@/components/batch-input/structured-input.type';

export function toInt(value: string): number | undefined {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function toFloat(value: string): number | undefined {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : undefined;
}

export function trimOrUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function toResumeStructuredInput(value: ResumeStructuredValues): ResumeStructuredInput {
  return {
    label: trimOrUndefined(value.label),
    personal: {
      fullName: trimOrUndefined(value.personal.fullName),
      email: trimOrUndefined(value.personal.email),
      phone: trimOrUndefined(value.personal.phone),
      location: trimOrUndefined(value.personal.location),
      linkedinUrl: trimOrUndefined(value.personal.linkedinUrl),
      githubUrl: trimOrUndefined(value.personal.githubUrl),
      portfolioUrl: trimOrUndefined(value.personal.portfolioUrl),
    },
    summary: trimOrUndefined(value.summary),
    skills: value.skills
      .filter((s) => s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        category: trimOrUndefined(s.category),
        level: trimOrUndefined(s.level),
        evidence: trimOrUndefined(s.evidence),
      })),
    education: value.education
      .filter((e) => e.institution.trim() || e.degree.trim())
      .map((e) => ({
        institution: trimOrUndefined(e.institution),
        degree: trimOrUndefined(e.degree),
        fieldOfStudy: trimOrUndefined(e.fieldOfStudy),
        startYear: toInt(e.startYear),
        endYear: toInt(e.endYear),
        gpa: trimOrUndefined(e.gpa),
        gpaScale: trimOrUndefined(e.gpaScale),
        description: trimOrUndefined(e.description),
      })),
    experience: value.experience
      .filter((e) => e.company.trim() || e.role.trim())
      .map((e) => ({
        company: trimOrUndefined(e.company),
        role: trimOrUndefined(e.role),
        location: trimOrUndefined(e.location),
        startDate: trimOrUndefined(e.startDate),
        endDate: trimOrUndefined(e.endDate),
        durationMonths: toInt(e.durationMonths),
        responsibilities: e.responsibilities.filter((r) => r.trim()),
        technologies: e.technologies.filter((t) => t.trim()),
      })),
    projects: value.projects
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: trimOrUndefined(p.name),
        role: trimOrUndefined(p.role),
        startDate: trimOrUndefined(p.startDate),
        endDate: trimOrUndefined(p.endDate),
        description: trimOrUndefined(p.description),
        technologies: p.technologies.filter((t) => t.trim()),
        urls: p.urls.filter((u) => u.trim()),
      })),
    certifications: value.certifications
      .filter((c) => c.name.trim())
      .map((c) => ({
        name: trimOrUndefined(c.name),
        issuer: trimOrUndefined(c.issuer),
        issuedYear: toInt(c.issuedYear),
        url: trimOrUndefined(c.url),
      })),
    achievements: value.achievements
      .filter((a) => a.title.trim())
      .map((a) => ({
        title: trimOrUndefined(a.title),
        description: trimOrUndefined(a.description),
        year: toInt(a.year),
      })),
    languages: value.languages
      .filter((l) => l.name.trim())
      .map((l) => ({ name: l.name.trim(), proficiency: trimOrUndefined(l.proficiency) })),
  };
}

export function toJobDescriptionStructuredInput(
  value: JobDescriptionStructuredValues,
): JobDescriptionStructuredInput {
  return {
    label: trimOrUndefined(value.label),
    title: trimOrUndefined(value.title),
    seniority: trimOrUndefined(value.seniority),
    employmentType: trimOrUndefined(value.employmentType),
    responsibilities: value.responsibilities.filter((r) => r.trim()),
    requirements: value.requirements.filter((r) => r.trim()),
    niceToHave: value.niceToHave.filter((r) => r.trim()),
    requiredSkills: value.requiredSkills
      .filter((s) => s.name.trim())
      .map((s) => ({ name: s.name.trim(), isCore: s.isCore, weightHint: toFloat(s.weightHint) })),
    preferredSkills: value.preferredSkills
      .filter((s) => s.name.trim())
      .map((s) => ({ name: s.name.trim(), isCore: s.isCore, weightHint: toFloat(s.weightHint) })),
    minExperienceYears: toInt(value.minExperienceYears),
    educationRequirement: trimOrUndefined(value.educationRequirement),
    domainKeywords: value.domainKeywords.filter((k) => k.trim()),
  };
}
