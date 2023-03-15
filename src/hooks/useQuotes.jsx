import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [quotesLoadingStateIsOn, setQuotesLoadingStateIsOn] = useState(false);

  const fetchQuotes = async () => {
    setQuotesLoadingStateIsOn(true);
    const { data, error } = await supabase
      .from('quote')
      .select(`*, customer:customer_id(*), quote_status:status_id(*), services:service_id(*)`)
      .order('status_id', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) {
      console.log(error);
    }
    setQuotes(data);
    setQuotesLoadingStateIsOn(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return { quotes, setQuotes, fetchQuotes, quotesLoadingStateIsOn };
};
