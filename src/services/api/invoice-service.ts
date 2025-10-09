import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import {
  Invoice,
  InvoiceWithRelations,
  InvoiceInsert,
  InvoiceLineService,
  InvoicePayment
} from '../../types/db_types';

// GET request to fetch all invoices
export const fetchAllInvoices = async (): Promise<InvoiceWithRelations[]> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE)
    .select(
      `
      *,
      customer (
        id,
        first_name,
        last_name,
        email,
        phone_number,
        street_address,
        city,
        state,
        zipcode
      ),
      service (
        id,
        name,
        description,
        default_price,
        created_at,
        updated_at
      ),
      invoice_status (
        id,
        name,
        description,
        created_at,
        updated_at
      )
    `
    )
    .order('invoice_number', { ascending: false })
    .order('invoice_status_id', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.log(error.message);
    throw error;
  }
  return data as InvoiceWithRelations[];
};

// GET request to get invoice by id
export const fetchInvoiceById = async (
  invoice_number: number
): Promise<
  InvoiceWithRelations & {
    invoice_line_service: InvoiceLineService[];
    invoice_payment: InvoicePayment[];
  }
> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE)
    .select(
      `
      *,
      customer (
        id,
        first_name,
        last_name,
        email,
        phone_number,
        street_address,
        city,
        state,
        zipcode
      ),
      invoice_status (
        id,
        name,
        description,
        created_at,
        updated_at
      ),
      service (
        id,
        name,
        description,
        default_price,
        created_at,
        updated_at
      ),
      invoice_line_service (
        id,
        invoice_id,
        service_id,
        sq_ft,
        qty,
        rate,
        amount,
        description,
        fixed_item,
        created_at,
        updated_at
      ),
      invoice_payment (
        id,
        invoice_id,
        payment_method,
        amount,
        date_received,
        created_at,
        updated_at
      )
    `
    )
    .eq('invoice_number', invoice_number)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }
  return data as InvoiceWithRelations & {
    invoice_line_service: InvoiceLineService[];
    invoice_payment: InvoicePayment[];
  };
};

// POST request to create a new invoice
export const createNewInvoice = async (newInvoiceObject: InvoiceInsert): Promise<Invoice> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE)
    .insert(newInvoiceObject)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Invoice;
};

// DELETE request to delete invoice by id
export const deleteInvoiceById = async (invoiceNumber: number): Promise<void> => {
  const { error } = await supabase
    .from(TABLES.INVOICE)
    .delete()
    .eq('invoice_number', invoiceNumber);

  if (error) {
    throw error;
  }
};

// PUT request to update invoice
export const updateInvoice = async (
  updateInvoiceObject: [Partial<Invoice>, { invoice_number: number }]
): Promise<number> => {
  const { error } = await supabase
    .from(TABLES.INVOICE)
    .update(updateInvoiceObject[0])
    .eq('invoice_number', updateInvoiceObject[1].invoice_number);

  if (error) {
    throw error;
  }
  return updateInvoiceObject[1].invoice_number;
};

// PUT request to update invoice status
export const updateInvoiceStatusById = async (updateInvoiceStatusObject: {
  status_id: number;
  invoice_number: number;
}): Promise<number> => {
  const { error } = await supabase
    .from(TABLES.INVOICE)
    .update({ invoice_status_id: updateInvoiceStatusObject.status_id })
    .eq('invoice_number', updateInvoiceStatusObject.invoice_number);

  if (error) {
    throw error;
  }
  return updateInvoiceStatusObject.invoice_number;
};
