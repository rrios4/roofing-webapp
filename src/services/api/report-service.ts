import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';

// GET request of a count of all leads with a Status
export const fetchTotalNewLeads = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE_REQUEST)
    .select('*', { count: 'exact' })
    .eq('est_request_status_id', 1);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalScheduledLeads = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE_REQUEST)
    .select('*', { count: 'exact' })
    .eq('est_request_status_id', 2);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalClosedLeads = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE_REQUEST)
    .select('*', { count: 'exact' })
    .eq('est_request_status_id', 4);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

// GET request of a count of all customer types
export const fetchTotalCustomers = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.CUSTOMER)
    .select('*', { count: 'exact' });
    
  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalResidentialCustomers = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.CUSTOMER)
    .select('*', { count: 'exact' })
    .eq('customer_type_id', 1);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalCommercialCustomers = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.CUSTOMER)
    .select('*', { count: 'exact' })
    .eq('customer_type_id', 2);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

// GET request of a count for invoice status counts
export const fetchTotalOverdueInvoices = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.INVOICE)
    .select('*', { count: 'exact' })
    .eq('invoice_status_id', 3);
    
  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalPendingInvoices = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.INVOICE)
    .select('*', { count: 'exact' })
    .eq('invoice_status_id', 2);
    
  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalPaidInvoices = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.INVOICE)
    .select('*', { count: 'exact' })
    .eq('invoice_status_id', 1);
    
  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

// GET request of a count for quote status counts
export const fetchTotalPendingQuotes = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE)
    .select('*', { count: 'exact' })
    .eq('status_id', 2);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalAcceptedQuotes = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE)
    .select('*', { count: 'exact' })
    .eq('status_id', 1);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalRejectedQuotes = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE)
    .select('*', { count: 'exact' })
    .eq('status_id', 3);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};