import { useMutation } from '@tanstack/react-query';
import { deleteQuoteLineItems } from '../services/api/quoteLineItem';
import { useDeleteQuote } from './useQuotes';

// Custom hook to delete all line items for a given quote number with quote also
export const useDeleteAllQuoteLineItemsWithQuote = (toast, itemNumber) => {
  const { mutate: mutateDeleteQuote } = useDeleteQuote(toast);
  return useMutation((quoteNumber) => deleteQuoteLineItems(quoteNumber), {
    onError: (error) => {
      toast({
        position: `top`,
        title: `Error occured deleting line-item for Quote`,
        description: `Error: ${error.details}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: () => {
      mutateDeleteQuote(itemNumber);
    }
  });
};
