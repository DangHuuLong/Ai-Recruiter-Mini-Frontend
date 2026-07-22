// Mirrors EvaluationConfig entity + CreateEvaluationConfigDto from
// Ai-Recruiter-Mini-Backend (src/modules/evaluation-configs/) — read directly from source.

export type CriterionName =
  | 'SKILLS_MATCH'
  | 'EXPERIENCE_RELEVANCE'
  | 'PROJECT_RELEVANCE'
  | 'EDUCATION_CERTIFICATION'
  | 'KEYWORD_DOMAIN_ALIGNMENT';

export const CRITERION_LABELS: Record<CriterionName, string> = {
  SKILLS_MATCH: 'Skills Match',
  EXPERIENCE_RELEVANCE: 'Experience Relevance',
  PROJECT_RELEVANCE: 'Project Relevance',
  EDUCATION_CERTIFICATION: 'Education/Certification',
  KEYWORD_DOMAIN_ALIGNMENT: 'Keyword/Domain Alignment',
};

export const CRITERION_OPTIONS = Object.keys(CRITERION_LABELS) as CriterionName[];

export type CriterionDefinition = {
  criterion: CriterionName;
  weight: number;
};

export type MockEvaluationConfig = {
  id: string;
  name: string;
  description: string | null;
  jobDescriptionId: string | null;
  jobDescriptionTitle: string | null;
  isDefault: boolean;
  criteriaDefinition: CriterionDefinition[];
  totalWeight: number;
  updatedAt: string;
};

export const MOCK_EVALUATION_CONFIGS: MockEvaluationConfig[] = [
  {
    id: 'config-1',
    name: 'Organization default',
    description: 'Balanced weighting used when no config is specified.',
    jobDescriptionId: null,
    jobDescriptionTitle: null,
    isDefault: true,
    criteriaDefinition: [
      { criterion: 'SKILLS_MATCH', weight: 0.4 },
      { criterion: 'EXPERIENCE_RELEVANCE', weight: 0.3 },
      { criterion: 'PROJECT_RELEVANCE', weight: 0.15 },
      { criterion: 'EDUCATION_CERTIFICATION', weight: 0.1 },
      { criterion: 'KEYWORD_DOMAIN_ALIGNMENT', weight: 0.05 },
    ],
    totalWeight: 1,
    updatedAt: '2026-07-10T09:00:00Z',
  },
  {
    id: 'config-2',
    name: 'Senior Engineering (weighted)',
    description: 'Prioritizes hands-on experience over education for senior roles.',
    jobDescriptionId: 'jd-1',
    jobDescriptionTitle: 'Senior Backend Engineer',
    isDefault: false,
    criteriaDefinition: [
      { criterion: 'SKILLS_MATCH', weight: 0.35 },
      { criterion: 'EXPERIENCE_RELEVANCE', weight: 0.45 },
      { criterion: 'PROJECT_RELEVANCE', weight: 0.15 },
      { criterion: 'EDUCATION_CERTIFICATION', weight: 0.05 },
    ],
    totalWeight: 1,
    updatedAt: '2026-07-15T13:20:00Z',
  },
  {
    id: 'config-3',
    name: 'Design roles',
    description: null,
    jobDescriptionId: null,
    jobDescriptionTitle: null,
    isDefault: false,
    criteriaDefinition: [
      { criterion: 'SKILLS_MATCH', weight: 0.3 },
      { criterion: 'PROJECT_RELEVANCE', weight: 0.4 },
      { criterion: 'EXPERIENCE_RELEVANCE', weight: 0.2 },
      { criterion: 'KEYWORD_DOMAIN_ALIGNMENT', weight: 0.1 },
    ],
    totalWeight: 1,
    updatedAt: '2026-07-18T16:45:00Z',
  },
];

export function getMockEvaluationConfig(id: string): MockEvaluationConfig | null {
  return MOCK_EVALUATION_CONFIGS.find((config) => config.id === id) ?? null;
}
