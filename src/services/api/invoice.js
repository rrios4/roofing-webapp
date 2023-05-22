import supabase from '../../utils/supabaseClient';

// GET request to fetch all invoices
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

// GET request to get invoice by id
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

// POST request to create a new invoice
export const createNewInvoice = async (newInvoiceObject) => {
  const { error } = await supabase.from('invoice').insert(newInvoiceObject[0]);
  if (error) {
    throw error;
  }
  return newInvoiceObject[1];
};

// DELETE request to delete invoice by id
export const deleteInvoiceById = async (invoiceNumber) => {
  const { error } = await supabase.from('invoice').delete().eq('invoice_number', invoiceNumber);
  if (error) {
    throw error;
  }
  return invoiceNumber;
};

// PUT request to update invoice
export const updateInvoice = async (updateInvoiceObject) => {
  const { error } = await supabase
    .from('invoice')
    .update(updateInvoiceObject[0])
    .eq('invoice_number', updateInvoiceObject[1].invoice_number);

  if (error) {
    throw error;
  }
  return updateInvoiceObject[1].invoice_number;
};

// PUT request to update invoice status
export const updateInvoiceStatusById = async (updateInvoiceStatusObject) => {
  const { error } = await supabase
    .from('invoice')
    .update({ invoice_status_id: updateInvoiceStatusObject.status_id })
    .eq('invoice_number', updateInvoiceStatusObject.invoice_number);

  if (error) {
    throw error;
  }
  return updateInvoiceStatusObject.invoice_number;
};
