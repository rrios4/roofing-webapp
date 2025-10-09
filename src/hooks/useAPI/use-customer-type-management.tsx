import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllCustomerTypes,
  fetchCustomerTypeById,
  createCustomerType,
  updateCustomerType,
  deleteCustomerType,
  getCustomerTypeUsage,
  CreateCustomerTypePayload,
  UpdateCustomerTypePayload,
  CustomerTypeUsage
} from '../../services/api/customer-type-service';
import { CustomerType } from '../../types/db_types';

// Query Keys
const CUSTOMER_TYPE_KEYS = {
  ALL: ['customer-types'] as const,
  DETAIL: (id: number) => ['customer-types', id] as const,
  USAGE: (id: number) => ['customer-types', id, 'usage'] as const
};

// Query Keys
const QUERY_KEYS = {
  CUSTOMER_TYPES: ['customerTypes'] as const,
  CUSTOMER_TYPE: (id: number) => ['customerType', id] as const,
  CUSTOMER_TYPE_USAGE: (id: number) => ['customerTypeUsage', id] as const
};

// Fetch all customer types
export const useFetchCustomerTypes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOMER_TYPES,
    queryFn: async () => {
      const response = await fetchAllCustomerTypes();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

// Fetch single customer type by ID
export const useFetchCustomerTypeById = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOMER_TYPE(id),
    queryFn: async () => {
      const response = await fetchCustomerTypeById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
};

// Fetch customer type usage
export const useFetchCustomerTypeUsage = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOMER_TYPE_USAGE(id),
    queryFn: async () => {
      const response = await getCustomerTypeUsage(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter cache for usage data)
    retry: 1
  });
};

// Create customer type mutation
export const useCreateCustomerType = (options?: {
  onSuccess?: (customerType: CustomerType) => void;
  onError?: (error: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerType,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_TYPE_KEYS.ALL] });
      if (response.data) {
        options?.onSuccess?.(response.data);
      }
    },
    onError: (error: any) => {
      console.error('Error creating customer type:', error);
      options?.onError?.(error.message || 'Failed to create customer type');
    }
  });
};

// Update customer type mutation
export const useUpdateCustomerType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomerType,
    onSuccess: (response, variables) => {
      if (response.error) {
        throw new Error(response.error);
      }

      // Invalidate and refetch customer types list
      queryClient.invalidateQueries({ queryKey: CUSTOMER_TYPE_KEYS.ALL });

      // Update specific customer type in cache
      if (response.data) {
        queryClient.setQueryData(CUSTOMER_TYPE_KEYS.DETAIL(variables.id), response.data);

        // Update the customer type in the list cache
        queryClient.setQueryData(CUSTOMER_TYPE_KEYS.ALL, (old: CustomerType[] = []) => {
          return old
            .map((ct) => (ct.id === variables.id ? response.data! : ct))
            .sort((a, b) => a.name.localeCompare(b.name));
        });
      }
    },
    onError: (error) => {
      console.error('Update customer type mutation error:', error);
    }
  });
};

// Delete customer type mutation
export const useDeleteCustomerType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerType,
    onSuccess: (response, id) => {
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete customer type');
      }

      // Remove from customer types list cache
      queryClient.setQueryData(CUSTOMER_TYPE_KEYS.ALL, (old: CustomerType[] = []) => {
        return old.filter((ct) => ct.id !== id);
      });

      // Remove specific customer type from cache
      queryClient.removeQueries({ queryKey: CUSTOMER_TYPE_KEYS.DETAIL(id) });
      queryClient.removeQueries({ queryKey: CUSTOMER_TYPE_KEYS.USAGE(id) });

      // Invalidate customer types list to ensure consistency
      queryClient.invalidateQueries({ queryKey: CUSTOMER_TYPE_KEYS.ALL });
    },
    onError: (error) => {
      console.error('Delete customer type mutation error:', error);
    }
  });
};

// Custom hook for customer type management with state management
export const useCustomerTypeManagement = () => {
  const { data: customerTypes = [], isLoading, error, refetch } = useFetchCustomerTypes();

  const createMutation = useCreateCustomerType();
  const updateMutation = useUpdateCustomerType();
  const deleteMutation = useDeleteCustomerType();

  return {
    // Data
    customerTypes,

    // Loading states
    isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Error states
    error: (error as any)?.message || null,
    createError: (createMutation.error as any)?.message || null,
    updateError: (updateMutation.error as any)?.message || null,
    deleteError: (deleteMutation.error as any)?.message || null,

    // Actions
    createCustomerType: createMutation.mutateAsync,
    updateCustomerType: updateMutation.mutateAsync,
    deleteCustomerType: deleteMutation.mutateAsync,
    refetchCustomerTypes: refetch,

    // State reset functions
    resetCreateState: createMutation.reset,
    resetUpdateState: updateMutation.reset,
    resetDeleteState: deleteMutation.reset
  };
};
