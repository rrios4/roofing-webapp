import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { QuoteStatus } from '../../types/db_types';

// GET request that returns a list of all quote statuses from DB
export const fetchAllQuoteStatuses = async (): Promise<QuoteStatus[]> => {
  const { data, error } = await supabase
    .from(TABLES.QUOTE_STATUS)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
    throw error;
  }
  return data as QuoteStatus[];
};
