import supabase from '../../utils/supabaseClient';

// GET request of a count of all leads with a Status
export const fetchTotalNewLeads = async () => {
  const { count, error } = await supabase
    .from('quote_request')
    .select('*', { count: 'exact' })
    .eq('est_request_status_id', 1);

  if (error) {
    console.log(error);
  }
  return count;
};

export const fetchTotalScheduledLeads = async () => {
  const { count, error } = await supabase
    .from('quote_request')
    .select('*', { count: 'exact' })
    .eq('est_request_status_id', 2);

  if (error) {
    console.log(error);
  }
  return count;
};

export const fetchTotalClosedLeads = async () => {
  const { count, error } = await supabase
    .from('quote_request')
    .select('*', { count: 'exact' })
    .eq('est_request_status_id', 4);

  if (error) {
    console.log(error);
  }
  return count;
};

// GET request of a count of all customer types
export const fetchTotalCustomers = async () => {
  const { count, error } = await supabase.from('customer').select('*', { count: 'exact' });
  if (error) {
    console.log(error);
  }
  return count;
};

export const fetchTotalResidentialCustomers = async () => {
  const { count, error } = await supabase
    .from('customer')
    .select('*', { count: 'exact' })
    .eq('customer_type_id', 1);

  if (error) {
    console.log(error);
  }
  return count;
};

export const fetchTotalCommercialCustomers = async () => {
  const { count, error } = await supabase
    .from('customer')
    .select('*', { count: 'exact' })
    .eq('customer_type_id', 2);

  if (error) {
    console.log(error);
  }
  return count;
};

// GET request of a count for invoice status counts
export const fetchTotalOverdueInvoices = async () => {
  const { count, error } = await supabase
    .from('invoice')
    .select('*', { count: 'exact' })
    .eq('invoice_status_id', 3);
  if (error) {
    console.log(error);
  }
  return count;
};

export const fetchTotalPendingInvoices = async () => {
  const { count, error } = await supabase
    .from('invoice')
    .select('*', { count: 'exact' })
    .eq('invoice_status_id', 2);
  if (error) {
    console.log(error);
  }
  return count;
};

export const fetchTotalPaidInvoices = async () => {
  const { count, error } = await supabase
    .from('invoice')
    .select('*', { count: 'exact' })
    .eq('invoice_status_id', 1);
  if (error) {
    console.log(error);
  }
  return count;
};

// GET request of a count for quote status counts
export const fetchTotalPendingQuotes = async () => {
  const { count, error } = await supabase
    .from('quote')
    .select('*', { count: 'exact' })
    .eq('status_id', 2);

  if (error) {
    console.log(error);
  }
  return count;
};

export const fetchTotalAcceptedQuotes = async () => {
  const { count, error } = await supabase
    .from('quote')
    .select('*', { count: 'exact' })
    .eq('status_id', 1);

  if (error) {
    console.log(error);
  }
  return count;
};

export const fetchTotalRejectedQuotes = async () => {
  const { count, error } = await supabase
    .from('quote')
    .select('*', { count: 'exact' })
    .eq('status_id', 3);

  if (error) {
    console.log(error);
  }
  return count;
};
