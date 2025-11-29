export type ProjectStatus = {
  id: string;
  name: string;
  color: string;
  order: number;
  workflowId: string;
};

export type ProjectWorkflow = {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  statuses: ProjectStatus[];
};

export type InsuranceInfo = {
  company: string;
  policyNumber: string;
  claimNumber: string;
  dateOfLoss: string;
  damageType: string;
  claimAmount: number;
  deductible: number;
  claimDetails?: string;
};

export type Project = {
  id: string;
  jobAddress: string;
  customerId?: number;
  quoteId?: number;
  invoiceId?: number;
  statusId: string;
  assignedTo?: string;
  jobValue?: number;
  closeDate?: string;
  createdAt: string;
  updatedAt: string;
  source?: string;
  details?: string;
  hasInsurance: boolean;
  insuranceInfo?: InsuranceInfo;
  workflowId: string;
};

export type ProjectFilters = {
  search: string;
  assignedTo: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  valueRange: {
    min?: number;
    max?: number;
  };
  source: string[];
  hasInsurance?: boolean;
};

export type ProjectSortBy = 'createdAt' | 'updatedAt' | 'jobValue' | 'closeDate' | 'jobAddress';

export type ProjectSortOrder = 'asc' | 'desc';
