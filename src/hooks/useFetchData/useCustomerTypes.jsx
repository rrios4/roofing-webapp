import { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';

export const useCustomerTypes = () => {
  const [customerTypes, setCustomerTypes] = useState([]);

  const fetchCustomerTypes = async () => {
    const { data, error } = await supabase
      .from('customer_type')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.log(error);
    }
    setCustomerTypes(data);
  };

  useEffect(() => {
    fetchCustomerTypes();
  }, []);

  return { customerTypes, setCustomerTypes, fetchCustomerTypes };
};
