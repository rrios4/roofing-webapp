import { useQuery } from '@tanstack/react-query';
import { fetchAllCustomerTypes } from '../../services/api/customer-type-service';
import { CustomerType } from '../../types/api-service';

export const useFetchAllCustomerTypes = () => {
  const { data, isError, isLoading } = useQuery<CustomerType[]>({
    queryKey: ['customerTypes'],
    queryFn: () => fetchAllCustomerTypes()
  });
  return { data, isError, isLoading };
};
