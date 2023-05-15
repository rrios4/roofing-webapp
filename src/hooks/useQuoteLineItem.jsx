import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createQuoteLineItem,
  deleteQuoteLineItemById,
  deleteQuoteLineItems
} from '../services/api/quoteLineItem';
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

// Custom hook to add a line item for a given quote number
export const useCreateQuoteLineItem = (toast, quote_number) => {
  const queryClient = useQueryClient();
  return useMutation((lineItemObject) => createQuoteLineItem(lineItemObject), {
    onError: (error) => {
      toast({
        position: `top`,
        title: `Error occured creating line-item for Quote`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quoteById', quote_number] });
      toast({
        position: 'top',
        title: `Succesfully Added Line Item`,
        description: `We were able to add a line-item for quote number ${quote_number} 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};

export const useDeleteQuoteLineItemById = (toast, quoteNumber) => {
  const queryClient = useQueryClient();
  return useMutation((item) => deleteQuoteLineItemById(item), {
    onError: (error) => {
      toast({
        position: `top`,
        title: `Error occured deleting line-item for Quote`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quoteById', quoteNumber] });
      toast({
        position: 'top',
        title: `Succesfully Delete Line Item`,
        description: `We were able to delete line-item for quote# ${quoteNumber} 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};
