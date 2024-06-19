import supabase from '../../lib/supabase-client';

// GET request to get all customer types from DB
export const fetchAllCustomerTypes = async () => {
  const { data, error } = await supabase
    .from('customer_type')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
  }
  return data;
};
