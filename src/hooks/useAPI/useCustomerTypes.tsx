import { useQuery } from '@tanstack/react-query';
// @ts-ignore
import { fetchAllCustomerTypes } from '../../services/api/customer_type';

export const useFetchAllCustomerTypes = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['customerTypes'],
    queryFn: () => fetchAllCustomerTypes()
  });
  return { data, isError, isLoading };
};
