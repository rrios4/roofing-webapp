import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllInvoices,
  fetchInvoiceById,
  updateInvoiceStatusById
} from '../../services/api/invoice';

// Custom hook that get all invoices
export const useFetchAllInvoices = () => {
  // react-query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => fetchAllInvoices()
  });

  return { data, isError, isLoading };
};

// Custom hook that get a invoice by id
export const useFetchInvoiceById = (invoice_number) => {
  // react-query
  const { data, isError, isLoading } = useQuery({
    queryKey: ['invoiceById', invoice_number],
    queryFn: () => fetchInvoiceById(invoice_number)
  });

  return { data, isError, isLoading };
};

// Custom hook that updates the status of an invoice
export const useUpdateInvoiceStatusById = (toast) => {
  const queryClient = useQueryClient();
  return useMutation(
    (updateInvoiceStatusObject) => updateInvoiceStatusById(updateInvoiceStatusObject),
    {
      onError: (error) => {
        console.log(error);
        toast({
          position: `top`,
          title: `Error occured updating invoice status!`,
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['invoiceById', data.toString()] });
        toast({
          position: `top`,
          title: `Invoice Status Updated!`,
          description: `We've updated invoice status for INV# ${data} for you succesfully! 🚀`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );
};
