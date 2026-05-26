import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  createProjectSource,
  createProjectStatus,
  createProjectType,
  deleteProject,
  deleteProjectSource,
  deleteProjectStatus,
  deleteProjectType,
  fetchAllProjects,
  fetchNextProjectNumber,
  fetchProjectById,
  fetchProjectSources,
  fetchProjectStatuses,
  fetchProjectTypes,
  reorderProjectStatuses,
  updateProject,
  updateProjectSourceItem,
  updateProjectStatusItem,
  updateProjectTypeItem
} from '../../services/api/project-service';
import { toast } from '../../components/ui/use-toast';
import { ProjectInsert, ProjectStatus, ProjectUpdate, ProjectWithRelations } from '../../types/db_types';

export const useFetchProjects = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchAllProjects
  });
  return { data, isLoading, isError, refetch };
};

export const useFetchProjectById = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['projectById', id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id
  });
  return { data, isLoading, isError };
};

export const useFetchProjectStatuses = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['projectStatuses'],
    queryFn: fetchProjectStatuses
  });
  return { data, isLoading, isError };
};

export const useFetchProjectTypes = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['projectTypes'],
    queryFn: fetchProjectTypes
  });
  return { data, isLoading, isError };
};

export const useFetchNextProjectNumber = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['nextProjectNumber'],
    queryFn: fetchNextProjectNumber
  });
  return { data, isLoading, isError };
};

export const useFetchProjectSources = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['projectSources'],
    queryFn: fetchProjectSources
  });
  return { data, isLoading, isError };
};

export const useCreateProject = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation((newProject: ProjectInsert) => createProject(newProject), {
    onError: (error: any) => {
      toast({
        title: 'Error creating project',
        description: error.message,
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen?.(false);
      toast({
        variant: 'success',
        title: 'Project created successfully!'
      });
    }
  });
};

export const useUpdateProject = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, project }: { id: string; project: ProjectUpdate }) => updateProject(id, project),
    {
      onError: (error: any) => {
        toast({
          title: 'Error updating project',
          description: error.message,
          variant: 'destructive'
        });
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['projectById', variables.id] });
        setOpen?.(false);
        toast({
          variant: 'success',
          title: 'Project updated successfully!'
        });
      }
    }
  );
};

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, statusId }: { id: string; statusId: number }) =>
      updateProject(id, { project_status_id: statusId }),
    {
      onMutate: async ({ id, statusId }) => {
        await queryClient.cancelQueries(['projects']);
        const prev = queryClient.getQueryData<ProjectWithRelations[]>(['projects']);
        queryClient.setQueryData<ProjectWithRelations[]>(['projects'], (old) =>
          old?.map((p) =>
            p.id === id
              ? { ...p, project_status_id: statusId, project_status: p.project_status ? { ...p.project_status, id: statusId } : null }
              : p
          ) ?? []
        );
        return { prev };
      },
      onError: (_err: any, _vars: any, ctx: any) => {
        if (ctx?.prev) queryClient.setQueryData(['projects'], ctx.prev);
      },
      onSettled: () => queryClient.invalidateQueries(['projects'])
    }
  );
};

export const useDeleteProject = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deleteProject(id), {
    onError: (error: any) => {
      setOpen?.(false);
      toast({
        title: 'Error deleting project',
        description: error.message,
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen?.(false);
      toast({
        variant: 'success',
        title: 'Project deleted successfully!'
      });
    }
  });
};

// ── Project Status lookup CRUD ──────────────────────────────────────────────

export const useCreateProjectStatus = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { name: string; description?: string }) => createProjectStatus(data),
    {
      onError: (error: any) => {
        toast({ title: 'Error creating status', description: error.message, variant: 'destructive' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projectStatuses'] });
        setOpen?.(false);
        toast({ variant: 'success', title: 'Status created!' });
      }
    }
  );
};

export const useUpdateProjectStatusItem = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: number; data: { name?: string; description?: string } }) =>
      updateProjectStatusItem(id, data),
    {
      onError: (error: any) => {
        toast({ title: 'Error updating status', description: error.message, variant: 'destructive' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projectStatuses'] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        setOpen?.(false);
        toast({ variant: 'success', title: 'Status updated!' });
      }
    }
  );
};

export const useDeleteProjectStatus = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation((id: number) => deleteProjectStatus(id), {
    onError: (error: any) => {
      toast({ title: 'Error deleting status', description: error.message, variant: 'destructive' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectStatuses'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen?.(false);
      toast({ variant: 'success', title: 'Status deleted!' });
    }
  });
};

export const useReorderProjectStatuses = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (items: { id: number; sort_order: number }[]) => reorderProjectStatuses(items),
    {
      onMutate: async (items) => {
        await queryClient.cancelQueries(['projectStatuses']);
        const prev = queryClient.getQueryData<ProjectStatus[]>(['projectStatuses']);
        queryClient.setQueryData<ProjectStatus[]>(['projectStatuses'], (old) => {
          if (!old) return old;
          const orderMap = Object.fromEntries(items.map(({ id, sort_order }) => [id, sort_order]));
          return [...old]
            .map((s) => ({ ...s, sort_order: orderMap[s.id] ?? s.sort_order }))
            .sort((a, b) => a.sort_order - b.sort_order);
        });
        return { prev };
      },
      onError: (_err: any, _vars: any, ctx: any) => {
        if (ctx?.prev) queryClient.setQueryData(['projectStatuses'], ctx.prev);
        toast({ title: 'Error reordering statuses', variant: 'destructive' });
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['projectStatuses'] })
    }
  );
};

// ── Project Type lookup CRUD ────────────────────────────────────────────────

export const useCreateProjectType = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { name: string; description?: string }) => createProjectType(data),
    {
      onError: (error: any) => {
        toast({ title: 'Error creating type', description: error.message, variant: 'destructive' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projectTypes'] });
        setOpen?.(false);
        toast({ variant: 'success', title: 'Type created!' });
      }
    }
  );
};

export const useUpdateProjectTypeItem = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: number; data: { name?: string; description?: string } }) =>
      updateProjectTypeItem(id, data),
    {
      onError: (error: any) => {
        toast({ title: 'Error updating type', description: error.message, variant: 'destructive' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projectTypes'] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        setOpen?.(false);
        toast({ variant: 'success', title: 'Type updated!' });
      }
    }
  );
};

export const useDeleteProjectType = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation((id: number) => deleteProjectType(id), {
    onError: (error: any) => {
      toast({ title: 'Error deleting type', description: error.message, variant: 'destructive' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTypes'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen?.(false);
      toast({ variant: 'success', title: 'Type deleted!' });
    }
  });
};

// ── Project Source lookup CRUD ──────────────────────────────────────────────

export const useCreateProjectSource = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { name: string; description?: string }) => createProjectSource(data),
    {
      onError: (error: any) => {
        toast({ title: 'Error creating source', description: error.message, variant: 'destructive' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projectSources'] });
        setOpen?.(false);
        toast({ variant: 'success', title: 'Source created!' });
      }
    }
  );
};

export const useUpdateProjectSourceItem = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: number; data: { name?: string; description?: string } }) =>
      updateProjectSourceItem(id, data),
    {
      onError: (error: any) => {
        toast({ title: 'Error updating source', description: error.message, variant: 'destructive' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projectSources'] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        setOpen?.(false);
        toast({ variant: 'success', title: 'Source updated!' });
      }
    }
  );
};

export const useDeleteProjectSource = (setOpen?: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation((id: number) => deleteProjectSource(id), {
    onError: (error: any) => {
      toast({ title: 'Error deleting source', description: error.message, variant: 'destructive' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectSources'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen?.(false);
      toast({ variant: 'success', title: 'Source deleted!' });
    }
  });
};
