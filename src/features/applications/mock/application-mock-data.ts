// Mock dataset backing application.api.ts while the API calls are temporarily commented
// out for static-UI review. Shape mirrors the real `Application`/`ApplicationEvent`
// types exactly, cross-referencing the Candidates/Resumes/Job Descriptions mock data so
// "View candidate"/"View resume"/"View JD" links resolve to real mock records.
import { MOCK_CANDIDATES } from '@/features/candidates/mock/candidate-mock-data';
import { MOCK_JOB_DESCRIPTIONS } from '@/features/job-descriptions/mock/job-description-mock-data';
import { MOCK_RESUMES } from '@/features/resumes/mock/resume-mock-data';
import type { Application, ApplicationEvent } from '@/features/applications/types/application.type';

function candidate(id: string) {
  return MOCK_CANDIDATES.find((item) => item.id === id);
}
function resume(id: string) {
  return MOCK_RESUMES.find((item) => item.id === id);
}
function jobDescription(id: string) {
  return MOCK_JOB_DESCRIPTIONS.find((item) => item.id === id);
}

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    candidateId: 'cand-1',
    resumeId: 'res-1',
    jobDescriptionId: 'jd-1',
    createdById: 'user-1',
    status: 'INTERVIEWING',
    source: 'LinkedIn',
    appliedAt: '2026-07-01T10:30:00Z',
    lastActivityAt: '2026-07-18T14:00:00Z',
    notes: 'Strong technical assessment results. Ready for panel interview.',
    createdAt: '2026-07-01T10:30:00Z',
    updatedAt: '2026-07-18T14:00:00Z',
    candidate: candidate('cand-1'),
    resume: resume('res-1'),
    jobDescription: jobDescription('jd-1'),
    _count: { evaluations: 1, events: 3 },
  },
  {
    id: 'app-2',
    candidateId: 'cand-3',
    resumeId: 'res-3',
    jobDescriptionId: 'jd-1',
    createdById: 'user-1',
    status: 'SCREENING',
    source: 'Referral',
    appliedAt: '2026-07-05T09:00:00Z',
    lastActivityAt: '2026-07-16T11:20:00Z',
    notes: null,
    createdAt: '2026-07-05T09:00:00Z',
    updatedAt: '2026-07-16T11:20:00Z',
    candidate: candidate('cand-3'),
    resume: resume('res-3'),
    jobDescription: jobDescription('jd-1'),
    _count: { evaluations: 0, events: 2 },
  },
  {
    id: 'app-3',
    candidateId: 'cand-2',
    resumeId: 'res-4',
    jobDescriptionId: 'jd-2',
    createdById: 'user-1',
    status: 'APPLIED',
    source: 'Job Board',
    appliedAt: '2026-07-19T08:15:00Z',
    lastActivityAt: '2026-07-19T08:15:00Z',
    notes: null,
    createdAt: '2026-07-19T08:15:00Z',
    updatedAt: '2026-07-19T08:15:00Z',
    candidate: candidate('cand-2'),
    resume: resume('res-4'),
    jobDescription: jobDescription('jd-2'),
    _count: { evaluations: 0, events: 1 },
  },
  {
    id: 'app-4',
    candidateId: 'cand-4',
    resumeId: 'res-5',
    jobDescriptionId: 'jd-3',
    createdById: 'user-1',
    status: 'REJECTED',
    source: 'Indeed',
    appliedAt: '2026-06-28T12:00:00Z',
    lastActivityAt: '2026-07-04T09:30:00Z',
    notes: 'Resume failed parsing twice — asked candidate to resubmit, no response.',
    createdAt: '2026-06-28T12:00:00Z',
    updatedAt: '2026-07-04T09:30:00Z',
    candidate: candidate('cand-4'),
    resume: resume('res-5'),
    jobDescription: jobDescription('jd-3'),
    _count: { evaluations: 1, events: 3 },
  },
  {
    id: 'app-5',
    candidateId: 'cand-1',
    resumeId: 'res-2',
    jobDescriptionId: 'jd-2',
    createdById: 'user-1',
    status: 'HIRED',
    source: 'Referral',
    appliedAt: '2026-06-10T09:00:00Z',
    lastActivityAt: '2026-07-02T17:00:00Z',
    notes: 'Offer accepted, start date confirmed.',
    createdAt: '2026-06-10T09:00:00Z',
    updatedAt: '2026-07-02T17:00:00Z',
    candidate: candidate('cand-1'),
    resume: resume('res-2'),
    jobDescription: jobDescription('jd-2'),
    _count: { evaluations: 1, events: 5 },
  },
];

export const MOCK_APPLICATION_EVENTS: Record<string, ApplicationEvent[]> = {
  'app-1': [
    {
      id: 'evt-1-3',
      applicationId: 'app-1',
      eventType: 'STATUS_CHANGED',
      eventData: { fromStatus: 'SCREENING', toStatus: 'INTERVIEWING', note: 'Excellent tech assessment results. Ready for panel interview.' },
      createdAt: '2026-07-18T14:00:00Z',
    },
    {
      id: 'evt-1-2',
      applicationId: 'app-1',
      eventType: 'STATUS_CHANGED',
      eventData: { fromStatus: 'APPLIED', toStatus: 'SCREENING', note: 'Invitation to technical screening sent.' },
      createdAt: '2026-07-10T09:00:00Z',
    },
    {
      id: 'evt-1-1',
      applicationId: 'app-1',
      eventType: 'APPLICATION_CREATED',
      eventData: null,
      createdAt: '2026-07-01T10:30:00Z',
    },
  ],
  'app-2': [
    {
      id: 'evt-2-2',
      applicationId: 'app-2',
      eventType: 'STATUS_CHANGED',
      eventData: { fromStatus: 'APPLIED', toStatus: 'SCREENING', note: 'Moving to screening after initial review.' },
      createdAt: '2026-07-16T11:20:00Z',
    },
    {
      id: 'evt-2-1',
      applicationId: 'app-2',
      eventType: 'APPLICATION_CREATED',
      eventData: null,
      createdAt: '2026-07-05T09:00:00Z',
    },
  ],
  'app-3': [
    {
      id: 'evt-3-1',
      applicationId: 'app-3',
      eventType: 'APPLICATION_CREATED',
      eventData: null,
      createdAt: '2026-07-19T08:15:00Z',
    },
  ],
  'app-4': [
    {
      id: 'evt-4-3',
      applicationId: 'app-4',
      eventType: 'STATUS_CHANGED',
      eventData: { fromStatus: 'SCREENING', toStatus: 'REJECTED', note: 'No response after resubmission request.' },
      createdAt: '2026-07-04T09:30:00Z',
    },
    {
      id: 'evt-4-2',
      applicationId: 'app-4',
      eventType: 'STATUS_CHANGED',
      eventData: { fromStatus: 'APPLIED', toStatus: 'SCREENING', note: undefined },
      createdAt: '2026-06-30T10:00:00Z',
    },
    {
      id: 'evt-4-1',
      applicationId: 'app-4',
      eventType: 'APPLICATION_CREATED',
      eventData: null,
      createdAt: '2026-06-28T12:00:00Z',
    },
  ],
  'app-5': [
    {
      id: 'evt-5-5',
      applicationId: 'app-5',
      eventType: 'STATUS_CHANGED',
      eventData: { fromStatus: 'OFFER', toStatus: 'HIRED', note: 'Offer accepted, start date confirmed.' },
      createdAt: '2026-07-02T17:00:00Z',
    },
    {
      id: 'evt-5-4',
      applicationId: 'app-5',
      eventType: 'STATUS_CHANGED',
      eventData: { fromStatus: 'INTERVIEWING', toStatus: 'OFFER', note: undefined },
      createdAt: '2026-06-25T15:00:00Z',
    },
    {
      id: 'evt-5-3',
      applicationId: 'app-5',
      eventType: 'STATUS_CHANGED',
      eventData: { fromStatus: 'SCREENING', toStatus: 'INTERVIEWING', note: undefined },
      createdAt: '2026-06-18T10:00:00Z',
    },
    {
      id: 'evt-5-2',
      applicationId: 'app-5',
      eventType: 'STATUS_CHANGED',
      eventData: { fromStatus: 'APPLIED', toStatus: 'SCREENING', note: undefined },
      createdAt: '2026-06-12T09:00:00Z',
    },
    {
      id: 'evt-5-1',
      applicationId: 'app-5',
      eventType: 'APPLICATION_CREATED',
      eventData: null,
      createdAt: '2026-06-10T09:00:00Z',
    },
  ],
};

export function findMockApplicationIndex(id: string): number {
  return MOCK_APPLICATIONS.findIndex((application) => application.id === id);
}

let mockApplicationSequence = MOCK_APPLICATIONS.length;

export function nextMockApplicationId(): string {
  mockApplicationSequence += 1;
  return `app-${mockApplicationSequence}`;
}

let mockApplicationEventSequence = 100;

export function nextMockApplicationEventId(): string {
  mockApplicationEventSequence += 1;
  return `evt-${mockApplicationEventSequence}`;
}
