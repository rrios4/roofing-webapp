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
