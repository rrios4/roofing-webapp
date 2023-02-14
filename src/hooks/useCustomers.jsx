import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [customersLoadingStateIsOn, setCustomersLoadingStateIsOn] = useState(false);

  const fetchCustomers = async () => {
    setCustomersLoadingStateIsOn(true);
    const { data, error } = await supabase.from('customer').select('*');

    if (error) {
      console.log(error);
    }
    setCustomers(data);
    setCustomersLoadingStateIsOn(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, setCustomers, fetchCustomers, customersLoadingStateIsOn };
};
