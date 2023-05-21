import { supabase } from '../../utils';

// POST request to create a new invoice payment
export const createInvoicePayment = async (newInvoicePaymentObject) => {
  const { error } = await supabase.from('invoice_payment').insert(newInvoicePaymentObject);
  if (error) {
    throw error;
  }
  return newInvoicePaymentObject;
};

// DELETE request to delete a invoice payment
export const deleteInvoicePayment = async (deleteInvoicePaymentObject) => {
  const { error } = await supabase
    .from('invoice_payment')
    .delete()
    .eq('id', deleteInvoicePaymentObject.item_id);
  if (error) {
    throw error;
  }
  return deleteInvoicePaymentObject;
};

// DELETE request to delete all invoice payments that belong to a invoice number
export const deleteAllInvoicePaymentsByInvoiceNumber = async (invoiceNumber) => {
  const { error } = await supabase.from('invoice_payment').delete().eq('invoice_id', invoiceNumber);
  if (error) {
    throw error;
  }
  return invoiceNumber;
};
