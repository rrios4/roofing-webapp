import supabase from '../../utils/supabaseClient';

// GET request that returns a list of all invoices statuses from DB
export const fetchAllInvoiceStatuses = async () => {
  const { data, error } = await supabase
    .from('invoice_status')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
  }
  return data;
};
