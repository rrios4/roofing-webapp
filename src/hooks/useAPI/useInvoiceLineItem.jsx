import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInvoiceLineItem } from '../../services/api/invoice_lineItem';

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
