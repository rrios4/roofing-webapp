import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { QuoteRequestStatus } from '../../types/db_types';

// Get request that will get all qr statuses from database
export const fetchAllQuoteRequestStatuses = async (): Promise<QuoteRequestStatus[]> => {
  const { data, error } = await supabase
    .from(TABLES.QUOTE_REQUEST_STATUS)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
    throw error;
  }
  return data as QuoteRequestStatus[];
};
