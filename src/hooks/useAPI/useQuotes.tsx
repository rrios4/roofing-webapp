import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteQuoteById,
  fetchQuoteById,
  fetchQuotes,
  fetchSearchQuotes,
  updateQuoteById,
  updateQuoteStatusById
  // @ts-ignore
} from '../../services/api/quote';
import React from 'react';

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
    queryFn: () => fetchSearchQuotes()
  });
  return { quoteSearchResult, quoteSearchIsLoading, isError };
};

// Custom hook to create quote

// Custom hook to delete a quote
export const useDeleteQuote = (toast: any, setOpen: any) => {
  const queryClient = useQueryClient();
  return useMutation((quoteNumber) => deleteQuoteById(quoteNumber), {
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
  return useMutation((quoteObject) => updateQuoteById(quoteObject), {
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
  return useMutation((status_id) => updateQuoteStatusById(status_id, quote_number), {
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
