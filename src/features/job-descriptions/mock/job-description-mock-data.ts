// Mock dataset backing job-description.api.ts while the API calls are temporarily
// commented out for static-UI review. Shape mirrors the real `JobDescription` type
// (including `ParsedJobDescriptionData` and `JobSkill`) exactly.
import type { JobDescription, JobSkill } from '@/features/job-descriptions/types/job-description.type';

const MOCK_JD_SKILLS_1: JobSkill[] = [
  { id: 'jdskill-1', jobDescriptionId: 'jd-1', name: 'TypeScript', normalizedName: 'typescript', type: 'REQUIRED', isCore: true, weightHint: 10, createdAt: '2026-07-01T09:00:00Z' },
  { id: 'jdskill-2', jobDescriptionId: 'jd-1', name: 'React.js', normalizedName: 'react', type: 'REQUIRED', isCore: true, weightHint: 9, createdAt: '2026-07-01T09:00:00Z' },
  { id: 'jdskill-3', jobDescriptionId: 'jd-1', name: 'Node.js', normalizedName: 'nodejs', type: 'REQUIRED', isCore: false, weightHint: 8, createdAt: '2026-07-01T09:00:00Z' },
  { id: 'jdskill-4', jobDescriptionId: 'jd-1', name: 'PostgreSQL', normalizedName: 'postgresql', type: 'REQUIRED', isCore: false, weightHint: 7, createdAt: '2026-07-01T09:00:00Z' },
  { id: 'jdskill-5', jobDescriptionId: 'jd-1', name: 'PyTorch', normalizedName: 'pytorch', type: 'PREFERRED', isCore: false, weightHint: 4, createdAt: '2026-07-01T09:00:00Z' },
  { id: 'jdskill-6', jobDescriptionId: 'jd-1', name: 'Docker', normalizedName: 'docker', type: 'PREFERRED', isCore: false, weightHint: 5, createdAt: '2026-07-01T09:00:00Z' },
];

export const MOCK_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'jd-1',
    createdById: 'user-1',
    title: 'Senior Full-Stack Engineer (AI/ML)',
    companyName: 'Synthetix Cloud Systems',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    employmentType: 'Full-time',
    seniority: 'Senior (5+ Years)',
    rawText:
      'ABOUT SYNTHETIX CLOUD SYSTEMS\nWe are looking for a Senior Full-Stack Engineer with a passion for AI-driven infrastructure. You will be responsible for building high-performance web applications that interact with our proprietary LLM fine-tuning engine.\n\nRESPONSIBILITIES:\n- Design and implement scalable APIs in Node.js and Go.\n- Build intuitive front-end interfaces using React and Tailwind CSS.\n- Optimize DB queries for massive vector datasets (Pinecone, PGVector).\n- Collaborate with ML engineers to integrate inference pipelines.\n\nREQUIREMENTS:\n- 5+ years full-stack experience.\n- Mastery of TypeScript & React.\n- Cloud platform experience (AWS/GCP).\n- REST & GraphQL expertise.\n\nNICE TO HAVE:\n- PyTorch / TensorFlow basics.\n- Open-source contributions.\n- Fintech/Startup background.',
    parsedData: {
      title: 'Full-Stack Engineer',
      seniority: 'Senior',
      employment_type: 'Permanent',
      responsibilities: [
        'Design and implement scalable APIs',
        'Build React/Tailwind front-ends',
        'Optimize vector database queries',
        'Integrate inference pipelines',
      ],
      requirements: [
        '5+ years full-stack experience',
        'Mastery of TypeScript & React',
        'Cloud platform (AWS/GCP)',
        'REST & GraphQL expertise',
      ],
      nice_to_have: ['PyTorch / TensorFlow basics', 'Open-source contributions', 'Fintech/Startup background'],
      required_skills: [
        { name: 'TypeScript', normalized_name: 'ts_lang', is_core: true, weight_hint: 1 },
        { name: 'React.js', normalized_name: 'react_framework', is_core: true, weight_hint: 0.9 },
        { name: 'Node.js', normalized_name: 'nodejs_env', is_core: false, weight_hint: 0.8 },
        { name: 'PostgreSQL', normalized_name: 'postgres_db', is_core: false, weight_hint: 0.7 },
      ],
      preferred_skills: [
        { name: 'PyTorch', normalized_name: 'pytorch_ml', is_core: false, weight_hint: 0.4 },
        { name: 'Docker', normalized_name: 'docker_engine', is_core: false, weight_hint: 0.5 },
      ],
      min_experience_years: 5,
      education_requirement: 'BSc Computer Science',
      domain_keywords: ['Cloud Infrastructure', 'Vector Search', 'LLM Orchestration', 'Scalable APIs', 'Frontend UX'],
    },
    parserVersion: 'v2.4.1',
    parseStatus: 'SUCCESS',
    parsingError: null,
    isActive: true,
    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-07-10T10:00:00Z',
    skills: MOCK_JD_SKILLS_1,
    _count: { applications: 6, skills: MOCK_JD_SKILLS_1.length },
  },
  {
    id: 'jd-2',
    createdById: 'user-1',
    title: 'AI Product Manager',
    companyName: 'Nexus Intelligence',
    department: 'Product',
    location: 'Austin, TX',
    employmentType: 'Contract',
    seniority: 'Principal',
    rawText:
      'Nexus Intelligence is hiring a Principal Product Manager to own our AI-assisted recruiting roadmap. You will partner with engineering and design to ship data-driven features.\n\nRESPONSIBILITIES:\n- Define product roadmap for AI matching features.\n- Run discovery interviews with enterprise customers.\n- Partner with data science on model evaluation criteria.\n\nREQUIREMENTS:\n- 8+ years product management experience.\n- Track record shipping ML-powered products.',
    parsedData: null,
    parserVersion: null,
    parseStatus: 'PENDING',
    parsingError: null,
    isActive: false,
    createdAt: '2026-06-20T11:00:00Z',
    updatedAt: '2026-06-20T11:00:00Z',
    skills: [],
    _count: { applications: 2, skills: 0 },
  },
  {
    id: 'jd-3',
    createdById: 'user-1',
    title: 'Cybersecurity Specialist',
    companyName: 'Global Guard Inc.',
    department: 'Security',
    location: 'Remote',
    employmentType: 'Full-time',
    seniority: 'Mid-Level',
    rawText:
      'Global Guard Inc. seeks a Cybersecurity Specialist to strengthen our detection and response capabilities across cloud infrastructure.\n\nRESPONSIBILITIES:\n- Monitor SIEM alerts and triage incidents.\n- Conduct vulnerability assessments.\n- Maintain compliance documentation.\n\nREQUIREMENTS:\n- 3+ years in a SOC or security engineering role.\n- Familiarity with AWS security tooling.',
    parsedData: null,
    parserVersion: 'v2.4.1',
    parseStatus: 'FAILED',
    parsingError: 'Parser failed on section 4: "Benefits & Perks" — unexpected formatting in the compensation structure.',
    isActive: true,
    createdAt: '2026-06-25T13:00:00Z',
    updatedAt: '2026-07-02T15:00:00Z',
    skills: [],
    _count: { applications: 1, skills: 0 },
  },
];

export function findMockJobDescriptionIndex(id: string): number {
  return MOCK_JOB_DESCRIPTIONS.findIndex((jobDescription) => jobDescription.id === id);
}

let mockJobDescriptionSequence = MOCK_JOB_DESCRIPTIONS.length;

export function nextMockJobDescriptionId(): string {
  mockJobDescriptionSequence += 1;
  return `jd-${mockJobDescriptionSequence}`;
}

let mockJobSkillSequence = 100;

export function nextMockJobSkillId(): string {
  mockJobSkillSequence += 1;
  return `jdskill-${mockJobSkillSequence}`;
}
