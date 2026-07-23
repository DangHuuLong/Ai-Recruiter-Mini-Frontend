export type JobSkillType = 'REQUIRED' | 'PREFERRED';
export type ParseStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export type ParsedJobSkill = {
  name: string;
  normalized_name?: string | null;
  is_core?: boolean | null;
  weight_hint?: number | null;
};

export type ParsedJobDescriptionData = {
  title?: string | null;
  seniority?: string | null;
  employment_type?: string | null;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  required_skills: ParsedJobSkill[];
  preferred_skills: ParsedJobSkill[];
  min_experience_years?: number | null;
  education_requirement?: string | null;
  domain_keywords: string[];
};

export type JobSkill = {
  id: string;
  jobDescriptionId: string;
  name: string;
  normalizedName?: string | null;
  type: JobSkillType;
  isCore: boolean;
  weightHint?: number | null;
  createdAt: string;
};

export type JobDescriptionCounts = {
  applications: number;
  evaluationConfigs?: number;
  skills?: number;
};

export type JobDescription = {
  id: string;
  createdById?: string | null;
  title: string;
  companyName?: string | null;
  department?: string | null;
  location?: string | null;
  employmentType?: string | null;
  seniority?: string | null;
  rawText: string;
  parsedData?: ParsedJobDescriptionData | null;
  parserVersion?: string | null;
  parseStatus: ParseStatus;
  parsingError?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  skills?: JobSkill[];
  _count?: JobDescriptionCounts;
};

export type JobDescriptionQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'companyName';
  sortOrder?: 'asc' | 'desc';
};

export type ParsedJobDescriptionState = Pick<
  JobDescription,
  | 'id'
  | 'title'
  | 'rawText'
  | 'parsedData'
  | 'parseStatus'
  | 'parserVersion'
  | 'parsingError'
  | 'updatedAt'
>;

export type CreateJobDescriptionPayload = {
  title: string;
  companyName?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  seniority?: string;
  rawText: string;
  parserVersion?: string;
  createdById?: string;
};

export type UpdateJobDescriptionPayload = Partial<CreateJobDescriptionPayload>;

export type CreateJobSkillPayload = {
  name: string;
  normalizedName?: string;
  type: JobSkillType;
  isCore?: boolean;
  weightHint?: number;
};

export type UpdateJobSkillPayload = Partial<CreateJobSkillPayload>;