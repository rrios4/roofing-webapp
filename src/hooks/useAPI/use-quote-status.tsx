import { useQuery } from '@tanstack/react-query';
import { fetchAllQuoteStatuses } from '../../services/api/quote-status';
import { QuoteStatus } from '../../types/db_types';

export const useQuoteStatuses = () => {
  const {
    data: quoteStatuses,
    isLoading,
    isError
  } = useQuery<QuoteStatus[]>({
    queryKey: ['quoteStatuses'],
    queryFn: fetchAllQuoteStatuses
  });

  return { quoteStatuses, isLoading, isError };
};
