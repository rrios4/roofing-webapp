import supabase from '../../utils/supabaseClient';
import { useQuery } from '@tanstack/react-query';

const fetchCustomers = async () => {
  // setCustomersLoadingStateIsOn(true);
  const { data, error } = await supabase.from('customer').select('*');

  if (error) {
    console.log(error);
  }

  return data;
};

export const useCustomers = () => {
  // React-Query
  const {
    data: customers,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['customers'],
    queryFn: () => fetchCustomers()
  });

  return { customers, isLoading, isError };
};
