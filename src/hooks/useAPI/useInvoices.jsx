import { useQuery } from '@tanstack/react-query';
import { fetchAllInvoices, fetchInvoiceById } from '../../services/api/invoice';

export const useFetchAllInvoices = () => {
  // react-query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => fetchAllInvoices()
  });

  return { data, isError, isLoading };
};

export const useFetchInvoiceById = (invoice_number) => {
  // react-query
  const { data, isError, isLoading } = useQuery({
    queryKey: ['invoiceById', invoice_number],
    queryFn: () => fetchInvoiceById(invoice_number)
  });

  return { data, isError, isLoading };
};
