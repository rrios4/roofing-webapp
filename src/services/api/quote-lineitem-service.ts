import supabase from '../../lib/supabase-client';
import { QuoteLineItem, QuoteLineItemInsert } from '../../types/db_types';

// DELETE request that will delete all line item that belong to a quote number
export const deleteQuoteLineItems = async (quoteNumber: number): Promise<QuoteLineItem[]> => {
  const { data, error } = await supabase
    .from('quote_line_item')
    .delete()
    .eq('quote_id', quoteNumber);

  if (error) {
    console.log(error.message);
    throw error;
  }
  return (data ?? []) as QuoteLineItem[];
};

// POST request that will create a new line item
export const createQuoteLineItem = async (lineItemObject: QuoteLineItemInsert) => {
  const { data, error } = await supabase.from('quote_line_item').insert(lineItemObject);
  if (error) {
    throw error;
  }
  return data;
};

// DELETE request that will delete a line-item by id
export const deleteQuoteLineItemById = async (item: QuoteLineItem) => {
  const { data, error } = await supabase.from('quote_line_item').delete().eq('id', item.id);
  if (error) {
    throw error;
  }
  return data;
};
