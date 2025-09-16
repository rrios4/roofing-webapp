import { TABLES } from '../../lib/db-tables';
import supabase from '../../lib/supabase-client';
import { CustomerType } from '../../types/db_types';

// GET request to get all customer types from DB
export const fetchAllCustomerTypes = async (): Promise<CustomerType[]> => {
  const { data, error } = await supabase
    .from(TABLES.CUSTOMER_TYPE)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
    throw error;
  }
  return data as CustomerType[];
};
