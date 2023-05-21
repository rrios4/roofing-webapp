import supabase from '../../utils/supabaseClient';

// POST request to create a new invoice line item
export const createInvoiceLineItem = async (newInvoiceLineItemObject) => {
  const { error } = await supabase.from('invoice_line_service').insert(newInvoiceLineItemObject);

  if (error) {
    throw error;
  }
  return newInvoiceLineItemObject;
};

// DELETE request to delete a invoice line item by id
export const deleteInvoiceLineItemById = async (deleteLineItemObject) => {
  const { error } = await supabase
    .from('invoice_line_service')
    .delete()
    .eq('id', deleteLineItemObject.item_id);

  if (error) {
    throw error;
  }
  return deleteLineItemObject;
};
