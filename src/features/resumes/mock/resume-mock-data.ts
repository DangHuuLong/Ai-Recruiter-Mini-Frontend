// Mock dataset backing resume.api.ts while the API calls are temporarily commented out
// for static-UI review. Shape mirrors the real `Resume` type + parsed-CV data shape
// expected by resume-parsed-data.tsx (see parsed-resume-data.util.ts).
import type { Resume } from '@/features/resumes/types/resume.type';

const MOCK_PARSED_CV_SARAH = {
  personal: {
    name: 'Jordan Whittaker',
    email: 'j.whittaker@techflow.io',
    phone: '+1 (555) 234-9871',
    location: 'San Francisco, CA',
  },
  summary:
    'Dynamic and detail-oriented Senior Software Engineer with over 8 years of experience building scalable web applications. Expert in modern frontend frameworks and distributed backend architectures. Proven track record leading cross-functional teams under tight deadlines.',
  skills: [
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'React.js', category: 'Frontend' },
    { name: 'Python', category: 'Backend' },
    { name: 'Golang', category: 'Backend' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'Docker', category: 'DevOps' },
  ],
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'TechFlow Systems',
      duration: '2019 - Present',
      description:
        'Lead developer for the core data orchestration platform. Migrated monolithic architecture to microservices, reducing deployment cycles by 40%. Mentored a team of 12 engineers.',
      technologies: ['Go', 'Kubernetes', 'gRPC'],
    },
    {
      title: 'Software Developer',
      company: 'Creative Digital Labs',
      duration: '2017 - 2019',
      description:
        'Developed responsive web applications for international FinTech clients. Focused on performance optimization and accessibility, achieving 95+ Lighthouse scores.',
      technologies: ['React', 'TypeScript', 'D3.js'],
    },
  ],
  education: [
    {
      institution: 'Stanford University',
      degree: 'M.S.',
      field_of_study: 'Computer Science',
      start_year: 2015,
      end_year: 2017,
      description: 'Specialization in Distributed Systems and Cloud Computing.',
    },
    {
      institution: 'UC Berkeley',
      degree: 'B.S.',
      field_of_study: 'Software Engineering',
      start_year: 2011,
      end_year: 2015,
    },
  ],
  projects: [
    {
      name: 'Open-Source Log Parser',
      description: 'High-performance log processing library in Rust. 2k+ stars on GitHub.',
      technologies: ['Rust', 'Zero-Copy'],
    },
    {
      name: 'Retail Predict AI',
      description: 'Predictive analytics dashboard for inventory management using TensorFlow.',
      technologies: ['Python', 'ML'],
    },
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect', proficiency: 'Professional Level · 2025' },
    { name: 'CompTIA Security+', proficiency: 'Information Security · 2024' },
  ],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'French', proficiency: 'Professional' },
  ],
};

const MOCK_PARSED_CV_MARCUS = {
  personal: {
    name: 'Marcus Chen',
    email: 'm.chen@globalai.com',
    phone: '+65 9123 4567',
    location: 'Singapore',
  },
  summary:
    'Product-minded Data Scientist with 6 years of experience turning messy data into decisions. Comfortable across the stack from ETL pipelines to stakeholder-facing dashboards.',
  skills: [
    { name: 'Python', category: 'Data' },
    { name: 'SQL', category: 'Data' },
    { name: 'PyTorch', category: 'ML' },
    { name: 'Airflow', category: 'Data Engineering' },
  ],
  experience: [
    {
      title: 'Senior Data Scientist',
      company: 'GlobalAI',
      duration: '2021 - Present',
      description: 'Built churn-prediction models used across 4 product lines, improving retention by 8%.',
      technologies: ['PyTorch', 'Airflow', 'BigQuery'],
    },
  ],
  education: [
    {
      institution: 'National University of Singapore',
      degree: 'B.Comp',
      field_of_study: 'Computer Science',
      start_year: 2014,
      end_year: 2018,
    },
  ],
  projects: [],
  certifications: [],
  languages: [
    { name: 'English', proficiency: 'Fluent' },
    { name: 'Mandarin', proficiency: 'Native' },
  ],
};

export const MOCK_RESUMES: Resume[] = [
  {
    id: 'res-1',
    candidateId: 'cand-1',
    fileAssetId: 'file-1',
    rawText: 'Jordan Whittaker — Senior Software Engineer resume raw text...',
    parsedData: MOCK_PARSED_CV_SARAH,
    parseStatus: 'SUCCESS',
    parserVersion: 'v2.4.1',
    parsingError: null,
    uploadedAt: '2026-07-01T10:00:00Z',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-01T10:05:00Z',
    fileAsset: {
      id: 'file-1',
      fileName: 'Jordan_Whittaker_CV.pdf',
      originalFileUrl: 'https://example.com/files/jordan-whittaker-cv.pdf',
      storageKey: 'resumes/cand-1/jordan-whittaker-cv.pdf',
      fileType: 'PDF',
      fileSizeBytes: 245_760,
      checksum: 'mock-checksum-1',
      bucket: 'cv-files',
      status: 'ACTIVE',
      uploadedAt: '2026-07-01T10:00:00Z',
    },
  },
  {
    id: 'res-2',
    candidateId: 'cand-1',
    fileAssetId: 'file-2',
    rawText: null,
    parsedData: null,
    parseStatus: 'PENDING',
    parserVersion: null,
    parsingError: null,
    uploadedAt: '2026-07-15T09:00:00Z',
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-07-15T09:00:00Z',
    fileAsset: {
      id: 'file-2',
      fileName: 'Cover_Letter_TechFlow.docx',
      originalFileUrl: 'https://example.com/files/cover-letter.docx',
      storageKey: 'resumes/cand-1/cover-letter.docx',
      fileType: 'DOCX',
      fileSizeBytes: 51_200,
      checksum: 'mock-checksum-2',
      bucket: 'cv-files',
      status: 'ACTIVE',
      uploadedAt: '2026-07-15T09:00:00Z',
    },
  },
  {
    id: 'res-3',
    candidateId: 'cand-3',
    fileAssetId: 'file-3',
    rawText: 'Marcus Chen — Senior Data Scientist resume raw text...',
    parsedData: MOCK_PARSED_CV_MARCUS,
    parseStatus: 'SUCCESS',
    parserVersion: 'v2.4.1',
    parsingError: null,
    uploadedAt: '2026-07-10T08:30:00Z',
    createdAt: '2026-07-10T08:30:00Z',
    updatedAt: '2026-07-10T08:35:00Z',
    fileAsset: {
      id: 'file-3',
      fileName: 'Marcus_Chen_Resume.pdf',
      originalFileUrl: 'https://example.com/files/marcus-chen-resume.pdf',
      storageKey: 'resumes/cand-3/marcus-chen-resume.pdf',
      fileType: 'PDF',
      fileSizeBytes: 198_400,
      checksum: 'mock-checksum-3',
      bucket: 'cv-files',
      status: 'ACTIVE',
      uploadedAt: '2026-07-10T08:30:00Z',
    },
  },
  {
    id: 'res-4',
    candidateId: 'cand-2',
    fileAssetId: 'file-4',
    rawText: null,
    parsedData: null,
    parseStatus: 'PROCESSING',
    parserVersion: null,
    parsingError: null,
    uploadedAt: '2026-07-20T14:00:00Z',
    createdAt: '2026-07-20T14:00:00Z',
    updatedAt: '2026-07-20T14:00:00Z',
    fileAsset: {
      id: 'file-4',
      fileName: 'Sarah_AlFayed_Portfolio_CV.pdf',
      originalFileUrl: 'https://example.com/files/sarah-cv.pdf',
      storageKey: 'resumes/cand-2/sarah-cv.pdf',
      fileType: 'PDF',
      fileSizeBytes: 312_000,
      checksum: 'mock-checksum-4',
      bucket: 'cv-files',
      status: 'ACTIVE',
      uploadedAt: '2026-07-20T14:00:00Z',
    },
  },
  {
    id: 'res-5',
    candidateId: 'cand-4',
    fileAssetId: 'file-5',
    rawText: 'Corrupted or unsupported content...',
    parsedData: null,
    parseStatus: 'FAILED',
    parserVersion: 'v2.4.1',
    parsingError: 'Unable to detect resume sections — file may be a scanned image without a text layer.',
    uploadedAt: '2026-07-18T11:00:00Z',
    createdAt: '2026-07-18T11:00:00Z',
    updatedAt: '2026-07-18T11:02:00Z',
    fileAsset: {
      id: 'file-5',
      fileName: 'invalid_upload.pdf',
      originalFileUrl: 'https://example.com/files/invalid-upload.pdf',
      storageKey: 'resumes/cand-4/invalid-upload.pdf',
      fileType: 'PDF',
      fileSizeBytes: 89_120,
      checksum: 'mock-checksum-5',
      bucket: 'cv-files',
      status: 'ACTIVE',
      uploadedAt: '2026-07-18T11:00:00Z',
    },
  },
];

export function findMockResumeIndex(id: string): number {
  return MOCK_RESUMES.findIndex((resume) => resume.id === id);
}

let mockResumeSequence = MOCK_RESUMES.length;

export function nextMockResumeId(): string {
  mockResumeSequence += 1;
  return `res-${mockResumeSequence}`;
}
