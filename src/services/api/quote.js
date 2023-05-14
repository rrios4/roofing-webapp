import supabase from '../../utils/supabaseClient';

// GET request to API for all quotes
export const fetchQuotes = async () => {
  const { data, error } = await supabase
    .from('quote')
    .select(`*, customer:customer_id(*), quote_status:status_id(*), services:service_id(*)`)
    .order('status_id', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.log(error);
  }
  return data;
};

// GET request to API to obtain quote by id
export const fetchQuoteById = async (quote_number) => {
  const { data, error } = await supabase
    .from('quote')
    .select(
      '*, customer:customer_id(*), quote_status:status_id(*), services:service_id(*), quote_line_item(*)'
    )
    .eq('quote_number', quote_number);

  if (error) {
    console.log(error);
  }
  return data[0];
};

// GET request to API to search quote by query
export const fetchSearchQuotes = async (query) => {
  let { data, error } = await supabase
    .from('quote')
    .select('*, customer:customer_id(*)')
    .textSearch(
      ['quote_number', 'custom_street_address', 'custom_city', 'custom_state', 'custom_zipcode'],
      query
    );
  if (error) {
    console.log(error);
  }
  console.log(data);
  return data;
};

// PATCH request to API to update a quote
export const updateQuoteById = async (quoteObject) => {
  const { data, error } = await supabase
    .from('quote')
    .update({
      status_id: quoteObject.status_id,
      service_id: quoteObject.service_id,
      quote_date: quoteObject.quote_date ? quoteObject.quote_date : null,
      issue_date: quoteObject.issue_date ? quoteObject.issue_date : null,
      expiration_date: quoteObject.expiration_date ? quoteObject.expiration_date : null,
      note: quoteObject.note,
      measurement_note: quoteObject.measurement_note,
      cust_note: quoteObject.cust_note,
      updated_at: new Date()
    })
    .eq('quote_number', quoteObject.quote_number);

  if (error) {
    throw error;
  }
  return data;
};

// DELETE request to API to delete a quote by id
export const deleteQuoteById = async (quoteNumber) => {
  const { data, error } = await supabase.from('quote').delete().eq('quote_number', quoteNumber);

  if (error) {
    throw error;
  }
  return data;
};

// PATCH request to API to update the status for a quote
export const updateQuoteStatusById = async (status_id, quote_number) => {
  console.log(status_id);
  console.log(quote_number);
  const { data, error } = await supabase
    .from('quote')
    .update({ status_id: status_id })
    .eq('quote_number', quote_number);

  if (error) {
    throw error;
  }
  return data;
};
