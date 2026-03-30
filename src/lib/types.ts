export type Role = string; // Changed to string to allow dynamic roles like 'Marketing', 'Legal', etc.

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status: UserStatus;
  startDate?: string;
  lastDay?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Unqualified';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  origin: string;
  aiScore: number;
  lastInteraction: string;
  assignedTo: string;
  createdAt: string;
}

export type OpportunityPipeline = 'Discovery' | 'Qualification' | 'Proposal' | 'Contracting' | 'Closed Won' | 'Closed Lost';

export interface Partner {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  type: 'Referral' | 'Implementation' | 'Reseller';
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  cost: number;
  unit: string; // e.g., 'Hour', 'Project', 'Month', 'Unit'
}

export interface OpportunityService {
  id: string; // unique id for this line item
  serviceId: string;
  quantity: number;
  unitPrice: number;
  unitCost: number; // captured at the time of proposal
  currency: string;
  taxRate: number; // percentage
  unit: string;
}

export interface Opportunity {
  id: string;
  title: string;
  leadId: string;
  partnerId?: string;
  ownerId?: string; // The team member owning the opportunity
  value: number; // Total price (calculated)
  cost: number; // Total cost (calculated)
  currency: string;
  status: OpportunityPipeline;
  createdAt: string; // Track when the opportunity entered the pipeline
  expectedCloseDate: string;
  summary?: string;
  activityNotes: string[];
  probability: number; // 0-100
  confidenceStatus: 'Low' | 'Medium' | 'High';
  services: OpportunityService[];
  nextStep?: string;
}

export interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  subject: string;
  description: string;
  date: string;
  performerId: string;
  leadId?: string;
  opportunityId?: string;
}

export interface Quota {
  id: string;
  userId: string;
  amount: number;
  period: string; // e.g., 'Q1 2024'
  currency: string;
}
