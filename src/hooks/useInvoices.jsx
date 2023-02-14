import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoadingStateIsOn, setInvoicesLoadingStateIsOn] = useState(false);

  const fetchInvoices = async () => {
    setInvoicesLoadingStateIsOn(true);
    const { data, error } = await supabase
      .from('invoice')
      .select(
        `*, customer:customer_id(*), services:service_type_id(*), invoice_status:invoice_status_id(*)`
      )
      .order('invoice_status_id', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) {
      console.log(error.message);
    }
    setInvoices(data);
    setInvoicesLoadingStateIsOn(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return { invoices, fetchInvoices, setInvoices, invoicesLoadingStateIsOn };
};
