import supabase from '../../utils/supabaseClient';

export const fetchAllInvoices = async () => {
  const { data, error } = await supabase
    .from('invoice')
    .select(
      `*, customer:customer_id(*), services:service_type_id(*), invoice_status:invoice_status_id(*)`
    )
    .order('invoice_status_id', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.log(error.message);
  }
  return data;
};

export const fetchInvoiceById = async (invoice_number) => {
  const { data, error } = await supabase
    .from('invoice')
    .select(
      '*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*), invoice_line_service(*), invoice_payment(*)'
    )
    .eq('invoice_number', `${invoice_number}`);

  if (error) {
    console.log(error);
  }
  return data[0];
};
