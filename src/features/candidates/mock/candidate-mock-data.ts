// Mock dataset backing candidate.api.ts while the API calls are temporarily commented out
// for static-UI review. Shape mirrors the real `Candidate` type exactly.
import type { Candidate } from '@/features/candidates/types/candidate.type';

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    fullName: 'Jordan Whittaker',
    primaryEmail: 'j.whittaker@techflow.io',
    primaryPhone: '+1 (555) 234-9871',
    linkedinUrl: 'https://linkedin.com/in/jordanwhittaker',
    githubUrl: 'https://github.com/jwhittaker',
    portfolioUrl: 'https://jordanwhittaker.dev',
    location: 'San Francisco, CA',
    normalizedProfile: null,
    identityConfidence: 0.96,
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-07-10T09:00:00Z',
  },
  {
    id: 'cand-2',
    fullName: 'Sarah Al-Fayed',
    primaryEmail: 'sarah.af@designhub.co',
    primaryPhone: '+44 7700 900452',
    linkedinUrl: 'https://linkedin.com/in/sarahalfayed',
    githubUrl: null,
    portfolioUrl: 'https://sarahalfayed.design',
    location: 'London, UK',
    normalizedProfile: null,
    identityConfidence: 0.91,
    createdAt: '2026-06-05T10:00:00Z',
    updatedAt: '2026-07-08T11:00:00Z',
  },
  {
    id: 'cand-3',
    fullName: 'Marcus Chen',
    primaryEmail: 'm.chen@globalai.com',
    primaryPhone: '+65 9123 4567',
    linkedinUrl: 'https://linkedin.com/in/marcuschen',
    githubUrl: 'https://github.com/mchen',
    portfolioUrl: null,
    location: 'Singapore',
    normalizedProfile: null,
    identityConfidence: 0.88,
    createdAt: '2026-06-12T14:30:00Z',
    updatedAt: '2026-07-15T09:20:00Z',
  },
  {
    id: 'cand-4',
    fullName: 'Elena Lopez',
    primaryEmail: 'elena.l@berlin.tech',
    primaryPhone: '+49 152 9012345',
    linkedinUrl: null,
    githubUrl: 'https://github.com/elopez',
    portfolioUrl: 'https://elenalopez.tech',
    location: 'Berlin, DE',
    normalizedProfile: null,
    identityConfidence: 0.94,
    createdAt: '2026-06-20T09:00:00Z',
    updatedAt: '2026-07-18T16:40:00Z',
  },
];

export function findMockCandidateIndex(id: string): number {
  return MOCK_CANDIDATES.findIndex((candidate) => candidate.id === id);
}

let mockCandidateSequence = MOCK_CANDIDATES.length;

export function nextMockCandidateId(): string {
  mockCandidateSequence += 1;
  return `cand-${mockCandidateSequence}`;
}
