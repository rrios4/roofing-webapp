import supabase from '../../utils/supabaseClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

// GET request to API for all customers
const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from('customer')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
  }

  return data;
};

// GET request to API to get a customer by id
const fetchCustomerById = async (customerId) => {
  const { data, error } = await supabase
    .from('customer')
    .select('*, customer_type:customer_type_id(*)')
    .eq('id', `${customerId}`);

  if (error) {
    console.log(error);
  }
  return data[0];
};

// DELETE request to API to delete a customer by id
const deleteCustomer = async (itemNumber) => {
  const { data, error } = await supabase.from('customer').delete().eq('id', `${itemNumber}`);

  if (error) {
    throw error;
  }
  return data;
};

// POST request to API to create a customer
const createCustomer = async (newCustomerObject) => {
  const { data, error } = await supabase.from('customer').insert(newCustomerObject);
  if (error) {
    throw error;
  }
  return data;
};

// PUT request to API to update a customer's information
const updateCustomerById = async (selectedCustomerObject) => {
  const { data, error } = await supabase
    .from('customer')
    .update(selectedCustomerObject)
    .match({ id: selectedCustomerObject.id });
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
};

// Custom hook to get all customers from db
export const useCustomers = () => {
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

// Custom hook to GET all of the customer's invoices
// Custom hook to GET all of the customer's quotes
