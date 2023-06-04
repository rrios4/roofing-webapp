import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createInvoicePayment,
  deleteAllInvoicePaymentsByInvoiceNumber,
  deleteInvoicePayment
} from '../../services/api/invoice_payment';
import { formatDate, formatMoneyValue } from '../../utils';
import { useDeleteAllInvoiceLineItemsByInvoiceNumber } from './useInvoiceLineItem';

// Custom hook to create a new invoice payment
export const useCreateInvoicePayment = (toast) => {
  const queryClient = useQueryClient();
  return useMutation((newInvoicePaymentObject) => createInvoicePayment(newInvoicePaymentObject), {
    onError: (error) => {
      toast({
        position: 'top',
        title: `Error Occured Adding Payment`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: (data) => {
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
  });
};

// Custom hook to delete a invoice payment
export const useDeleteInvoicePayment = (toast) => {
  const queryClient = useQueryClient();
  return useMutation(
    (deleteInvoicePaymentObject) => deleteInvoicePayment(deleteInvoicePaymentObject),
    {
      onError: (error) => {
        toast({
          position: 'top',
          title: `Error Occured Deleting Payment`,
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['invoiceById', data.invoice_number.toString()]
        });
        toast({
          position: 'top',
          title: `Succesfully Deleted Payment`,
          description: `We were able to delete a payment that was posted for ${formatDate(
            data.date_received
          )} for a total of $${formatMoneyValue(data.amount)} 🎉`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );
};

// Custom hook to delete all invoice payments that belong to invoice number
export const useDeleteAllInvoicePaymentsByInvoiceNumber = (toast) => {
  const { mutate } = useDeleteAllInvoiceLineItemsByInvoiceNumber(toast);
  return useMutation((invoiceNumber) => deleteAllInvoicePaymentsByInvoiceNumber(invoiceNumber), {
    onError: (error) => {
      toast({
        position: `top`,
        title: `Error occured deleting Invoice's Payments!`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: (data) => {
      mutate(data);
    }
  });
};
