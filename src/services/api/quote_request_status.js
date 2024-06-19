import supabase from '../../lib/supabase-client';

// Get request that will get all qr statuses from database
export const fetchAllQuoteRequestStatuses = async () => {
  const { data, error } = await supabase
    .from('quote_request_status')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
  }
  return data;
};
