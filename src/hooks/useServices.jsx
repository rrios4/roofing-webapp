import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

export const useServices = () => {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('service')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.log(error);
    }
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, setServices, fetchServices };
};
