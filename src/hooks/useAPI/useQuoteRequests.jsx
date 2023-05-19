import { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';

export const useQuoteRequests = () => {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [quoteRequestLoadingStateIsOn, setQuoteRequestLoadingStateIsOn] = useState(false);

  const fetchQuoteRequests = async () => {
    setQuoteRequestLoadingStateIsOn(true);
    const { data, error } = await supabase
      .from('quote_request')
      .select(
        '*, services:service_type_id(*), customer_type:customer_typeID(*), estimate_request_status:est_request_status_id(*)'
      )
      .order('est_request_status_id', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error);
    }
    setQuoteRequests(data);
    setQuoteRequestLoadingStateIsOn(false);
    // console.log(data);
  };

  useEffect(() => {
    fetchQuoteRequests();
  }, []);

  return { quoteRequests, setQuoteRequests, fetchQuoteRequests, quoteRequestLoadingStateIsOn };
};
