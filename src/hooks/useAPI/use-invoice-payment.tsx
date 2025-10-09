import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createInvoicePayment,
  deleteAllInvoicePaymentsByInvoiceNumber,
  deleteInvoicePayment
  // @ts-ignore
} from '../../services/api/invoice-payment-service';
import { formatDate, formatMoneyValue } from '../../lib/utils';
import { useDeleteAllInvoiceLineItemsByInvoiceNumber } from './use-invoice-lineItem';
import { InvoicePaymentInsert } from '../../types/db_types';

// Custom hook to create a new invoice payment
export const useCreateInvoicePayment = (toast: any, setOpen: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    (newInvoicePaymentObject: InvoicePaymentInsert) =>
      createInvoicePayment(newInvoicePaymentObject),
    {
      onError: (error: any) => {
        toast({
          position: 'top',
          title: `Error Occured Adding Payment`,
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      },
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['invoiceById', data.invoice_id.toString()] });
        toast({
          position: 'top',
          title: `Succesfully Added Payment`,
          description: `We were able to add a payment for invoice number ${data.invoice_id} 🎉`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );
};

// Custom hook to delete a invoice payment
export const useDeleteInvoicePayment = (toast: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    (deleteInvoicePaymentObject: any) => deleteInvoicePayment(deleteInvoicePaymentObject),
    {
      onError: (error: any) => {
        toast({
          position: 'top',
          title: `Error Occurred Deleting Payment`,
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      },
      onSuccess: (data: any) => {
        // Only invalidate queries if we have the invoice_number in the response
        if (data && data.invoice_number) {
          queryClient.invalidateQueries({
            queryKey: ['invoiceById', data.invoice_number.toString()]
          });
        }

        toast({
          position: 'top',
          title: `Successfully Deleted Payment`,
          description: `We were able to delete a payment${data && data.date_received ? ` that was posted for ${formatDate(data.date_received)}` : ''}${data && data.amount ? ` for a total of $${formatMoneyValue(data.amount)}` : ''} 🎉`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );
};

// Custom hook to delete all invoice payments that belong to invoice number
export const useDeleteAllInvoicePaymentsByInvoiceNumber = (toast: any, setOpen: any) => {
  const { mutate } = useDeleteAllInvoiceLineItemsByInvoiceNumber(toast, setOpen);
  return useMutation(
    (invoiceNumber: number) => deleteAllInvoicePaymentsByInvoiceNumber(invoiceNumber),
    {
      onError: (error: any) => {
        setOpen(false);
        toast({
          title: 'Uh oh! Something went wrong.',
          description: `There was a problem with deleting invoice payments from our system.\n Message: ${error.message}`,
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
