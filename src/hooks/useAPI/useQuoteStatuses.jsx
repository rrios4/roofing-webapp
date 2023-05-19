import { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';

export const useQuoteStatuses = () => {
  const [quoteStatuses, setQuoteStatuses] = useState([]);

  const fetchQuoteStatuses = async () => {
    const { data, error } = await supabase
      .from('quote_status')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.log(error);
    }
    setQuoteStatuses(data);
  };

  useEffect(() => {
    fetchQuoteStatuses();
  }, []);

  return { quoteStatuses, setQuoteStatuses, fetchQuoteStatuses };
};
