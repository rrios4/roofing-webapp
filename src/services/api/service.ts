import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { Service } from '../../types/db_types';

// GET request that will give a list of all roofing services
export const fetchAllServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from(TABLES.SERVICE)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
    throw error;
  }
  return data as Service[];
};
