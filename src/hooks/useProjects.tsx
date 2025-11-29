import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import {
  fetchAllProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
  fetchAllWorkflows,
  fetchWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  setDefaultWorkflow,
  getDefaultWorkflow,
  filterProjects,
  sortProjects
} from '../services/api/projects';
import {
  Project,
  ProjectWorkflow,
  ProjectFilters,
  ProjectSortBy,
  ProjectSortOrder
} from '../types/project-types';

// Hook for managing projects
export const useProjects = () => {
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchAllProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) =>
      updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return {
    projects,
    isLoading,
    error,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending
  };
};

// Hook for managing workflows
export const useWorkflows = () => {
  const queryClient = useQueryClient();

  const {
    data: workflows = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['workflows'],
    queryFn: fetchAllWorkflows,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000
  });

  const { data: defaultWorkflowId } = useQuery({
    queryKey: ['defaultWorkflow'],
    queryFn: getDefaultWorkflow,
    staleTime: 10 * 60 * 1000
  });

  const createWorkflowMutation = useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const updateWorkflowMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ProjectWorkflow> }) =>
      updateWorkflow(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const setDefaultWorkflowMutation = useMutation({
    mutationFn: setDefaultWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defaultWorkflow'] });
    }
  });

  const defaultWorkflow = workflows.find((w) => w.id === defaultWorkflowId);

  return {
    workflows,
    defaultWorkflow,
    defaultWorkflowId,
    isLoading,
    error,
    createWorkflow: createWorkflowMutation.mutate,
    updateWorkflow: updateWorkflowMutation.mutate,
    deleteWorkflow: deleteWorkflowMutation.mutate,
    setDefaultWorkflow: setDefaultWorkflowMutation.mutate,
    isCreating: createWorkflowMutation.isPending,
    isUpdating: updateWorkflowMutation.isPending,
    isDeleting: deleteWorkflowMutation.isPending
  };
};

// Hook for filtered and sorted projects
export const useFilteredProjects = () => {
  const { projects, ...projectMethods } = useProjects();
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    assignedTo: [],
    dateRange: {},
    valueRange: {},
    source: [],
    hasInsurance: undefined
  });
  const [sortBy, setSortBy] = useState<ProjectSortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<ProjectSortOrder>('desc');

  const filteredAndSortedProjects = useMemo(() => {
    let result = filterProjects(projects, filters);
    result = sortProjects(result, sortBy, sortOrder);
    return result;
  }, [projects, filters, sortBy, sortOrder]);

  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      assignedTo: [],
      dateRange: {},
      valueRange: {},
      source: [],
      hasInsurance: undefined
    });
  }, []);

  const updateSort = useCallback((newSortBy: ProjectSortBy, newSortOrder?: ProjectSortOrder) => {
    setSortBy(newSortBy);
    if (newSortOrder) {
      setSortOrder(newSortOrder);
    } else {
      // Toggle sort order if same column
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }
  }, []);

  return {
    projects: filteredAndSortedProjects,
    allProjects: projects,
    filters,
    sortBy,
    sortOrder,
    updateFilters,
    clearFilters,
    updateSort,
    ...projectMethods
  };
};

// Hook for kanban board functionality
export const useKanbanBoard = (workflowId?: string) => {
  const { projects, ...projectMethods } = useFilteredProjects();
  const { workflows, defaultWorkflowId } = useWorkflows();

  const activeWorkflowId = workflowId || defaultWorkflowId;
  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId);

  const projectsByStatus = useMemo(() => {
    if (!activeWorkflow) return {};

    const grouped = projects
      .filter((project) => project.workflowId === activeWorkflowId)
      .reduce(
        (acc, project) => {
          const statusId = project.statusId;
          if (!acc[statusId]) {
            acc[statusId] = [];
          }
          acc[statusId].push(project);
          return acc;
        },
        {} as Record<string, Project[]>
      );

    // Ensure all statuses have an array, even if empty
    activeWorkflow.statuses.forEach((status) => {
      if (!grouped[status.id]) {
        grouped[status.id] = [];
      }
    });

    return grouped;
  }, [projects, activeWorkflow, activeWorkflowId]);

  const moveProject = useCallback(
    (projectId: string, newStatusId: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        projectMethods.updateProject({
          id: projectId,
          updates: { statusId: newStatusId }
        });
      }
    },
    [projects, projectMethods]
  );

  return {
    activeWorkflow,
    projectsByStatus,
    moveProject,
    ...projectMethods
  };
};

// Hook for project statistics
export const useProjectStats = () => {
  const { projects } = useProjects();

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalValue = projects.reduce((sum, p) => sum + (p.jobValue || 0), 0);
    const averageValue = totalProjects > 0 ? totalValue / totalProjects : 0;

    const projectsWithInsurance = projects.filter((p) => p.hasInsurance).length;
    const insurancePercentage =
      totalProjects > 0 ? (projectsWithInsurance / totalProjects) * 100 : 0;

    const statusCounts = projects.reduce(
      (acc, project) => {
        acc[project.statusId] = (acc[project.statusId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const sourceCounts = projects.reduce(
      (acc, project) => {
        if (project.source) {
          acc[project.source] = (acc[project.source] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalProjects,
      totalValue,
      averageValue,
      projectsWithInsurance,
      insurancePercentage,
      statusCounts,
      sourceCounts
    };
  }, [projects]);

  return stats;
};
