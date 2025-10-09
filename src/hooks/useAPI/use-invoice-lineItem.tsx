import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createInvoiceLineItem,
  deleteAllInvoiceLineItemsByInvoiceNumber,
  deleteInvoiceLineItemById
  // @ts-ignore
} from '../../services/api/invoice-lineitem-service';
import { formatMoneyValue } from '../../lib/utils';
import { useDeleteInvoiceById } from './use-invoice';

// Custom hook to create a new line item for a invoice
export const useCreateInvoiceLineItem = (toast: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    (newInvoiceLineItemObject: any) => createInvoiceLineItem(newInvoiceLineItemObject),
    {
      onError: (error: any) => {
        toast({
          position: 'top',
          title: `Error Occured Creating Line Item`,
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      },
      onSuccess: async (data: any) => {
        await queryClient.invalidateQueries({
          queryKey: ['invoiceById', data.invoice_id.toString()]
        });
        toast({
          position: 'top',
          title: `Succesfully Added Line Item`,
          description: `We were able to add a line-item for invoice# ${data.invoice_id} 🎉`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );
};

// Custom hook to delete a line item for a invoice
export const useDeleteInvoiceLineItem = (toast: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    (deleteLineItemObject: any) => deleteInvoiceLineItemById(deleteLineItemObject),
    {
      onError: (error: any) => {
        toast({
          position: 'top',
          title: `Error Occured Deleting Line Item`,
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      },
      onSuccess: (data: any) => {
        console.log(data);
        queryClient.invalidateQueries({ queryKey: ['invoiceById', data.invoice_number] });
        toast({
          position: 'top',
          title: `Succesfully Deleted Invoice Line Item`,
          description: `We were able to delete a line item with description of "${
            data.description
          }" with an amount of "${formatMoneyValue(data.amount)}" successfully 🎉`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );
};

export const useDeleteAllInvoiceLineItemsByInvoiceNumber = (toast: any, setOpen: any) => {
  const { mutate } = useDeleteInvoiceById(toast, setOpen);
  return useMutation(
    (invoiceNumber: number) => deleteAllInvoiceLineItemsByInvoiceNumber(invoiceNumber),
    {
      onError: (error: any) => {
        setOpen(false);
        toast({
          title: 'Uh oh! Something went wrong.',
          description: `There was a problem with deleting invoice line items from our system.\n Message: ${error.message}`,
          variant: 'destructive'
        });
      },
      onSuccess: (data: any, variables: number) => {
        // Pass the original invoiceNumber (variables) to the next mutation, not the returned data
        mutate(variables);
      }
    }
  );
};
