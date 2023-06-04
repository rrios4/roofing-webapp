import { useQuery } from '@tanstack/react-query';
import { fetchAllServices } from '../../services/api/service';

export const useFetchAllServices = () => {
  // react-query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['roofingServices'],
    queryFn: () => fetchAllServices()
  });

  return { data, isLoading, isError };
};
