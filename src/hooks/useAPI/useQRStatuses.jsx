import { useQuery } from '@tanstack/react-query';
import { fetchAllQuoteRequestStatuses } from '../../services/api/quote_request_status';

// Custom hook to fetch all quote request statuses from database
export const useFetchAllQRStatuses = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['qrStatuses'],
    queryFn: () => fetchAllQuoteRequestStatuses()
  });

  return { data, isLoading, isError };
};
