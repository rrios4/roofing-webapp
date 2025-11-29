import {
  Project,
  ProjectWorkflow,
  ProjectFilters,
  ProjectSortBy,
  ProjectSortOrder
} from '../../types/project-types';

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: '1',
    jobAddress: '123 Main St, Springfield, IL 62701',
    customerId: 1,
    quoteId: 101,
    statusId: 'new-leads',
    assignedTo: 'John Smith',
    jobValue: 15000,
    closeDate: '2024-01-15',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-02T14:30:00Z',
    source: 'Website',
    details: 'Storm damage repair needed',
    hasInsurance: true,
    insuranceInfo: {
      company: 'State Farm',
      policyNumber: 'SF123456789',
      claimNumber: 'CLM001',
      dateOfLoss: '2023-12-15',
      damageType: 'Hail Damage',
      claimAmount: 18000,
      deductible: 1000,
      claimDetails: 'Extensive hail damage to shingles'
    },
    workflowId: 'sales-workflow'
  },
  {
    id: '2',
    jobAddress: '456 Oak Ave, Springfield, IL 62702',
    statusId: 'quoting',
    assignedTo: 'Jane Doe',
    jobValue: 8500,
    createdAt: '2024-01-03T09:15:00Z',
    updatedAt: '2024-01-04T16:45:00Z',
    source: 'Referral',
    details: 'Roof replacement for aging shingles',
    hasInsurance: false,
    workflowId: 'sales-workflow'
  },
  {
    id: '3',
    jobAddress: '789 Pine St, Springfield, IL 62703',
    customerId: 3,
    quoteId: 103,
    invoiceId: 201,
    statusId: 'in-progress',
    assignedTo: 'Mike Johnson',
    jobValue: 22000,
    closeDate: '2024-02-01',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-06T13:20:00Z',
    source: 'Advertisement',
    details: 'Complete roof replacement with premium materials',
    hasInsurance: true,
    insuranceInfo: {
      company: 'Allstate',
      policyNumber: 'AL987654321',
      claimNumber: 'CLM002',
      dateOfLoss: '2023-11-20',
      damageType: 'Wind Damage',
      claimAmount: 25000,
      deductible: 1500,
      claimDetails: 'Wind damage from severe storm'
    },
    workflowId: 'materials-workflow'
  }
];

// Mock data for workflows
const mockWorkflows: ProjectWorkflow[] = [
  {
    id: 'sales-workflow',
    name: 'Sales Workflow',
    description: 'Workflow for the sales team',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    statuses: [
      {
        id: 'new-leads',
        name: 'New Leads',
        color: '#3b82f6',
        order: 0,
        workflowId: 'sales-workflow'
      },
      { id: 'quoting', name: 'Quoting', color: '#f59e0b', order: 1, workflowId: 'sales-workflow' },
      {
        id: 'negotiation',
        name: 'Negotiation',
        color: '#8b5cf6',
        order: 2,
        workflowId: 'sales-workflow'
      },
      { id: 'won', name: 'Won', color: '#10b981', order: 3, workflowId: 'sales-workflow' },
      { id: 'lost', name: 'Lost', color: '#ef4444', order: 7, workflowId: 'sales-workflow' }
    ]
  },
  {
    id: 'materials-workflow',
    name: 'Materials Team',
    description: 'Workflow for the materials and production team',
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    statuses: [
      {
        id: 'in-progress',
        name: 'In Progress',
        color: '#0ea5e9',
        order: 4,
        workflowId: 'materials-workflow'
      },
      {
        id: 'payments-invoicing',
        name: 'Payments/Invoicing',
        color: '#f97316',
        order: 5,
        workflowId: 'materials-workflow'
      },
      {
        id: 'completed',
        name: 'Completed',
        color: '#22c55e',
        order: 6,
        workflowId: 'materials-workflow'
      }
    ]
  }
];

// Local storage keys
const PROJECTS_STORAGE_KEY = 'roofing_projects';
const WORKFLOWS_STORAGE_KEY = 'roofing_workflows';
const DEFAULT_WORKFLOW_KEY = 'default_workflow_id';

// Initialize local storage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(PROJECTS_STORAGE_KEY)) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(mockProjects));
  }
  if (!localStorage.getItem(WORKFLOWS_STORAGE_KEY)) {
    localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(mockWorkflows));
  }
  if (!localStorage.getItem(DEFAULT_WORKFLOW_KEY)) {
    localStorage.setItem(DEFAULT_WORKFLOW_KEY, 'sales-workflow');
  }
};

// Project API functions
export const fetchAllProjects = async (): Promise<Project[]> => {
  initializeStorage();
  const projects = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY) || '[]');
  return new Promise((resolve) => {
    setTimeout(() => resolve(projects), 100); // Simulate API delay
  });
};

export const fetchProjectById = async (id: string): Promise<Project | null> => {
  const projects = await fetchAllProjects();
  return projects.find((p) => p.id === id) || null;
};

export const createProject = async (
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> => {
  const projects = await fetchAllProjects();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projects.push(newProject);
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  return newProject;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  const projects = await fetchAllProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error('Project not found');
  }

  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  return projects[index];
};

export const deleteProject = async (id: string): Promise<void> => {
  const projects = await fetchAllProjects();
  const filteredProjects = projects.filter((p) => p.id !== id);
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filteredProjects));
};

// Workflow API functions
export const fetchAllWorkflows = async (): Promise<ProjectWorkflow[]> => {
  initializeStorage();
  const workflows = JSON.parse(localStorage.getItem(WORKFLOWS_STORAGE_KEY) || '[]');
  return new Promise((resolve) => {
    setTimeout(() => resolve(workflows), 100);
  });
};

export const fetchWorkflowById = async (id: string): Promise<ProjectWorkflow | null> => {
  const workflows = await fetchAllWorkflows();
  return workflows.find((w) => w.id === id) || null;
};

export const createWorkflow = async (
  workflow: Omit<ProjectWorkflow, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ProjectWorkflow> => {
  const workflows = await fetchAllWorkflows();
  const newWorkflow: ProjectWorkflow = {
    ...workflow,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  workflows.push(newWorkflow);
  localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows));
  return newWorkflow;
};

export const updateWorkflow = async (
  id: string,
  updates: Partial<ProjectWorkflow>
): Promise<ProjectWorkflow> => {
  const workflows = await fetchAllWorkflows();
  const index = workflows.findIndex((w) => w.id === id);

  if (index === -1) {
    throw new Error('Workflow not found');
  }

  workflows[index] = {
    ...workflows[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows));
  return workflows[index];
};

export const deleteWorkflow = async (id: string): Promise<void> => {
  const workflows = await fetchAllWorkflows();
  const filteredWorkflows = workflows.filter((w) => w.id !== id);
  localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(filteredWorkflows));
};

export const setDefaultWorkflow = async (workflowId: string): Promise<void> => {
  localStorage.setItem(DEFAULT_WORKFLOW_KEY, workflowId);
};

export const getDefaultWorkflow = async (): Promise<string> => {
  initializeStorage();
  return localStorage.getItem(DEFAULT_WORKFLOW_KEY) || 'sales-workflow';
};

// Utility functions for filtering and sorting
export const filterProjects = (projects: Project[], filters: ProjectFilters): Project[] => {
  return projects.filter((project) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        project.jobAddress.toLowerCase().includes(searchLower) ||
        project.assignedTo?.toLowerCase().includes(searchLower) ||
        project.source?.toLowerCase().includes(searchLower) ||
        project.details?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Assigned to filter
    if (filters.assignedTo.length > 0 && project.assignedTo) {
      if (!filters.assignedTo.includes(project.assignedTo)) return false;
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const projectDate = new Date(project.createdAt);
      if (filters.dateRange.from && projectDate < filters.dateRange.from) return false;
      if (filters.dateRange.to && projectDate > filters.dateRange.to) return false;
    }

    // Value range filter
    if (
      (filters.valueRange.min !== undefined || filters.valueRange.max !== undefined) &&
      project.jobValue
    ) {
      if (filters.valueRange.min !== undefined && project.jobValue < filters.valueRange.min)
        return false;
      if (filters.valueRange.max !== undefined && project.jobValue > filters.valueRange.max)
        return false;
    }

    // Source filter
    if (filters.source.length > 0 && project.source) {
      if (!filters.source.includes(project.source)) return false;
    }

    // Insurance filter
    if (filters.hasInsurance !== undefined) {
      if (project.hasInsurance !== filters.hasInsurance) return false;
    }

    return true;
  });
};

export const sortProjects = (
  projects: Project[],
  sortBy: ProjectSortBy,
  sortOrder: ProjectSortOrder
): Project[] => {
  return [...projects].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case 'closeDate':
        aValue = a.closeDate ? new Date(a.closeDate) : new Date(0);
        bValue = b.closeDate ? new Date(b.closeDate) : new Date(0);
        break;
      case 'jobValue':
        aValue = a.jobValue || 0;
        bValue = b.jobValue || 0;
        break;
      case 'jobAddress':
        aValue = a.jobAddress;
        bValue = b.jobAddress;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};
