import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createNewInvoice,
  deleteInvoiceById,
  fetchAllInvoices,
  fetchInvoiceById,
  updateInvoice,
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

// Custom hook to create a new invoice
export const useCreateInvoice = (toast) => {
  return useMutation((newInvoiceObject) => createNewInvoice(newInvoiceObject), {
    onError: (error) => {
      toast({
        position: 'top',
        title: `Error Occured Creating New Invoice`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: (data) => {
      console.log(data);
      // mutate(data.lineItemObjectArray);
      // toast({
      //   position: 'top',
      //   title: `Invoice #${data.invoice_number} was created succesfully! 🎉`,
      //   description: "We've sucessfully created an invoice for you!",
      //   status: 'success',
      //   duration: 5000,
      //   isClosable: true
      // });
    }
  });
};

// Custom hook to delete invoice by id
export const useDeleteInvoiceById = (toast) => {
  const queryClient = useQueryClient();
  return useMutation((invoiceNumber) => deleteInvoiceById(invoiceNumber), {
    onError: (error) => {
      toast({
        position: `top`,
        title: `Error occured deleting Invoice!`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        position: `top`,
        title: `Invoice #${data} deleted!`,
        description: `We've deleted all invoice's payments & line-items associated with invoice #${data} for you succesfully! 🚀`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};

// Custom hook to update invoice
export const useUpdateInvoice = (toast) => {
  const queryClient = useQueryClient();
  return useMutation((updateInvoiceObject) => updateInvoice(updateInvoiceObject), {
    onError: (error) => {
      toast({
        position: 'top',
        title: `Error Updating Invoice`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['invoiceById', data.toString()]
      });
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        position: 'top',
        title: `Successfully Updated Invoice!`,
        description: `We've updated INV# ${data} for you 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
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
