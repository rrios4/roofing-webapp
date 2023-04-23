import supabase from '../../utils/supabaseClient';
import { useQuery } from '@tanstack/react-query';

const fetchSearchCustomers = async (query) => {
  // setCustomersLoadingStateIsOn(true);
  let { data, error } = await supabase
    .from('customer')
    .select('*')
    .or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone_number.ilike.%${query}%`
    );

  if (error) {
    console.log(error);
  }

  return data;
};

export const useCustomerSearch = (query) => {
  // React-Query
  const {
    data: customerSearchResult,
    isLoading: customerIsLoading,
    isError
  } = useQuery({
    queryKey: ['customerSearch', query],
    queryFn: () => fetchSearchCustomers(query)
  });

  return { customerSearchResult, customerIsLoading, isError };
};
