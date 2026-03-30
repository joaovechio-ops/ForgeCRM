import { Lead, Opportunity, Activity, Partner, ServiceItem, User, Quota } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane@forgecrm.com',
    role: 'manager',
    avatar: 'https://picsum.photos/seed/jane/200',
    status: 'active',
    startDate: '2024-01-15',
  },
  {
    id: 'user-2',
    name: 'John Smith',
    email: 'john@forgecrm.com',
    role: 'sales',
    avatar: 'https://picsum.photos/seed/john/200',
    status: 'active',
    startDate: '2024-03-20',
  },
  {
    id: 'user-3',
    name: 'Alice Cooper',
    email: 'alice@forgecrm.com',
    role: 'sales',
    avatar: 'https://picsum.photos/seed/alice/200',
    status: 'inactive',
    startDate: '2024-02-10',
    lastDay: '2025-01-30',
  },
];

export const MOCK_QUOTAS: Quota[] = [
  {
    id: 'q-1',
    userId: 'user-1',
    amount: 2500000,
    period: 'Q1 2025',
    currency: 'USD',
  },
  {
    id: 'q-2',
    userId: 'user-2',
    amount: 1000000,
    period: 'Q1 2025',
    currency: 'USD',
  }
];

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'p-1',
    company: 'CloudFlow Solutions',
    contactName: 'Alice Mendes',
    contactEmail: 'alice@cloudflow.pt',
    type: 'Implementation',
  },
  {
    id: 'p-2',
    company: 'Global CRM Experts',
    contactName: 'Carlos Ruiz',
    contactEmail: 'carlos@crmexperts.es',
    type: 'Reseller',
  },
];

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 's-1',
    name: 'Cloud Migration Strategy',
    description: 'Full assessment and roadmap for cloud migration.',
    basePrice: 5000,
    currency: 'USD',
    cost: 3000,
    unit: 'Project',
  },
  {
    id: 's-2',
    name: 'Managed Support (Monthly)',
    description: '24/7 technical support and maintenance.',
    basePrice: 1500,
    currency: 'EUR',
    cost: 800,
    unit: 'Month',
  },
  {
    id: 's-3',
    name: 'Senior Architect Consulting',
    description: 'Direct architectural guidance and review.',
    basePrice: 250,
    currency: 'USD',
    cost: 150,
    unit: 'Hour',
  },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    company: 'TechCorp',
    status: 'Qualified',
    origin: 'LinkedIn',
    aiScore: 85,
    lastInteraction: '2025-03-20T10:00:00Z',
    assignedTo: 'user-1',
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Jane',
    email: 'sarah@globalsoft.com',
    company: 'GlobalSoft',
    status: 'New',
    origin: 'Referral',
    aiScore: 92,
    lastInteraction: '2025-03-19T14:30:00Z',
    assignedTo: 'user-2',
    createdAt: '2025-02-15T09:00:00Z',
  },
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opt-1',
    title: 'Enterprise Software License',
    leadId: '1',
    partnerId: 'p-1',
    ownerId: 'user-1',
    value: 50000,
    currency: 'USD',
    status: 'Proposal',
    createdAt: '2025-01-10',
    expectedCloseDate: '2025-06-30',
    probability: 60,
    confidenceStatus: 'Medium',
    activityNotes: [
      'Initial discovery call completed.',
      'Pricing proposal sent for 500 users.'
    ],
    services: [
      { id: 'li-1', serviceId: 's-1', quantity: 1, unitPrice: 50000, unitCost: 30000, currency: 'USD', taxRate: 15, unit: 'Project' }
    ],
    nextStep: 'Contract review meeting',
  },
  {
    id: 'opt-2',
    title: 'Cloud Infrastructure Migration',
    leadId: '2',
    ownerId: 'user-2',
    value: 120000,
    currency: 'EUR',
    status: 'Discovery',
    createdAt: '2025-02-15',
    expectedCloseDate: '2025-09-15',
    probability: 30,
    confidenceStatus: 'Low',
    activityNotes: [
      'Early stage discussions about AWS to GCP migration.'
    ],
    services: [],
    nextStep: 'Stakeholder discovery workshop',
  },
  {
    id: 'opt-3',
    title: 'SaaS Platform Onboarding',
    leadId: '1',
    ownerId: 'user-1',
    value: 1500000,
    currency: 'USD',
    status: 'Closed Won',
    createdAt: '2025-01-01',
    expectedCloseDate: '2025-02-15',
    probability: 100,
    confidenceStatus: 'High',
    activityNotes: ['Project successfully kicked off.'],
    services: [],
  },
  {
    id: 'opt-4',
    title: 'Security Audit Service',
    leadId: '2',
    ownerId: 'user-2',
    value: 8000,
    currency: 'USD',
    status: 'Closed Won',
    createdAt: '2025-03-01',
    expectedCloseDate: '2025-03-25',
    probability: 100,
    confidenceStatus: 'High',
    activityNotes: ['Audit completed and signed off.'],
    services: [],
  },
  {
    id: 'opt-5',
    title: 'Custom API Integration',
    leadId: '1',
    ownerId: 'user-1',
    value: 250000,
    currency: 'USD',
    status: 'Closed Won',
    createdAt: '2025-02-01',
    expectedCloseDate: '2025-03-10',
    probability: 100,
    confidenceStatus: 'High',
    activityNotes: ['Final deployment successful.'],
    services: [],
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'Call',
    subject: 'Discovery Call',
    description: 'Discussed high-level requirements and budget.',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    performerId: 'user-1',
    opportunityId: 'opt-1',
  },
  {
    id: 'act-2',
    type: 'Email',
    subject: 'Initial Proposal Sent',
    description: 'Emailed the preliminary scope and pricing structure.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    performerId: 'user-2',
    leadId: '2',
  },
  {
    id: 'act-3',
    type: 'Meeting',
    subject: 'Architecture Review',
    description: 'Technical deep dive with the CTO.',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    performerId: 'user-1',
    opportunityId: 'opt-2',
  }
];
