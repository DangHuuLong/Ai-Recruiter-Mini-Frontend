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

export interface CreateCandidatePayload {
  fullName: string;
  primaryEmail?: string;
  primaryPhone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  location?: string;
}