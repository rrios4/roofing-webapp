import supabase from '../../lib/supabase-client';

// DELETE request that will delete all line item that belong to a quote number
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

// POST request that will create a new line item
export const createQuoteLineItem = async (lineItemObject) => {
  const { data, error } = await supabase.from('quote_line_item').insert(lineItemObject);
  if (error) {
    throw error;
  }
  return data;
};

// DELETE request that will delete a line-item by id
export const deleteQuoteLineItemById = async (item) => {
  const { data, error } = await supabase.from('quote_line_item').delete().eq('id', item.id);
  if (error) {
    throw error;
  }
  return data;
};
