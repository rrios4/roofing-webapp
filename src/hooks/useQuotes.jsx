import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteQuoteById,
  fetchQuotes,
  fetchSearchQuotes,
  updateQuoteById
} from '../services/api/quote';

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
// Custom hook to search for customer
export const useSearchQuote = (query) => {
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
export const useDeleteQuote = (toast) => {
  const queryClient = useQueryClient();
  return useMutation((quoteNumber) => deleteQuoteById(quoteNumber), {
    onError: (error) => {
      toast({
        position: `top`,
        title: `Error occured deleting Quote!`,
        description: `Error: ${error.details}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'quotes' });
      toast({
        position: `top`,
        title: `Quote deleted!`,
        description: `We've deleted Quote with line-items for you succesfully! 🚀`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};

// Custom hook to update a quote
export const useUpdateQuote = (toast, resetQuoteState) => {
  const queryClient = useQueryClient();
  return useMutation((quoteObject) => updateQuoteById(quoteObject), {
    onError: (error) => {
      toast({
        position: 'top',
        title: `Error Updating Quote`,
        description: `Error: ${error.details}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      resetQuoteState();
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
