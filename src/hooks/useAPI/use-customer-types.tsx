import { useQuery } from '@tanstack/react-query';
import { fetchAllCustomerTypes } from '../../services/api/customer-type-service';
import { CustomerType } from '../../types/db_types';

export const useFetchAllCustomerTypes = () => {
  const {
    data: response,
    isError,
    isLoading,
    error: queryError
  } = useQuery({
    queryKey: ['customerTypes'],
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

  return {
    data: response || [],
    isError,
    isLoading,
    error: (queryError as any)?.message || null
  };
};
