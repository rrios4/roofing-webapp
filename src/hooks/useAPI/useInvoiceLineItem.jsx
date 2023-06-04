import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createInvoiceLineItem,
  deleteAllInvoiceLineItemsByInvoiceNumber,
  deleteInvoiceLineItemById
} from '../../services/api/invoiceLineitem';
import { formatMoneyValue } from '../../utils';
import { useDeleteInvoiceById } from './useInvoices';

// Custom hook to create a new line item for a invoice
export const useCreateInvoiceLineItem = (toast) => {
  const queryClient = useQueryClient();
  return useMutation(
    (newInvoiceLineItemObject) => createInvoiceLineItem(newInvoiceLineItemObject),
    {
      onError: (error) => {
        toast({
          position: 'top',
          title: `Error Occured Creating Line Item`,
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      },
      onSuccess: async (data) => {
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
export const useDeleteInvoiceLineItem = (toast) => {
  const queryClient = useQueryClient();
  return useMutation((deleteLineItemObject) => deleteInvoiceLineItemById(deleteLineItemObject), {
    onError: (error) => {
      toast({
        position: 'top',
        title: `Error Occured Deleting Line Item`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: (data) => {
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
  });
};

export const useDeleteAllInvoiceLineItemsByInvoiceNumber = (toast) => {
  const { mutate } = useDeleteInvoiceById(toast);
  return useMutation((invoiceNumber) => deleteAllInvoiceLineItemsByInvoiceNumber(invoiceNumber), {
    onError: (error) => {
      toast({
        position: `top`,
        title: `Error occured deleting Invoice's' Line Items!`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: (data) => mutate(data)
  });
};
