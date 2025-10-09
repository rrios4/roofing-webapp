import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { InvoiceStatus } from '../../types/db_types';

// GET request that returns a list of all invoices statuses from DB
export const fetchAllInvoiceStatuses = async (): Promise<InvoiceStatus[]> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE_STATUS)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
    throw error;
  }
  return data as InvoiceStatus[];
};
