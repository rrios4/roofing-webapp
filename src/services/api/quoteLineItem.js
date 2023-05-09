import supabase from '../../utils/supabaseClient';

// Delete request that will delete all line item that belong to a quote number
export const deleteQuoteLineItems = async (quoteNumber) => {
  const { data, error } = await supabase
    .from('quote_line_item')
    .delete()
    .eq('quote_id', quoteNumber);

  if (error) {
    console.log(error.message);
    throw error;
  }
  return data;
};
