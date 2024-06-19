import { useEffect, useState } from 'react';  
import supabase from '../../lib/supabase-client';

export const useQuoteStatuses = () => {
  const [quoteStatuses, setQuoteStatuses] = useState<any>([]);

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
