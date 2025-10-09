import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { InvoicePayment, InvoicePaymentInsert } from '../../types/db_types';

// POST request to create a new invoice payment
export const createInvoicePayment = async (
  newInvoicePaymentObject: InvoicePaymentInsert
): Promise<InvoicePayment> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE_PAYMENT)
    .insert(newInvoicePaymentObject)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as InvoicePayment;
};

// DELETE request to delete a invoice payment
export const deleteInvoicePayment = async (deleteInvoicePaymentObject: {
  item_id: number;
}): Promise<InvoicePayment> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE_PAYMENT)
    .delete()
    .eq('id', deleteInvoicePaymentObject.item_id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as InvoicePayment;
};

// DELETE request to delete all invoice payments that belong to a invoice number
export const deleteAllInvoicePaymentsByInvoiceNumber = async (
  invoiceNumber: number
): Promise<InvoicePayment[]> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE_PAYMENT)
    .delete()
    .eq('invoice_id', invoiceNumber)
    .select();

  if (error) {
    throw error;
  }
  return (data ?? []) as InvoicePayment[];
};
