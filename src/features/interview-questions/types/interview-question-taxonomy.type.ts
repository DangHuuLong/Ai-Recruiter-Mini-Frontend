// Mirrors src/common/constants/interview-question-taxonomy.ts from Ai-Recruiter-Mini-Backend
// exactly (values must match verbatim — POST /interview-questions/search validates
// specialization against this list server-side and 400s on any mismatch, case-sensitive).
// The backend scopes specializations/enablers/businessContexts per occupationFamily only
// (not per specialization), so this mirrors that same flat shape.

export type OccupationFamily = 'IT' | 'MARKETING' | 'DESIGN' | 'DATA' | 'PRODUCT' | 'SALES' | 'LEGAL';

export const OCCUPATION_FAMILY_LABELS: Record<OccupationFamily, string> = {
  IT: 'IT / Software Engineering',
  MARKETING: 'Marketing',
  DESIGN: 'Design',
  DATA: 'Data',
  PRODUCT: 'Product',
  SALES: 'Sales',
  LEGAL: 'Legal',
};

type TaxonomyEntry = {
  specializations: string[];
  enablers: string[];
  businessContexts: string[];
};

export const INTERVIEW_QUESTION_TAXONOMY: Record<OccupationFamily, TaxonomyEntry> = {
  IT: {
    specializations: ['Backend', 'Frontend', 'Mobile', 'DevOps/SRE', 'QA/Testing', 'Data Engineering', 'Security'],
    enablers: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    businessContexts: ['E-commerce', 'SaaS B2B', 'Fintech', 'Booking/Marketplace', 'CMS', 'IoT'],
  },
  MARKETING: {
    specializations: [
      'Performance Marketing',
      'Content Marketing',
      'Brand Marketing',
      'SEO',
      'Social Media',
      'Marketing Automation',
    ],
    enablers: ['Google Ads', 'Meta Ads', 'GA4', 'SEMrush/Ahrefs', 'HubSpot'],
    businessContexts: ['B2B Lead Generation', 'Product Launch', 'Brand Awareness', 'Retention/Loyalty', 'E-commerce Growth'],
  },
  DESIGN: {
    specializations: ['UI/UX Design', 'Graphic Design', 'Brand/Visual Identity', 'Motion Graphics', 'Product Design'],
    enablers: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'After Effects', 'Design System'],
    businessContexts: ['Rebranding', 'UI Redesign', 'Mobile App Design', 'Packaging Design', 'Design System Build'],
  },
  DATA: {
    specializations: ['Data Analyst', 'BI Engineer', 'Data Scientist', 'Data Engineer'],
    enablers: ['SQL', 'Power BI', 'Tableau', 'Python/Pandas', 'Looker Studio'],
    businessContexts: ['Sales Dashboard', 'Churn Analysis', 'A/B Test Analysis', 'Financial Reporting Automation'],
  },
  PRODUCT: {
    specializations: ['B2B Product', 'B2C Product', 'Growth PM', 'Technical PM'],
    enablers: ['Jira', 'Notion', 'Amplitude', 'Mixpanel', 'A/B Testing Framework'],
    businessContexts: ['New Feature Launch', 'Product-Market Fit Discovery', 'Platform Migration', 'Growth Loop Design'],
  },
  SALES: {
    specializations: ['Enterprise Sales', 'Inside Sales', 'Channel Sales', 'Account Management'],
    enablers: ['Salesforce', 'HubSpot CRM', 'SPIN Selling', 'Apollo', 'Lemlist'],
    businessContexts: ['New Market Entry', 'Enterprise Deal Closing', 'Key Account Management', 'Churn Reduction'],
  },
  LEGAL: {
    specializations: ['Contract/Commercial Law', 'Compliance', 'IP Law', 'Labor Law'],
    enablers: ['Contract Management Software', 'Due Diligence Checklist'],
    businessContexts: ['M&A Due Diligence', 'Contract Negotiation', 'Compliance Audit', 'IP Registration'],
  },
};

export function getSpecializationsFor(family: OccupationFamily | ''): string[] {
  if (!family) return [];
  return INTERVIEW_QUESTION_TAXONOMY[family].specializations;
}
