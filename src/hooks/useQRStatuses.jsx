import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

export const useQRStatuses = () => {
  const [qrStatuses, setQrStatuses] = useState([]);

  const fetchQRStatuses = async () => {
    const { data, error } = await supabase
      .from('estimate_request_status')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.log(error);
    }
    setQrStatuses(data);
  };

  useEffect(() => {
    fetchQRStatuses();
  }, []);

  return { qrStatuses, setQrStatuses, fetchQRStatuses };
};
