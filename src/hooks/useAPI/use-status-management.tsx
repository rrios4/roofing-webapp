import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllStatuses,
  fetchStatusesByType,
  createStatus,
  updateStatus,
  deleteStatus,
  getStatusById,
  getStatusUsage,
  StatusType,
  UnifiedStatus,
  StatusInsert
} from '../../services/api/status-service';

// Query keys for React Query cache management
export const STATUS_QUERY_KEYS = {
  all: ['statuses'] as const,
  allStatuses: () => [...STATUS_QUERY_KEYS.all, 'all'] as const,
  byType: (type: StatusType) => [...STATUS_QUERY_KEYS.all, 'type', type] as const,
  byId: (type: StatusType, id: number) =>
    [...STATUS_QUERY_KEYS.all, 'type', type, 'id', id] as const,
  usage: (type: StatusType, id: number) => [...STATUS_QUERY_KEYS.all, 'usage', type, id] as const
} as const;

/**
 * Hook to fetch all statuses from all types
 */
export const useFetchAllStatuses = () => {
  return useQuery({
    queryKey: STATUS_QUERY_KEYS.allStatuses(),
    queryFn: fetchAllStatuses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (response) => {
      if (response.error || !response.data) {
        return { statuses: [], error: response.error };
      }

      // Group statuses by type for easier consumption
      const grouped = response.data.reduce(
        (acc, status) => {
          if (!acc[status.type]) {
            acc[status.type] = [];
          }
          acc[status.type].push(status);
          return acc;
        },
        {} as Record<StatusType, UnifiedStatus[]>
      );

      return {
        statuses: response.data,
        grouped,
        error: null
      };
    }
  });
};

/**
 * Hook to fetch statuses by specific type
 */
export const useFetchStatusesByType = (type: StatusType) => {
  return useQuery({
    queryKey: STATUS_QUERY_KEYS.byType(type),
    queryFn: () => fetchStatusesByType(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (response) => ({
      statuses: response.data || [],
      error: response.error,
      isLoading: false
    })
  });
};

/**
 * Hook to fetch a single status by ID and type
 */
export const useFetchStatusById = (type: StatusType, id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: STATUS_QUERY_KEYS.byId(type, id),
    queryFn: () => getStatusById(type, id),
    enabled: enabled && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => ({
      status: response.data,
      error: response.error
    })
  });
};

/**
 * Hook to fetch usage statistics for a status
 */
export const useFetchStatusUsage = (type: StatusType, id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: STATUS_QUERY_KEYS.usage(type, id),
    queryFn: () => getStatusUsage(type, id),
    enabled: enabled && id > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for usage stats)
    select: (response) => ({
      count: response.count,
      error: response.error
    })
  });
};

/**
 * Hook to create a new status
 */
export const useCreateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, data }: { type: StatusType; data: StatusInsert }) =>
      createStatus(type, data),
    onSuccess: (response, { type }) => {
      if (response.data && !response.error) {
        // Invalidate and refetch related queries
        queryClient.invalidateQueries({ queryKey: STATUS_QUERY_KEYS.allStatuses() });
        queryClient.invalidateQueries({ queryKey: STATUS_QUERY_KEYS.byType(type) });

        // Optionally add the new status to the cache
        queryClient.setQueryData(STATUS_QUERY_KEYS.byId(type, response.data.id), {
          data: response.data,
          error: null
        });
      }
    },
    onError: (error) => {
      console.error('Error creating status:', error);
    }
  });
};

/**
 * Hook to update an existing status
 */
export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id, data }: { type: StatusType; id: number; data: StatusInsert }) =>
      updateStatus(type, id, data),
    onSuccess: (response, { type, id }) => {
      if (response.data && !response.error) {
        // Invalidate and refetch related queries
        queryClient.invalidateQueries({ queryKey: STATUS_QUERY_KEYS.allStatuses() });
        queryClient.invalidateQueries({ queryKey: STATUS_QUERY_KEYS.byType(type) });

        // Update the specific status in the cache
        queryClient.setQueryData(STATUS_QUERY_KEYS.byId(type, id), {
          data: response.data,
          error: null
        });
      }
    },
    onError: (error) => {
      console.error('Error updating status:', error);
    }
  });
};

/**
 * Hook to delete a status
 */
export const useDeleteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: StatusType; id: number }) => deleteStatus(type, id),
    onSuccess: (response, { type, id }) => {
      if (response.success) {
        // Invalidate and refetch related queries
        queryClient.invalidateQueries({ queryKey: STATUS_QUERY_KEYS.allStatuses() });
        queryClient.invalidateQueries({ queryKey: STATUS_QUERY_KEYS.byType(type) });

        // Remove the specific status from the cache
        queryClient.removeQueries({ queryKey: STATUS_QUERY_KEYS.byId(type, id) });
        queryClient.removeQueries({ queryKey: STATUS_QUERY_KEYS.usage(type, id) });
      }
    },
    onError: (error) => {
      console.error('Error deleting status:', error);
    }
  });
};

/**
 * Combined hook for status management operations
 * Provides all CRUD operations and data fetching in one hook
 */
export const useStatusManagement = (type?: StatusType) => {
  // Data fetching hooks
  const allStatusesQuery = useFetchAllStatuses();
  const typeStatusesQuery = useFetchStatusesByType(type || 'invoice'); // Always call the hook, but with a default

  // Mutation hooks
  const createMutation = useCreateStatus();
  const updateMutation = useUpdateStatus();
  const deleteMutation = useDeleteStatus();

  // Helper functions
  const createStatusFn = (statusType: StatusType, data: StatusInsert) => {
    return createMutation.mutateAsync({ type: statusType, data });
  };

  const updateStatusFn = (statusType: StatusType, id: number, data: StatusInsert) => {
    return updateMutation.mutateAsync({ type: statusType, id, data });
  };

  const deleteStatusFn = (statusType: StatusType, id: number) => {
    return deleteMutation.mutateAsync({ type: statusType, id });
  };

  const refetchAll = () => {
    allStatusesQuery.refetch();
    if (type) {
      typeStatusesQuery.refetch();
    }
  };

  return {
    // Data
    allStatuses: allStatusesQuery.data?.statuses || [],
    groupedStatuses: allStatusesQuery.data?.grouped || {},
    typeStatuses: type ? typeStatusesQuery.data?.statuses || [] : [],

    // Loading states
    isLoading: allStatusesQuery.isLoading || (type ? typeStatusesQuery.isLoading : false),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Error states
    error: allStatusesQuery.data?.error || (type ? typeStatusesQuery.data?.error : null) || null,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,

    // Success states
    createSuccess: createMutation.isSuccess,
    updateSuccess: updateMutation.isSuccess,
    deleteSuccess: deleteMutation.isSuccess,

    // Operations
    createStatus: createStatusFn,
    updateStatus: updateStatusFn,
    deleteStatus: deleteStatusFn,
    refetchAll,

    // Reset functions
    resetCreateState: createMutation.reset,
    resetUpdateState: updateMutation.reset,
    resetDeleteState: deleteMutation.reset
  };
};

/**
 * Hook specifically for status selection/display purposes
 */
export const useStatusOptions = () => {
  const { data } = useFetchAllStatuses();

  return {
    invoiceStatuses: data?.grouped?.invoice || [],
    quoteStatuses: data?.grouped?.quote || [],
    quoteRequestStatuses: data?.grouped?.quote_request || [],
    allStatuses: data?.statuses || [],
    isLoading: !data,
    error: data?.error || null
  };
};
