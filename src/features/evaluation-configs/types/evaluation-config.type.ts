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

export type EvaluationConfig = {
  id: string;
  organizationId: string;
  jobDescriptionId: string | null;
  createdById: string | null;
  name: string;
  description: string | null;
  isDefault: boolean;
  criteriaDefinition: CriterionDefinition[];
  totalWeight: number;
  version: string | null;
  createdAt: string;
  updatedAt: string;
};

// The backend has no "isDefault" or search filter — only jobDescriptionId + pagination/sort.
export type EvaluationConfigQuery = {
  page?: number;
  limit?: number;
  jobDescriptionId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
};

export type CreateEvaluationConfigPayload = {
  name: string;
  description?: string;
  jobDescriptionId?: string;
  isDefault?: boolean;
  version?: string;
  criteria: CriterionDefinition[];
};

export type UpdateEvaluationConfigPayload = Partial<CreateEvaluationConfigPayload>;

export type DeleteEvaluationConfigResult = {
  id: string;
  deleted: boolean;
};
