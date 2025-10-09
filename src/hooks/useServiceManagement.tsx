import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../components/ui/use-toast';
import {
  createService,
  updateService,
  deleteService,
  CreateServicePayload,
  UpdateServicePayload
} from '../services/api/service';
import { Service } from '../types/db_types';

export const useServiceManagement = () => {
  const queryClient = useQueryClient();

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: (serviceData: CreateServicePayload) => createService(serviceData),
    onSuccess: (newService: Service) => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });

      toast({
        title: 'Service created successfully',
        description: `${newService.name} has been added to your services.`
      });
    },
    onError: (error: any) => {
      console.error('Error creating service:', error);
      toast({
        title: 'Error creating service',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: (serviceData: UpdateServicePayload) => updateService(serviceData),
    onSuccess: (updatedService: Service) => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });

      toast({
        title: 'Service updated successfully',
        description: `${updatedService.name} has been updated.`
      });
    },
    onError: (error: any) => {
      console.error('Error updating service:', error);
      toast({
        title: 'Error updating service',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId: number) => deleteService(serviceId),
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });

      toast({
        title: 'Service deleted successfully',
        description: 'The service has been removed from your system.'
      });
    },
    onError: (error: any) => {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error deleting service',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  });

  return {
    // Mutations
    createService: createServiceMutation,
    updateService: updateServiceMutation,
    deleteService: deleteServiceMutation,

    // Loading states
    isCreating: createServiceMutation.isPending,
    isUpdating: updateServiceMutation.isPending,
    isDeleting: deleteServiceMutation.isPending,

    // Helper function to check if any operation is in progress
    isLoading:
      createServiceMutation.isPending ||
      updateServiceMutation.isPending ||
      deleteServiceMutation.isPending
  };
};
