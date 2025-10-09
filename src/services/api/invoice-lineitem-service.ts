import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { InvoiceLineService, InvoiceLineServiceInsert } from '../../types/db_types';

// POST request to create a new invoice line item
export const createInvoiceLineItem = async (
  newInvoiceLineItemObject: InvoiceLineServiceInsert
): Promise<InvoiceLineService> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE_LINE_SERVICE)
    .insert(newInvoiceLineItemObject)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as InvoiceLineService;
};

// DELETE request to delete all invoice line item that belong to a invoice number
export const deleteAllInvoiceLineItemsByInvoiceNumber = async (
  invoiceNumber: number
): Promise<InvoiceLineService[]> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE_LINE_SERVICE)
    .delete()
    .eq('invoice_id', invoiceNumber)
    .select();

  if (error) {
    throw error;
  }
  return (data ?? []) as InvoiceLineService[];
};

// DELETE request to delete a invoice line item by id
export const deleteInvoiceLineItemById = async (deleteLineItemObject: {
  item_id: number;
}): Promise<InvoiceLineService> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE_LINE_SERVICE)
    .delete()
    .eq('id', deleteLineItemObject.item_id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as InvoiceLineService;
};
