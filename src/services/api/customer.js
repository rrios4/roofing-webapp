import supabase from '../../utils/supabaseClient';

// GET request to API for all customers
export const fetchCustomers = async () => {
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
export const fetchCustomerById = async (customerId) => {
  const { data, error } = await supabase
    .from('customer')
    .select('*, customer_type:customer_type_id(*)')
    .eq('id', `${customerId}`);

  if (error) {
    console.log(error);
  }
  return data[0];
};

// GET request to API to get all invoices that belong to a customer
export const fetchCustomerInvoices = async (customerId) => {
  const { data, error } = await supabase
    .from('invoice')
    .select(
      '*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*)'
    )
    .eq('customer_id', `${customerId}`);

  if (error) {
    console.log(error);
  }
  return data;
};

// GET request to API to get all quotes that belong to a customer
export const fetchCustomerQuotes = async (customerId) => {
  const { data, error } = await supabase
    .from('quote')
    .select('*, customer:customer_id(*), quote_status:status_id(*), services:service_id(*)')
    .eq('customer_id', `${customerId}`);

  if (error) {
    console.log(error);
  }
  return data;
};

// GET request to API to search for customer
export const fetchSearchCustomers = async (query) => {
  let { data, error } = await supabase
    .from('customer')
    .select('*')
    .or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone_number.ilike.%${query}%`
    );

  if (error) {
    console.log(error);
  }

  return data;
};

// DELETE request to API to delete a customer by id
export const deleteCustomer = async (itemNumber) => {
  const { data, error } = await supabase.from('customer').delete().eq('id', `${itemNumber}`);

  if (error) {
    throw error;
  }
  return data;
};

// POST request to API to create a customer
export const createCustomer = async (newCustomerObject) => {
  const { data, error } = await supabase.from('customer').insert(newCustomerObject);
  if (error) {
    throw error;
  }
  return data;
};

// PUT request to API to update a customer's information
export const updateCustomerById = async (selectedCustomerObject) => {
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
