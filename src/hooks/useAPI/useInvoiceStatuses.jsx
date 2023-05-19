import { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';

export const useInvoiceStatuses = () => {
  const [invoiceStatuses, setInvoiceStatuses] = useState([]);

  const fetchInvoiceStatuses = async () => {
    const { data, error } = await supabase
      .from('invoice_status')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.log(error);
    }
    setInvoiceStatuses(data);
  };

  useEffect(() => {
    fetchInvoiceStatuses();
  }, []);

  return { invoiceStatuses, setInvoiceStatuses };
};
