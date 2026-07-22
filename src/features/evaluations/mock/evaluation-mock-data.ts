// Mock dataset backing evaluation.api.ts while the API calls are temporarily commented
// out for static-UI review. Shape mirrors the real `Evaluation` type exactly,
// cross-referencing the Applications mock data so "View application" links resolve to
// real mock records.
import { MOCK_APPLICATIONS } from '@/features/applications/mock/application-mock-data';
import type {
  Evaluation,
  EvaluationCriterionScore,
  EvaluationInterviewQuestion,
  EvaluationSkill,
} from '@/features/evaluations/types/evaluation.type';

function application(id: string) {
  return MOCK_APPLICATIONS.find((item) => item.id === id);
}

function criterionScores(evaluationId: string): EvaluationCriterionScore[] {
  return [
    {
      id: `${evaluationId}-crit-1`,
      evaluationId,
      criterion: 'SKILLS_MATCH',
      weight: 0.35,
      scoreNormalized: 0.86,
      reason: 'Strong overlap with required backend and cloud skills, minor gaps in observability tooling.',
      evidence: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    },
    {
      id: `${evaluationId}-crit-2`,
      evaluationId,
      criterion: 'EXPERIENCE_RELEVANCE',
      weight: 0.25,
      scoreNormalized: 0.78,
      reason: '5+ years in comparable backend roles across fintech and e-commerce domains.',
      evidence: ['5 years backend engineering', '2 years technical leadership'],
    },
    {
      id: `${evaluationId}-crit-3`,
      evaluationId,
      criterion: 'PROJECT_RELEVANCE',
      weight: 0.2,
      scoreNormalized: 0.72,
      reason: 'Led payment platform rebuild; comparable scale and domain to the target role.',
      evidence: ['Payment platform microservices migration'],
    },
    {
      id: `${evaluationId}-crit-4`,
      evaluationId,
      criterion: 'EDUCATION_CERTIFICATION',
      weight: 0.1,
      scoreNormalized: 0.9,
      reason: 'BSc in Computer Science plus an AWS certification aligned with the role.',
      evidence: ['B.Sc. Computer Science', 'AWS Certified Solutions Architect'],
    },
    {
      id: `${evaluationId}-crit-5`,
      evaluationId,
      criterion: 'KEYWORD_DOMAIN_ALIGNMENT',
      weight: 0.1,
      scoreNormalized: 0.68,
      reason: 'Domain vocabulary partially aligned; limited direct fintech compliance experience.',
      evidence: ['microservices', 'distributed systems'],
    },
  ];
}

function skills(evaluationId: string): EvaluationSkill[] {
  return [
    {
      id: `${evaluationId}-skill-1`,
      evaluationId,
      skillName: 'Node.js',
      normalizedSkillName: 'node.js',
      type: 'MATCHED',
      importance: 'CORE',
      note: 'Demonstrated across multiple production projects.',
      evidence: ['5 years using Node.js/Express in production'],
    },
    {
      id: `${evaluationId}-skill-2`,
      evaluationId,
      skillName: 'PostgreSQL',
      normalizedSkillName: 'postgresql',
      type: 'MATCHED',
      importance: 'CORE',
      note: 'Designed and optimized schemas for high-traffic services.',
      evidence: ['Query optimization for payment ledger tables'],
    },
    {
      id: `${evaluationId}-skill-3`,
      evaluationId,
      skillName: 'Kubernetes',
      normalizedSkillName: 'kubernetes',
      type: 'MISSING',
      importance: 'PREFERRED',
      note: 'No direct evidence of Kubernetes experience in resume.',
    },
    {
      id: `${evaluationId}-skill-4`,
      evaluationId,
      skillName: 'GraphQL',
      normalizedSkillName: 'graphql',
      type: 'RELATED',
      importance: 'NICE_TO_HAVE',
      note: 'Has REST API design experience; no direct GraphQL evidence.',
    },
  ];
}

function interviewQuestions(evaluationId: string): EvaluationInterviewQuestion[] {
  return [
    {
      id: `${evaluationId}-q-1`,
      evaluationId,
      question: 'Walk us through how you designed the payment platform migration to microservices. What were the biggest data-consistency challenges?',
      category: 'System Design',
      linkedSkill: 'Node.js',
      difficulty: 'HARD',
      rationale: 'Validates depth of the flagship project mentioned in the resume.',
      displayOrder: 1,
    },
    {
      id: `${evaluationId}-q-2`,
      evaluationId,
      question: 'You have no listed Kubernetes experience — how would you approach ramping up on container orchestration for this role?',
      category: 'Skill Gap',
      linkedSkill: 'Kubernetes',
      difficulty: 'MEDIUM',
      rationale: 'Probes the missing skill identified during scoring.',
      displayOrder: 2,
    },
    {
      id: `${evaluationId}-q-3`,
      evaluationId,
      question: 'Describe a time you had to optimize a slow PostgreSQL query in production. What tools did you use to diagnose it?',
      category: 'Technical Depth',
      linkedSkill: 'PostgreSQL',
      difficulty: 'MEDIUM',
      rationale: 'Confirms hands-on database performance experience.',
      displayOrder: 3,
    },
  ];
}

export const MOCK_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval-1',
    applicationId: 'app-1',
    configId: null,
    createdById: 'user-1',
    status: 'COMPLETED',
    overallScore: 81.4,
    summary: 'Strong technical match for the backend role with proven experience in comparable systems.',
    explanation: 'Candidate demonstrates strong alignment on core skills and relevant project experience, with a minor gap in container orchestration tooling.',
    skillGapSummary: 'Missing hands-on Kubernetes experience; otherwise well aligned with the role requirements.',
    modelProvider: 'openai',
    modelName: 'gpt-4o-mini',
    modelVersion: '2024-07-18',
    promptVersion: 'v3',
    startedAt: '2026-07-18T14:05:00Z',
    completedAt: '2026-07-18T14:06:12Z',
    createdAt: '2026-07-18T14:05:00Z',
    updatedAt: '2026-07-18T14:06:12Z',
    application: application('app-1'),
    criterionScores: criterionScores('eval-1'),
    skills: skills('eval-1'),
    interviewQuestionRows: interviewQuestions('eval-1'),
    evidenceMap: {
      matched_skill_names: ['Node.js', 'PostgreSQL'],
      missing_skill_names: ['Kubernetes'],
      weak_points: ['No direct fintech compliance experience'],
    },
  },
  {
    id: 'eval-2',
    applicationId: 'app-4',
    configId: null,
    createdById: 'user-1',
    status: 'FAILED',
    overallScore: null,
    summary: null,
    explanation: null,
    skillGapSummary: null,
    modelProvider: 'openai',
    modelName: 'gpt-4o-mini',
    modelVersion: '2024-07-18',
    promptVersion: 'v3',
    evaluationError: 'Resume parsing failed twice — insufficient parsed data to run scoring.',
    startedAt: '2026-07-04T09:35:00Z',
    completedAt: '2026-07-04T09:35:40Z',
    createdAt: '2026-07-04T09:35:00Z',
    updatedAt: '2026-07-04T09:35:40Z',
    application: application('app-4'),
    criterionScores: [],
    skills: [],
    interviewQuestionRows: [],
    evidenceMap: null,
  },
  {
    id: 'eval-3',
    applicationId: 'app-5',
    configId: null,
    createdById: 'user-1',
    status: 'COMPLETED',
    overallScore: 92.7,
    summary: 'Excellent match — exceeds requirements on core skills and project scale.',
    explanation: 'Candidate has directly relevant experience at comparable scale, with strong domain alignment.',
    skillGapSummary: 'No significant skill gaps identified.',
    modelProvider: 'openai',
    modelName: 'gpt-4o-mini',
    modelVersion: '2024-07-18',
    promptVersion: 'v3',
    startedAt: '2026-06-11T10:00:00Z',
    completedAt: '2026-06-11T10:01:05Z',
    createdAt: '2026-06-11T10:00:00Z',
    updatedAt: '2026-06-11T10:01:05Z',
    application: application('app-5'),
    criterionScores: criterionScores('eval-3').map((score) => ({ ...score, scoreNormalized: Math.min(1, score.scoreNormalized + 0.08) })),
    skills: skills('eval-3').map((skill) => (skill.skillName === 'Kubernetes' ? { ...skill, type: 'MATCHED' as const, note: 'Ran production clusters at previous role.' } : skill)),
    interviewQuestionRows: interviewQuestions('eval-3'),
    evidenceMap: {
      matched_skill_names: ['Node.js', 'PostgreSQL', 'Kubernetes'],
      missing_skill_names: [],
      weak_points: [],
    },
  },
];

export function findMockEvaluationIndex(id: string): number {
  return MOCK_EVALUATIONS.findIndex((evaluation) => evaluation.id === id);
}

let mockEvaluationSequence = MOCK_EVALUATIONS.length;

export function nextMockEvaluationId(): string {
  mockEvaluationSequence += 1;
  return `eval-${mockEvaluationSequence}`;
}

export function buildMockEvaluationResult(id: string, applicationId: string): Evaluation {
  const now = new Date().toISOString();
  return {
    id,
    applicationId,
    configId: null,
    createdById: 'user-1',
    status: 'COMPLETED',
    overallScore: 74.5,
    summary: 'Solid candidate with good foundational skills for the role.',
    explanation: 'Newly generated mock evaluation — scored using the same rubric as the existing dataset.',
    skillGapSummary: 'Some gaps in advanced tooling, core skills well covered.',
    modelProvider: 'openai',
    modelName: 'gpt-4o-mini',
    modelVersion: '2024-07-18',
    promptVersion: 'v3',
    startedAt: now,
    completedAt: now,
    createdAt: now,
    updatedAt: now,
    application: application(applicationId),
    criterionScores: criterionScores(id),
    skills: skills(id),
    interviewQuestionRows: interviewQuestions(id),
    evidenceMap: {
      matched_skill_names: ['Node.js', 'PostgreSQL'],
      missing_skill_names: ['Kubernetes'],
      weak_points: [],
    },
  };
}
