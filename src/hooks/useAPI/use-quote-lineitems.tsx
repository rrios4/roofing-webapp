import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createQuoteLineItem,
  deleteQuoteLineItemById,
  deleteQuoteLineItems
  // @ts-ignore
} from '../../services/api/quote-lineitem-service';
import { useDeleteQuote } from './use-quotes';
import { QuoteLineItem, QuoteLineItemInsert } from '../../types/db_types';

// Custom hook to delete all line items for a given quote number with quote also
export const useDeleteAllQuoteLineItemsWithQuote = (toast: any, itemNumber: any, setOpen: any) => {
  const { mutate: mutateDeleteQuote } = useDeleteQuote(toast, setOpen);
  return useMutation((quoteNumber: number) => deleteQuoteLineItems(quoteNumber), {
    onError: (error: any) => {
      setOpen(false);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `There was a problem with deleting quote line items from our system.\n Message: ${error.message}`,
        variant: 'destructive'
      });
    },
    onSuccess: (data: any, variables: number) => {
      // Use the original quoteNumber (variables) passed to the mutation
      mutateDeleteQuote(variables);
    }
  });
};

// Custom hook to add a line item for a given quote number
export const useCreateQuoteLineItem = (toast: any, quote_number: any) => {
  const queryClient = useQueryClient();
  return useMutation((lineItemObject: QuoteLineItemInsert) => createQuoteLineItem(lineItemObject), {
    onError: (error: any) => {
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

export const useDeleteQuoteLineItemById = (toast: any, quoteNumber: any) => {
  const queryClient = useQueryClient();
  return useMutation((item: QuoteLineItem) => deleteQuoteLineItemById(item), {
    onError: (error: any) => {
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
