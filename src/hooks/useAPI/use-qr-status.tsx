import { useQuery } from '@tanstack/react-query';
// @ts-ignore
import { fetchAllQuoteRequestStatuses } from '../../services/api/quote-request-status-service';

// Custom hook to fetch all quote request statuses from database
export const useFetchAllQRStatuses = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['qrStatuses'],
    queryFn: () => fetchAllQuoteRequestStatuses()
  });

  return { data, isLoading, isError };
};
