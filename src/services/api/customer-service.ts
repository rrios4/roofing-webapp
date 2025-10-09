import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import {
  Customer,
  CustomerWithType,
  CustomerInsert,
  InvoiceWithRelations,
  QuoteWithRelations
} from '../../types/db_types';

// GET request to API for all customers
export const fetchCustomers = async (): Promise<CustomerWithType[]> => {
  const { data, error } = await supabase
    .from(TABLES.CUSTOMER)
    .select(
      `
      id,
      customer_type_id,
      first_name,
      last_name,
      street_address,
      city,
      state,
      zipcode,
      phone_number,
      email,
      company_name,
      created_at,
      updated_at,
      customer_type (
        id,
        name,
        description,
        created_at,
        updated_at
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    throw error;
  }
  const transformedData = data?.map((customer: any) => ({
    ...customer,
    customer_type: Array.isArray(customer.customer_type)
      ? customer.customer_type[0]
      : customer.customer_type
  }));

  return transformedData as CustomerWithType[];
};

// GET request to API to get a customer by id
export const fetchCustomerById = async (customerId: number): Promise<CustomerWithType> => {
  const { data, error } = await supabase
    .from(TABLES.CUSTOMER)
    .select(
      `
      id,
      customer_type_id,
      first_name,
      last_name,
      street_address,
      city,
      state,
      zipcode,
      phone_number,
      email,
      company_name,
      created_at,
      updated_at,
      customer_type (
        id,
        name,
        description,
        created_at,
        updated_at
      )
    `
    )
    .eq('id', customerId)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  const transformedData = {
    ...data,
    customer_type: Array.isArray(data.customer_type) ? data.customer_type[0] : data.customer_type
  };

  return transformedData as CustomerWithType;
};

// GET request to API to get all invoices that belong to a customer
export const fetchCustomerInvoices = async (
  customerId: number
): Promise<InvoiceWithRelations[]> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE)
    .select(
      `
      *,
      customer (
        id,
        first_name,
        last_name,
        email,
        phone_number
      ),
      invoice_status (
        id,
        name,
        description,
        created_at,
        updated_at
      ),
      service (
        id,
        name,
        description,
        default_price,
        created_at,
        updated_at
      )
    `
    )
    .eq('customer_id', customerId);

  if (error) {
    console.log(error);
    throw error;
  }
  return data as InvoiceWithRelations[];
};

// GET request to API to get all quotes that belong to a customer
export const fetchCustomerQuotes = async (customerId: number): Promise<QuoteWithRelations[]> => {
  const { data, error } = await supabase
    .from(TABLES.QUOTE)
    .select(
      `
      *,
      customer (
        id,
        first_name,
        last_name,
        email,
        phone_number
      ),
      quote_status (
        id,
        name,
        description,
        created_at,
        updated_at
      ),
      service (
        id,
        name,
        description,
        default_price,
        created_at,
        updated_at
      )
    `
    )
    .eq('customer_id', customerId);

  if (error) {
    console.log(error);
    throw error;
  }
  return data as QuoteWithRelations[];
};

// GET request to API to search for customer
export const fetchSearchCustomers = async (query: string): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from(TABLES.CUSTOMER)
    .select('*')
    .or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone_number.ilike.%${query}%`
    );

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
};

// DELETE request to API to delete a customer by id
export const deleteCustomer = async (itemNumber: number): Promise<void> => {
  const { error } = await supabase.from(TABLES.CUSTOMER).delete().eq('id', itemNumber);

  if (error) {
    throw error;
  }
};

// POST request to API to create a customer
export const createCustomer = async (newCustomerObject: CustomerInsert): Promise<Customer> => {
  const { data, error } = await supabase
    .from(TABLES.CUSTOMER)
    .insert(newCustomerObject)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

// PUT request to API to update a customer's information
export const updateCustomerById = async (selectedCustomerObject: Customer): Promise<Customer> => {
  const { data, error } = await supabase
    .from(TABLES.CUSTOMER)
    .update(selectedCustomerObject)
    .eq('id', selectedCustomerObject.id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};
