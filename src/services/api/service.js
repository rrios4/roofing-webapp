import supabase from '../../lib/supabase-client';

// GET request that will give a list of all roofing services
export const fetchAllServices = async () => {
  const { data, error } = await supabase
    .from('service')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
  }
  return data;
};
