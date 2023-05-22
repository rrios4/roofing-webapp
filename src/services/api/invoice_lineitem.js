import supabase from '../../utils/supabaseClient';

// POST request to create a new invoice line item
export const createInvoiceLineItem = async (newInvoiceLineItemObject) => {
  const { error } = await supabase.from('invoice_line_service').insert(newInvoiceLineItemObject);

  if (error) {
    throw error;
  }
  return newInvoiceLineItemObject;
};

// POST request to create multiple new line items for a new invoice
export const createMultipleInvoiceLineItems = async (invoiceLineItemsArray) => {
  console.log(invoiceLineItemsArray);
  const { error } = await supabase.from('invoice_line_service').insert(invoiceLineItemsArray);
  if (error) {
    throw error;
  }
  console.log(invoiceLineItemsArray);
  // return invoiceLineItemsArray[0].invoice_id;
};

// DELETE request to delete all invoice line item that belong to a invoice number
export const deleteAllInvoiceLineItemsByInvoiceNumber = async (invoiceNumber) => {
  const { error } = await supabase
    .from('invoice_line_service')
    .delete()
    .eq('invoice_id', invoiceNumber);

  if (error) {
    throw error;
  }
  return invoiceNumber;
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
