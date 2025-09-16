import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createNewQuoteRequest,
  deleteQuoteRequestById,
  fetchAllQuoteRequests,
  updateQuoteRequestById
  // @ts-ignore
} from '../../services/api/quote-request-service';
import { IDbQRequest } from '../../types/global_types';
import React from 'react';
import { QuoteRequestInsert } from '../../types/db_types';

// Custom react-query hook for quote requests
export const useFetchAllQuoteRequests = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['quoteRequests'],
    queryFn: () => fetchAllQuoteRequests()
  });

  return { data, isLoading, isError };
};

// Custom react-query hook to create a new quote request
export const useCreateNewQuoteRequest = (toast: any, setOpen: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    (newQuoteRequestObject: QuoteRequestInsert) => createNewQuoteRequest(newQuoteRequestObject),
    {
      onError: (error: any) => {
        setOpen(true);
        toast({
          title: 'Uh oh! Something went wrong.',
          description: `There was a problem with adding a new request to our system.\n Message: ${error.message}`,
          variant: 'destructive'
        });
      },
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
        console.log(data);
        setOpen(false);
        toast({
          variant: 'success',
          title: 'Added request successfully! 🎉',
          description: <p>Successfully added new request to our system.</p>
        });
      }
    }
  );
};

// Custom react-query hook for deleting a qr by id
export const useDeleteQRById = (toast: any, setOpen: any) => {
  const queryClient = useQueryClient();
  return useMutation((itemId: number) => deleteQuoteRequestById(itemId), {
    onError: (error: any) => {
      // toast({
      //   position: `top`,
      //   title: `Error occured deleting QR!`,
      //   description: `Error: ${error.message}`,
      //   status: 'error',
      //   duration: 5000,
      //   isClosable: true
      // });
      setOpen(false);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `There was a problem with adding a new request to our system.\n Message: ${error.message}`,
        variant: 'destructive'
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
      // toast({
      //   position: `top`,
      //   title: `QR #${data} deleted!`,
      //   description: `We've deleted QR #${data} for you succesfully! 🚀`,
      //   status: 'success',
      //   duration: 5000,
      //   isClosable: true
      // });
      setOpen(false);
      toast({
        variant: 'success',
        title: 'Deleted request successfully! 🎉',
        description: <p>Successfully deleted request from our system.</p>
      });
    }
  });
};

// Custom react-query hook for updating a qr by id
export const useUpdateQRById = (toast: any) => {
  const queryClient = useQueryClient();
  return useMutation((updatedQRObject: any) => updateQuoteRequestById(updatedQRObject), {
    onError: (error: any) => {
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
