import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import {
  Quote,
  QuoteWithRelations,
  QuoteLineItem,
  Customer,
  QuoteStatus
} from '../../types/db_types';

// GET request to API for all quotes
export const fetchQuotes = async (): Promise<QuoteWithRelations[]> => {
  const { data, error } = await supabase
    .from(TABLES.QUOTE)
    .select(`
      *,
      customer (
        id,
        first_name,
        last_name,
        email,
        phone_number,
        street_address,
        city,
        state,
        zipcode
      ),
      quote_status (
        id,
        name,
        description,
        created_at,
        updated_at
      ),
      service (
        id,
        name,
        description,
        default_price,
        created_at,
        updated_at
      )
    `)
    // .order('updated_at', { ascending: false })
    .order('quote_number', { ascending: false });

if (error) {
  console.log(error);
  throw error;
}
return data as QuoteWithRelations[];
};

// GET request to API to obtain quote by id
export const fetchQuoteById = async (quote_number: number): Promise<QuoteWithRelations | null> => {
  const { data, error } = await supabase
    .from(TABLES.QUOTE)
    .select(`
      *,
      customer (
        id,
        first_name,
        last_name,
        email,
        phone_number
      ),
      quote_status (
        id,
        name,
        description,
        created_at,
        updated_at
      ),
      service (
        id,
        name,
        description,
        default_price,
        created_at,
        updated_at
      ),
      quote_line_item (
        id,
        quote_id,
        service_id,
        qty,
        amount,
        rate,
        sq_ft,
        description,
        fixed_item,
        subtotal,
        created_at,
        updated_at
      )
    `)
    .eq('quote_number', quote_number);

  if (error) {
    console.log(error);
    throw error;
  }
  return data[0] as QuoteWithRelations | null;
};

// GET request to API to search quote by query
export const fetchSearchQuotes = async (query: string): Promise<QuoteWithRelations[]> => {
  let { data, error } = await supabase
    .from('quote')
    .select(`
      *,
      customer (
        id,
        first_name,
        last_name,
        email,
        phone_number
      )
    `)
    .textSearch(
      'quote_number,custom_street_address,custom_city,custom_state,custom_zipcode',
      query
    );
  if (error) {
    console.log(error);
    throw error;
  }
  // console.log(data);
  return data as QuoteWithRelations[];
};

// PATCH request to API to update a quote
export const updateQuoteById = async (quoteObject: Partial<Quote>): Promise<Quote | null> => {
  const { data, error } = await supabase
    .from(TABLES.QUOTE)
    .update({
      status_id: quoteObject.status_id,
      service_id: quoteObject.service_id,
      quote_date: quoteObject.quote_date ? quoteObject.quote_date : null,
      issue_date: quoteObject.issue_date ? quoteObject.issue_date : null,
      expiration_date: quoteObject.expiration_date ? quoteObject.expiration_date : null,
      private_note: quoteObject.private_note,
      measurement_note: quoteObject.measurement_note,
      public_note: quoteObject.public_note,
      updated_at: new Date().toISOString()
    })
    .eq('quote_number', quoteObject.quote_number);

  if (error) {
    throw error;
  }
  return data as Quote | null;
};

// DELETE request to API to delete a quote by id
export const deleteQuoteById = async (quoteNumber: number): Promise<any> => {
  const { data, error } = await supabase.from(TABLES.QUOTE).delete().eq('quote_number', quoteNumber);

  if (error) {
    throw error;
  }
  return data;
};

// PATCH request to API to update the status for a quote
export const updateQuoteStatusById = async (status_id: number, quote_number: number): Promise<Quote | null> => {
  console.log(status_id);
  console.log(quote_number);
  const { data, error } = await supabase
    .from(TABLES.QUOTE)
    .update({ status_id: status_id })
    .eq('quote_number', quote_number);

  if (error) {
    throw error;
  }
  return data as Quote | null;
};
