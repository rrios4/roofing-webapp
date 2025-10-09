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
    .select(
      `
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
    `
    )
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
    .select(
      `
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
    `
    )
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
    .select(
      `
      *,
      customer (
        id,
        first_name,
        last_name,
        email,
        phone_number
      )
    `
    )
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
  const { data, error } = await supabase
    .from(TABLES.QUOTE)
    .delete()
    .eq('quote_number', quoteNumber);

  if (error) {
    throw error;
  }
  return data;
};

// PATCH request to API to update the status for a quote
export const updateQuoteStatusById = async (
  status_id: number,
  quote_number: number
): Promise<Quote | null> => {
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

// Get next available invoice number
export const getNextInvoiceNumber = async (): Promise<number> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE)
    .select('invoice_number')
    .order('invoice_number', { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  const lastInvoiceNumber = data && data.length > 0 ? data[0].invoice_number : 0;
  return lastInvoiceNumber + 1;
};

// Get existing invoice for a converted quote
export const getInvoiceByQuoteNumber = async (quote_number: number): Promise<any | null> => {
  const { data, error } = await supabase
    .from(TABLES.INVOICE)
    .select('*')
    .eq('converted_from_quote_number', quote_number)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data || null;
};

// Convert quote to invoice - comprehensive function
export const convertQuoteToInvoice = async (
  quote_number: number
): Promise<{
  quote: Quote | null;
  invoice: any;
  invoiceLineItems: any[];
}> => {
  // First, check if this quote has already been converted
  const { data: existingInvoice, error: existingInvoiceError } = await supabase
    .from(TABLES.INVOICE)
    .select('*')
    .eq('converted_from_quote_number', quote_number)
    .single();

  if (existingInvoiceError && existingInvoiceError.code !== 'PGRST116') {
    // PGRST116 is "not found", which is what we want. Any other error should be thrown.
    throw existingInvoiceError;
  }

  if (existingInvoice) {
    // Quote has already been converted, return the existing invoice
    throw new Error(
      `This quote has already been converted to Invoice #${existingInvoice.invoice_number}. Each quote can only be converted once.`
    );
  }

  // Fetch the complete quote data with line items
  const { data: quoteData, error: quoteError } = await supabase
    .from(TABLES.QUOTE)
    .select(
      `
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
      service (
        id,
        name,
        description,
        default_price
      ),
      quote_line_item (
        *
      )
    `
    )
    .eq('quote_number', quote_number)
    .single();

  if (quoteError) {
    throw quoteError;
  }

  // Double-check that the quote hasn't been converted already (database level check)
  if (quoteData.converted) {
    throw new Error(
      `This quote has already been marked as converted. Please refresh the page and try again.`
    );
  }

  // Get next invoice number
  const nextInvoiceNumber = await getNextInvoiceNumber();

  // Get default invoice status (typically "Pending" or "Draft")
  const { data: invoiceStatuses, error: statusError } = await supabase
    .from(TABLES.INVOICE_STATUS)
    .select('*')
    .order('id', { ascending: true })
    .limit(1);

  if (statusError) {
    throw statusError;
  }

  const defaultStatusId = invoiceStatuses && invoiceStatuses.length > 0 ? invoiceStatuses[0].id : 1;

  // Create the invoice
  const today = new Date().toISOString().split('T')[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // 30 days from today

  const invoiceData = {
    invoice_number: nextInvoiceNumber,
    customer_id: quoteData.customer_id,
    service_type_id: quoteData.service_id,
    invoice_status_id: defaultStatusId,
    invoice_date: today,
    issue_date: today,
    due_date: dueDate.toISOString().split('T')[0],
    subtotal: quoteData.subtotal,
    total: quoteData.total,
    amount_due: quoteData.total,
    sqft_measurement: quoteData.measurement_note || '',
    note: quoteData.note || '',
    cust_note: quoteData.cust_note || '',
    private_note: quoteData.private_note || '',
    public_note: quoteData.public_note || '',
    converted_from_quote_number: quote_number,
    // Bill from (company) address
    bill_from_street_address: '150 Tallant St',
    bill_from_city: 'Houston',
    bill_from_state: 'TX',
    bill_from_zipcode: '77076',
    bill_from_email: 'rrios.roofing@gmail.com',
    // Bill to (customer) address
    bill_to_street_address: quoteData.custom_address
      ? quoteData.custom_street_address || ''
      : quoteData.customer?.street_address || '',
    bill_to_city: quoteData.custom_address
      ? quoteData.custom_city || ''
      : quoteData.customer?.city || '',
    bill_to_state: quoteData.custom_address
      ? quoteData.custom_state || ''
      : quoteData.customer?.state || '',
    bill_to_zipcode: quoteData.custom_address
      ? quoteData.custom_zipcode || ''
      : quoteData.customer?.zipcode || '',
    bill_to: false // Default to false, can be customized later
  };

  // Create the invoice
  const { data: invoiceResult, error: invoiceError } = await supabase
    .from(TABLES.INVOICE)
    .insert(invoiceData)
    .select()
    .single();

  if (invoiceError) {
    console.error('Invoice creation error:', invoiceError);
    throw invoiceError;
  }

  // console.log('Created invoice:', invoiceResult);

  // Create invoice line items if quote has line items
  let invoiceLineItems = [];
  if (quoteData.quote_line_item && quoteData.quote_line_item.length > 0) {
    // console.log('Using invoice_number for line items:', invoiceResult.invoice_number);
    const lineItemsToInsert = quoteData.quote_line_item.map((lineItem: any) => ({
      invoice_id: invoiceResult.invoice_number,
      service_id: lineItem.service_id,
      qty: lineItem.qty,
      amount: lineItem.amount, // Use amount from quote line item
      rate: lineItem.rate,
      sq_ft: lineItem.sq_ft,
      description: lineItem.description,
      fixed_item: lineItem.fixed_item
    }));

    const { data: lineItemResults, error: lineItemError } = await supabase
      .from(TABLES.INVOICE_LINE_SERVICE)
      .insert(lineItemsToInsert)
      .select();

    if (lineItemError) {
      throw lineItemError;
    }

    invoiceLineItems = lineItemResults || [];
  }

  // Mark the quote as converted
  const { data: updatedQuote, error: updateError } = await supabase
    .from(TABLES.QUOTE)
    .update({ converted: true })
    .eq('quote_number', quote_number)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return {
    quote: updatedQuote,
    invoice: invoiceResult,
    invoiceLineItems
  };
};
