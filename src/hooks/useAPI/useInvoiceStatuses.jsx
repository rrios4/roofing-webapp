import { useQuery } from '@tanstack/react-query';
import { fetchAllInvoiceStatuses } from '../../services/api/invoice_status';

// Custom hook that uses react-query to get all invoice statuses
export const useFetchAllInvoiceStatuses = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoiceStatuses'],
    queryFn: () => fetchAllInvoiceStatuses()
  });

  return { data, isLoading, isError };
};
