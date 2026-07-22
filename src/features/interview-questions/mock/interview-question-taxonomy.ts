// Mirrors src/common/constants/interview-question-taxonomy.ts from Ai-Recruiter-Mini-Backend.

export type OccupationFamily =
  | 'IT'
  | 'MARKETING'
  | 'DESIGN'
  | 'DATA'
  | 'PRODUCT'
  | 'SALES'
  | 'LEGAL';

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
  specialization: string;
  enablers: string[];
  businessContexts: string[];
};

export const INTERVIEW_QUESTION_TAXONOMY: Record<OccupationFamily, TaxonomyEntry[]> = {
  IT: [
    {
      specialization: 'Backend',
      enablers: ['Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      businessContexts: ['E-commerce', 'SaaS B2B', 'Fintech', 'Booking/Marketplace'],
    },
    {
      specialization: 'Frontend',
      enablers: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      businessContexts: ['E-commerce', 'SaaS B2B', 'CMS'],
    },
    {
      specialization: 'Mobile',
      enablers: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      businessContexts: ['E-commerce', 'Fintech', 'IoT'],
    },
    {
      specialization: 'DevOps/SRE',
      enablers: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
      businessContexts: ['SaaS B2B', 'Fintech'],
    },
    {
      specialization: 'QA/Testing',
      enablers: ['Cypress', 'Playwright', 'Jest', 'Postman'],
      businessContexts: ['E-commerce', 'SaaS B2B'],
    },
    {
      specialization: 'Data Engineering',
      enablers: ['Airflow', 'Spark', 'Kafka', 'dbt'],
      businessContexts: ['Fintech', 'SaaS B2B'],
    },
    {
      specialization: 'Security',
      enablers: ['OWASP', 'Penetration Testing', 'SIEM'],
      businessContexts: ['Fintech', 'SaaS B2B'],
    },
  ],
  MARKETING: [
    {
      specialization: 'Performance',
      enablers: ['Google Ads', 'Meta Ads', 'GA4'],
      businessContexts: ['B2B Lead Gen', 'E-commerce Growth'],
    },
    {
      specialization: 'Content Marketing',
      enablers: ['SEMrush', 'Ahrefs', 'CMS'],
      businessContexts: ['Product Launch', 'Brand Awareness'],
    },
    {
      specialization: 'Brand',
      enablers: ['Brand Guidelines', 'Design System'],
      businessContexts: ['Brand Awareness', 'Rebranding'],
    },
    {
      specialization: 'SEO',
      enablers: ['SEMrush', 'Ahrefs', 'Google Search Console'],
      businessContexts: ['Content Marketing', 'E-commerce Growth'],
    },
    {
      specialization: 'Social Media',
      enablers: ['Meta Ads', 'TikTok Ads', 'Scheduling Tools'],
      businessContexts: ['Brand Awareness', 'Retention'],
    },
    {
      specialization: 'Marketing Automation',
      enablers: ['HubSpot', 'Marketo'],
      businessContexts: ['B2B Lead Gen', 'Retention'],
    },
  ],
  DESIGN: [
    {
      specialization: 'UI/UX Design',
      enablers: ['Figma', 'Design System', 'User Research'],
      businessContexts: ['UI Redesign', 'Mobile App Design'],
    },
    {
      specialization: 'Graphic Design',
      enablers: ['Illustrator', 'Photoshop'],
      businessContexts: ['Packaging', 'Brand Awareness'],
    },
    {
      specialization: 'Brand/Visual Identity',
      enablers: ['Illustrator', 'Design System'],
      businessContexts: ['Rebranding', 'Packaging'],
    },
    {
      specialization: 'Motion Graphics',
      enablers: ['After Effects'],
      businessContexts: ['Product Launch', 'Brand Awareness'],
    },
    {
      specialization: 'Product Design',
      enablers: ['Figma', 'Design System'],
      businessContexts: ['UI Redesign', 'Design System Build'],
    },
  ],
  DATA: [
    {
      specialization: 'Data Analyst',
      enablers: ['SQL', 'Power BI', 'Looker Studio'],
      businessContexts: ['Sales Dashboard', 'Churn Analysis'],
    },
    {
      specialization: 'BI Engineer',
      enablers: ['SQL', 'Tableau', 'Power BI'],
      businessContexts: ['Financial Reporting', 'Sales Dashboard'],
    },
    {
      specialization: 'Data Scientist',
      enablers: ['Python/Pandas', 'A/B Testing'],
      businessContexts: ['A/B Test Analysis', 'Churn Analysis'],
    },
    {
      specialization: 'Data Engineering',
      enablers: ['Airflow', 'Spark', 'Kafka', 'dbt'],
      businessContexts: ['Financial Reporting', 'Sales Dashboard'],
    },
  ],
  PRODUCT: [
    {
      specialization: 'B2B Product',
      enablers: ['Jira', 'Notion', 'Amplitude'],
      businessContexts: ['New Feature Launch', 'Platform Migration'],
    },
    {
      specialization: 'B2C Product',
      enablers: ['Amplitude', 'Mixpanel', 'A/B Testing Framework'],
      businessContexts: ['PMF Discovery', 'Growth Loop'],
    },
    {
      specialization: 'Growth PM',
      enablers: ['Mixpanel', 'A/B Testing Framework'],
      businessContexts: ['Growth Loop', 'PMF Discovery'],
    },
    {
      specialization: 'Technical PM',
      enablers: ['Jira', 'Notion'],
      businessContexts: ['Platform Migration', 'New Feature Launch'],
    },
  ],
  SALES: [
    {
      specialization: 'Enterprise Sales',
      enablers: ['Salesforce', 'SPIN Selling'],
      businessContexts: ['Enterprise Deal Closing', 'New Market Entry'],
    },
    {
      specialization: 'Inside Sales',
      enablers: ['HubSpot CRM', 'Apollo/Lemlist'],
      businessContexts: ['New Market Entry', 'Churn Reduction'],
    },
    {
      specialization: 'Channel Sales',
      enablers: ['Salesforce', 'Partner Programs'],
      businessContexts: ['New Market Entry'],
    },
    {
      specialization: 'Account Management',
      enablers: ['Salesforce', 'HubSpot CRM'],
      businessContexts: ['Key Account Management', 'Churn Reduction'],
    },
  ],
  LEGAL: [
    {
      specialization: 'Contract/Commercial Law',
      enablers: ['Contract Management Software', 'Due Diligence checklist'],
      businessContexts: ['Contract Negotiation', 'M&A Due Diligence'],
    },
    {
      specialization: 'Compliance',
      enablers: ['Compliance Frameworks'],
      businessContexts: ['Compliance Audit'],
    },
    {
      specialization: 'IP Law',
      enablers: ['IP Registration Process'],
      businessContexts: ['IP Registration'],
    },
    {
      specialization: 'Labor Law',
      enablers: ['Labor Code Frameworks'],
      businessContexts: ['Compliance Audit'],
    },
  ],
};

export function getSpecializationsFor(family: OccupationFamily | ''): string[] {
  if (!family) return [];
  return INTERVIEW_QUESTION_TAXONOMY[family].map((entry) => entry.specialization);
}

export function getEnablersFor(family: OccupationFamily | '', specialization: string): string[] {
  if (!family) return [];
  const entry = INTERVIEW_QUESTION_TAXONOMY[family].find((e) => e.specialization === specialization);
  return entry?.enablers ?? [];
}
