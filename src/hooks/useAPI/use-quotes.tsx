import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteQuoteById,
  fetchQuoteById,
  fetchQuotes,
  fetchSearchQuotes,
  updateQuoteById,
  updateQuoteStatusById,
  convertQuoteToInvoice
  // @ts-ignore
} from '../../services/api/quote-service';
import { Quote } from '../../types/db_types';

// Custom hook to get all quotes
export const useFetchQuotes = () => {
  // React-Query
  const {
    data: quotes,
    isLoading,
    isError
  } = useQuery({ queryKey: ['quotes'], queryFn: () => fetchQuotes() });

  return { quotes, isLoading, isError };
};

// Custom hook to get quote by id
export const useFetchQuoteById = (quote_number: any) => {
  const {
    data: quoteById,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['quoteById', quote_number],
    queryFn: () => fetchQuoteById(quote_number)
  });
  return { quoteById, isLoading, isError };
};

// Custom hook to search for customer
export const useSearchQuote = (query: any) => {
  // React-Query
  const {
    data: quoteSearchResult,
    isLoading: quoteSearchIsLoading,
    isError
  } = useQuery({
    queryKey: ['quoteSearch', query],
    queryFn: () => fetchSearchQuotes(query)
  });
  return { quoteSearchResult, quoteSearchIsLoading, isError };
};

// Custom hook to create quote

// Custom hook to delete a quote
export const useDeleteQuote = (toast: any, setOpen: any) => {
  const queryClient = useQueryClient();
  return useMutation((quoteNumber: number) => deleteQuoteById(quoteNumber), {
    onError: (error: any) => {
      setOpen(false);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `There was a problem with deleting quote from our system.\n Message: ${error.message}`,
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries({ queryKey: 'quotes' });
      setOpen(false);
      toast({
        variant: 'success',
        title: 'Deleted invoice successfully! 🎉',
        description: <p>Successfully deleted invoice from our system.</p>
      });
    }
  });
};

// Custom hook to update a quote
export const useUpdateQuote = (toast: any) => {
  const queryClient = useQueryClient();
  return useMutation((quoteObject: Quote) => updateQuoteById(quoteObject), {
    onError: (error: any) => {
      toast({
        position: 'top',
        title: `Error Updating Quote`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quoteById'] });
      toast({
        position: 'top',
        title: `Successfully Updated Quote!`,
        description: `We've updated quote information for you 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};

// Custom hook to update a status for a quote
export const useUpdateQuoteStatusById = (toast: any, quote_number: any) => {
  const queryClient = useQueryClient();
  return useMutation((status_id: number) => updateQuoteStatusById(status_id, quote_number), {
    onError: (error: any) => {
      toast({
        position: 'top',
        title: `Error Updating Quote Status`,
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
        title: `Successfully Updated Quote Status!`,
        description: `We've updated quote status information for you 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};

// Custom hook to convert quote to invoice
export const useConvertQuoteToInvoice = (toast: any, quote_number: number) => {
  const queryClient = useQueryClient();
  return useMutation(() => convertQuoteToInvoice(quote_number), {
    onError: (error: any) => {
      // Handle the specific duplicate conversion error
      if (error.message.includes('already been converted')) {
        toast({
          title: 'Quote Already Converted',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error Converting Quote',
          description: `Failed to convert quote to invoice. Error: ${error.message}`,
          variant: 'destructive'
        });
      }
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ['quoteById', quote_number] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });

      const invoiceNumber = result.invoice.invoice_number;
      toast({
        title: 'Quote Converted Successfully! 🎉',
        description: `Quote has been converted to Invoice #INV-${invoiceNumber}. You can view it in the invoices section.`,
        variant: 'success'
      });

      // Return the invoice data for potential navigation
      return result;
    }
  });
};
