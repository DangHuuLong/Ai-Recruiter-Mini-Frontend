export interface Candidate {
  id: string;
  fullName: string;
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  location?: string | null;
  normalizedProfile?: unknown | null;
  identityConfidence?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'fullName' | 'primaryEmail' | 'primaryPhone' | 'location';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCandidatePayload {
  fullName: string;
  primaryEmail?: string;
  primaryPhone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  location?: string;
}

export type UpdateCandidatePayload = Partial<CreateCandidatePayload>;

export type DeleteCandidateResult = {
  id: string;
  deleted: boolean;
};