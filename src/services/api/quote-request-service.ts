import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { QuoteRequest, QuoteRequestInsert, QuoteRequestWithRelations } from '../../types/db_types';

// GET request to get all quote request from database
export const fetchAllQuoteRequests = async (): Promise<QuoteRequestWithRelations[]> => {
  const { data, error } = await supabase
    .from(TABLES.QUOTE_REQUEST)
    .select(
      `
      *,
      service (
        id,
        name,
        description,
        default_price,
        created_at,
        updated_at
      ),
      customer_type (
        id,
        name,
        description,
        created_at,
        updated_at
      ),
      quote_request_status (
        id,
        name,
        description,
        created_at,
        updated_at
      )
    `
    )
    .order('est_request_status_id', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    throw error;
  }

  // Transform joined arrays to single objects
  const transformedData = data?.map((request: any) => ({
    ...request,
    service: Array.isArray(request.service) ? request.service[0] : request.service,
    customer_type: Array.isArray(request.customer_type)
      ? request.customer_type[0]
      : request.customer_type,
    status: Array.isArray(request.quote_request_status)
      ? request.quote_request_status[0]
      : request.quote_request_status
  }));

  return transformedData as QuoteRequestWithRelations[];
};

// POST request to create a new qr
export const createNewQuoteRequest = async (
  newQuoteRequest: QuoteRequestInsert
): Promise<QuoteRequest> => {
  const { data, error } = await supabase
    .from(TABLES.QUOTE_REQUEST)
    .insert(newQuoteRequest)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as QuoteRequest;
};

// DELETE request to delete a qr by id
export const deleteQuoteRequestById = async (itemId: number): Promise<void> => {
  const { error } = await supabase.from(TABLES.QUOTE_REQUEST).delete().eq('id', itemId);

  if (error) {
    throw error;
  }
};

// PUT request to update a quote request
export const updateQuoteRequestById = async (
  updatedQRObject: Partial<QuoteRequest> & { id: number }
): Promise<QuoteRequest> => {
  const { data, error } = await supabase
    .from(TABLES.QUOTE_REQUEST)
    .update(updatedQRObject)
    .eq('id', updatedQRObject.id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as QuoteRequest;
};
