import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  fetchCustomers,
  fetchCustomerById,
  deleteCustomer,
  createCustomer,
  updateCustomerById,
  fetchCustomerInvoices,
  fetchCustomerQuotes,
  fetchSearchCustomers
} from '../../services/api/customer';

// Custom hook to get all customers from db
export const useFetchCustomers = () => {
  // React-Query
  const {
    data: customers,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['customers'],
    queryFn: () => fetchCustomers()
  });

  return { customers, isLoading, isError };
};

// Custom hook to search for customers
export const useSearchCustomers = (query) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['customerSearch', query],
    queryFn: () => fetchSearchCustomers(query)
  });

  return { data, isLoading, isError };
};

// Custom hook to get a customer's information by id
export const useFetchCustomerByID = (id) => {
  // React-Query
  const {
    data: customerById,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['fetchCustomerById', id],
    queryFn: () => fetchCustomerById(id)
  });

  return { customerById, isLoading, isError };
};

// Custom hook to GET all of the customer's invoices
export const useFetchCustomerInvoices = (customerId) => {
  // React-Query
  const {
    data: customerInvoices,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['fetchCustomerInvoices', customerId],
    queryFn: () => fetchCustomerInvoices(customerId)
  });

  return { customerInvoices, isLoading, isError };
};
// Custom hook to GET all of the customer's quotes
export const useFetchCustomerQuotes = (customerId) => {
  // React-Query
  const {
    data: customerQuotes,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['fetchCustomerQuotes', customerId],
    queryFn: () => fetchCustomerQuotes(customerId)
  });

  return { customerQuotes, isLoading, isError };
};

// Custom hook to delete a customer
export const useDeleteCustomer = (toast) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation((itemNumber) => deleteCustomer(itemNumber), {
    onError: (error) => {
      toast({
        position: 'top',
        title: 'Error Deleting Customer!',
        description: `Message: ${error.details}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/customers');
      toast({
        position: 'top',
        title: `Customer deleted!`,
        description: `We've deleted customer and associated data pertaining to that customer for you 🎉.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};

// Custom hook to create a new customer
export const useCreateCustomer = (toast, handleResettingUseState) => {
  const queryClient = useQueryClient();
  return useMutation((newCustomerObject) => createCustomer(newCustomerObject), {
    onError: (error) => {
      toast({
        position: 'top',
        title: `Error Occured Creating Customer`,
        description: `Error: ${error.details}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      handleResettingUseState();
    },
    onSuccess: () => {
      handleResettingUseState();
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        position: 'top',
        title: `New Customer Created`,
        description: `Customer has been created succesfully 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};

// Custom hook to update a existing customer's information
export const useUpdateCustomer = (toast, handleResetUpdateCustomerState, customerId) => {
  const queryClient = useQueryClient();
  return useMutation((selectedCustomerObject) => updateCustomerById(selectedCustomerObject), {
    onError: (error) => {
      toast({
        position: 'top',
        title: 'Error Occured!',
        description: `Message: ${error.message ? error.message : error.details}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchCustomerById', customerId] });
      handleResetUpdateCustomerState();
      toast({
        position: 'top',
        title: `Customer updated!`,
        description: `We've updated customer data succesfully 🎉.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  });
};
