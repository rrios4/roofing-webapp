import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteQuoteRequestById,
  fetchAllQuoteRequests,
  updateQuoteRequestById
} from '../../services/api/quote_request';

// Custom react-query hook for quote requests
export const useFetchAllQuoteRequests = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['quoteRequests'],
    queryFn: () => fetchAllQuoteRequests()
  });

  return { data, isLoading, isError };
};

// Custom react-query hook for deleting a qr by id
export const useDeleteQRById = (toast) => {
  const queryClient = useQueryClient();
  return useMutation((itemId) => deleteQuoteRequestById(itemId), {
    onError: (error) => {
      toast({
        position: `top`,
        title: `Error occured deleting QR!`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
      toast({
        position: `top`,
        title: `QR #${data} deleted!`,
        description: `We've deleted QR #${data} for you succesfully! 🚀`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};

// Custom react-query hook for updating a qr by id
export const useUpdateQRById = (toast) => {
  const queryClient = useQueryClient();
  return useMutation((updatedQRObject) => updateQuoteRequestById(updatedQRObject), {
    onError: (error) => {
      toast({
        position: 'top',
        title: 'Error Occured Updating Request',
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
      toast({
        position: 'top',
        title: `QR# ${data} updated!`,
        description: "We've updated quote request for you 🎉",
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};
