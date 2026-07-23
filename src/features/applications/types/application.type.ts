import type { Candidate } from '@/features/candidates/types/candidate.type';
import type { JobDescription } from '@/features/job-descriptions/types/job-description.type';
import type { Resume } from '@/features/resumes/types/resume.type';

export type ApplicationStatus =
  | 'DRAFT'
  | 'APPLIED'
  | 'SCREENING'
  | 'SHORTLISTED'
  | 'INTERVIEWING'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type ApplicationEventType = 'APPLICATION_CREATED' | 'STATUS_CHANGED' | string;

export type ApplicationCounts = {
  evaluations?: number;
  events?: number;
};

export type Application = {
  id: string;
  candidateId: string;
  resumeId: string;
  jobDescriptionId: string;
  createdById?: string | null;
  status: ApplicationStatus;
  source?: string | null;
  appliedAt: string;
  lastActivityAt?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  candidate?: Candidate;
  resume?: Resume;
  jobDescription?: JobDescription;
  _count?: ApplicationCounts;
};

export type ApplicationEvent = {
  id: string;
  applicationId: string;
  eventType: ApplicationEventType;
  eventData?: {
    fromStatus?: ApplicationStatus;
    toStatus?: ApplicationStatus;
    note?: string;
    [key: string]: unknown;
  } | null;
  createdAt: string;
};

export type CreateApplicationPayload = {
  candidateId: string;
  resumeId: string;
  jobDescriptionId: string;
  source?: string;
  notes?: string;
  createdById?: string;
};

export type UpdateApplicationPayload = {
  source?: string;
  notes?: string;
};

export type UpdateApplicationStatusPayload = {
  status: ApplicationStatus;
  note?: string;
};

export type ApplicationQuery = {
  page?: number;
  limit?: number;
  search?: string;
  candidateId?: string;
  jobDescriptionId?: string;
  resumeId?: string;
  status?: ApplicationStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'appliedAt' | 'lastActivityAt';
  sortOrder?: 'asc' | 'desc';
};

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'DRAFT',
  'APPLIED',
  'SCREENING',
  'SHORTLISTED',
  'INTERVIEWING',
  'OFFER',
  'HIRED',
  'REJECTED',
  'WITHDRAWN',
];
