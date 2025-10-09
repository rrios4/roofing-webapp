import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createNewInvoice,
  deleteInvoiceById,
  fetchAllInvoices,
  fetchInvoiceById,
  updateInvoice,
  updateInvoiceStatusById
  // @ts-ignore
} from '../../services/api/invoice-service';
import React from 'react';

// Custom hook that get all invoices
export const useFetchAllInvoices = () => {
  // react-query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => await fetchAllInvoices()
  });

  return { data, isError, isLoading };
};

// Custom hook that get a invoice by id
export const useFetchInvoiceById = (invoice_number: any) => {
  // react-query
  const { data, isError, isLoading } = useQuery({
    queryKey: ['invoiceById', invoice_number],
    queryFn: () => fetchInvoiceById(invoice_number),
    enabled: !!invoice_number && invoice_number > 0 // Only run query if we have a valid invoice number
  });

  return { data, isError, isLoading };
};

// Custom hook to create a new invoice
export const useCreateInvoice = (toast: any) => {
  return useMutation((newInvoiceObject: any) => createNewInvoice(newInvoiceObject), {
    onError: (error: any) => {
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
export const useDeleteInvoiceById = (toast: any, setOpen: any) => {
  const queryClient = useQueryClient();
  return useMutation((invoiceNumber: number) => deleteInvoiceById(invoiceNumber), {
    onError: (error: any) => {
      setOpen(false);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `There was a problem with adding a new request to our system.\n Message: ${error.message}`,
        variant: 'destructive'
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setOpen(false);
      toast({
        variant: 'success',
        title: 'Deleted invoice successfully! 🎉',
        description: <p>Successfully deleted invoice from our system.</p>
      });
    }
  });
};

// Custom hook to update invoice
export const useUpdateInvoice = (toast: any) => {
  const queryClient = useQueryClient();
  return useMutation((updateInvoiceObject: any) => updateInvoice(updateInvoiceObject), {
    onError: (error: any) => {
      toast({
        position: 'top',
        title: `Error Updating Invoice`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: async (data: any) => {
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
export const useUpdateInvoiceStatusById = (toast: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    (updateInvoiceStatusObject: any) => updateInvoiceStatusById(updateInvoiceStatusObject),
    {
      onError: (error: any) => {
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
      onSuccess: (data: any) => {
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
