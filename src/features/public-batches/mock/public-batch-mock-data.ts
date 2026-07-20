// Mirrors the real shape returned by GET /public/batches/:id (ScoringBatchResult rows,
// mapped via ScoringResultMapperService — criteria/skills/interviewQuestions are exactly
// MappedCriterion[]/MappedSkill[]/MappedInterviewQuestion[] from the backend).

export type CriterionName =
  | 'SKILLS_MATCH'
  | 'EXPERIENCE_RELEVANCE'
  | 'PROJECT_RELEVANCE'
  | 'EDUCATION_CERTIFICATION'
  | 'KEYWORD_DOMAIN_ALIGNMENT';

export type SkillMatchType = 'MATCHED' | 'MISSING' | 'RELATED';
export type SkillImportance = 'LOW' | 'MEDIUM' | 'HIGH';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type MockCriterion = {
  criterion: CriterionName;
  weight: number;
  scoreNormalized: number;
  reason: string;
};

export type MockSkill = {
  skillName: string;
  normalizedSkillName: string;
  type: SkillMatchType;
  importance: SkillImportance;
  evidence: string | null;
  note: string | null;
};

export type MockInterviewQuestion = {
  question: string;
  category: string;
  linkedSkill: string | null;
  difficulty: QuestionDifficulty;
  rationale: string;
  displayOrder: number;
};

export type MockCell = {
  resumeItemId: string;
  jdItemId: string;
  status: 'COMPLETED';
  overallScore: number;
  summary: string;
  criteria: MockCriterion[];
  skills: MockSkill[];
  interviewQuestions: MockInterviewQuestion[];
};

export const CRITERION_LABELS: Record<CriterionName, string> = {
  SKILLS_MATCH: 'Skills Match',
  EXPERIENCE_RELEVANCE: 'Experience Relevance',
  PROJECT_RELEVANCE: 'Project Relevance',
  EDUCATION_CERTIFICATION: 'Education/Certification',
  KEYWORD_DOMAIN_ALIGNMENT: 'Keyword/Domain Alignment',
};

export const MOCK_RESUMES = [
  { id: 'r1', name: 'Alex Johnson' },
  { id: 'r2', name: 'Priya Sharma' },
];

export const MOCK_JOB_DESCRIPTIONS = [
  { id: 'jd1', title: 'Senior Backend Engineer' },
  { id: 'jd2', title: 'Product Designer' },
  { id: 'jd3', title: 'Data Analyst' },
];

const CRITERIA_WEIGHTS: Record<CriterionName, number> = {
  SKILLS_MATCH: 0.4,
  EXPERIENCE_RELEVANCE: 0.3,
  PROJECT_RELEVANCE: 0.15,
  EDUCATION_CERTIFICATION: 0.1,
  KEYWORD_DOMAIN_ALIGNMENT: 0.05,
};

const SCORES: Record<string, number> = {
  'r1:jd1': 88,
  'r1:jd2': 33,
  'r1:jd3': 61,
  'r2:jd1': 54,
  'r2:jd2': 91,
  'r2:jd3': 73,
};

export function getMockCell(resumeId: string, jdId: string): MockCell {
  const score = SCORES[`${resumeId}:${jdId}`] ?? 50;
  const normalized = score / 100;

  const criteria: MockCriterion[] = (Object.keys(CRITERIA_WEIGHTS) as CriterionName[]).map(
    (criterion, index) => ({
      criterion,
      weight: CRITERIA_WEIGHTS[criterion],
      scoreNormalized: Math.max(0.1, Math.min(1, normalized + (index % 2 === 0 ? 0.05 : -0.08))),
      reason: `${CRITERION_LABELS[criterion]} assessed against the job description requirements.`,
    }),
  );

  const isStrongMatch = score >= 70;

  const skills: MockSkill[] = isStrongMatch
    ? [
        { skillName: 'TypeScript', normalizedSkillName: 'typescript', type: 'MATCHED', importance: 'HIGH', evidence: 'Used across 3 listed projects.', note: null },
        { skillName: 'React', normalizedSkillName: 'react', type: 'MATCHED', importance: 'HIGH', evidence: 'Primary frontend framework in most recent role.', note: null },
        { skillName: 'Node.js', normalizedSkillName: 'node.js', type: 'MATCHED', importance: 'MEDIUM', evidence: 'Backend API work mentioned.', note: null },
        { skillName: 'Kubernetes', normalizedSkillName: 'kubernetes', type: 'MISSING', importance: 'MEDIUM', evidence: null, note: 'Not mentioned anywhere in the resume.' },
      ]
    : [
        { skillName: 'Communication', normalizedSkillName: 'communication', type: 'RELATED', importance: 'MEDIUM', evidence: 'Inferred from team collaboration mentions.', note: null },
        { skillName: 'SQL', normalizedSkillName: 'sql', type: 'MISSING', importance: 'HIGH', evidence: null, note: 'Required skill not found in resume.' },
        { skillName: 'Data Visualization', normalizedSkillName: 'data-visualization', type: 'MISSING', importance: 'MEDIUM', evidence: null, note: null },
      ];

  const interviewQuestions: MockInterviewQuestion[] = [
    {
      question: 'Walk me through a recent project most similar to this role.',
      category: 'Experience Relevance',
      linkedSkill: null,
      difficulty: 'MEDIUM',
      rationale: 'Validates hands-on experience relevant to this JD.',
      displayOrder: 1,
    },
    {
      question: 'How would you approach learning a tool you have never used before, like Kubernetes?',
      category: 'Skill Gap',
      linkedSkill: isStrongMatch ? 'Kubernetes' : 'SQL',
      difficulty: 'EASY',
      rationale: 'Probes how the candidate handles a known missing skill.',
      displayOrder: 2,
    },
    {
      question: 'Describe a time you had to prioritize under a tight deadline.',
      category: 'Behavioral',
      linkedSkill: null,
      difficulty: 'EASY',
      rationale: 'General fit and working-style signal.',
      displayOrder: 3,
    },
  ];

  return {
    resumeItemId: resumeId,
    jdItemId: jdId,
    status: 'COMPLETED',
    overallScore: score,
    summary: isStrongMatch
      ? 'Strong alignment with the core requirements of this role.'
      : 'Partial alignment — some core requirements are not clearly evidenced.',
    criteria,
    skills,
    interviewQuestions,
  };
}

export type ScoreTier = {
  label: 'Excellent' | 'Strong' | 'Moderate' | 'Weak' | 'Poor';
  containerClass: string;
  textClass: string;
};

export function getScoreTier(score: number): ScoreTier {
  if (score >= 85) return { label: 'Excellent', containerClass: 'bg-emerald-100', textClass: 'text-emerald-700' };
  if (score >= 70) return { label: 'Strong', containerClass: 'bg-lime-100', textClass: 'text-lime-700' };
  if (score >= 55) return { label: 'Moderate', containerClass: 'bg-amber-100', textClass: 'text-amber-700' };
  if (score >= 40) return { label: 'Weak', containerClass: 'bg-orange-100', textClass: 'text-orange-700' };
  return { label: 'Poor', containerClass: 'bg-red-100', textClass: 'text-red-700' };
}
