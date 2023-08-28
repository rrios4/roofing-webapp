import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createNewQuoteRequest,
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

// Custom react-query hook to create a new quote request
export const useCreateNewQuoteRequest = (toast:any, setOpen:any) => {
  const queryClient = useQueryClient();
  return useMutation((newQuoteRequestObject) => createNewQuoteRequest(newQuoteRequestObject), {
    onError: (error:any) => {
      // toast({
      //   position: 'top',
      //   title: `Error Occured Creating New QR`,
      //   description: `Error: ${error.message}`,
      //   status: 'error',
      //   duration: 5000,
      //   isClosable: true
      // });
      setOpen(true)
      toast({
        title: "Uh oh! Something went wrong.",
        description: `There was a problem with adding a new request to our system.\n Message: ${error.message}`,
        variant: "destructive"
      })
    },
    onSuccess: (data:any) => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
      // toast({
      //   position: 'top',
      //   title: `Quote Request created!`,
      //   description: `We've created a new quote request for ${data.firstName} ${data.lastName} with email ${data.email} 🚀`,
      //   status: 'success',
      //   duration: 5000,
      //   isClosable: true
      // });
      console.log(data)
      setOpen(false)
      toast({
        variant: 'success',
        title: 'Added request successfully! 🎉',
        description: (
          // <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          //   <code className="text-white">{JSON.stringify(values, null, 2)}</code>
          // </pre>
          <p>Successfully added new request to our system.</p>
        )
      })
    }
  });
};

// Custom react-query hook for deleting a qr by id
export const useDeleteQRById = (toast:any) => {
  const queryClient = useQueryClient();
  return useMutation((itemId) => deleteQuoteRequestById(itemId), {
    onError: (error:any) => {
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
export const useUpdateQRById = (toast:any) => {
  const queryClient = useQueryClient();
  return useMutation((updatedQRObject) => updateQuoteRequestById(updatedQRObject), {
    onError: (error:any) => {
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
