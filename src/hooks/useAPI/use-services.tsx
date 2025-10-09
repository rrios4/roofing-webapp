import { useQuery } from '@tanstack/react-query';
import { fetchAllServices } from '../../services/api/service';
import { Service } from '../../types/db_types';

export const useFetchAllServices = () => {
  // react-query
  const { data, isLoading, isError } = useQuery<Service[]>({
    queryKey: ['roofingServices'],
    queryFn: () => fetchAllServices()
  });

  return { data, isLoading, isError };
};
