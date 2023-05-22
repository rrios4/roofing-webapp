import supabase from '../../utils/supabaseClient';

// GET request to get all quote request from database
export const fetchAllQuoteRequests = async () => {
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
  return data;
};

// DELETE request to delete a qr by id
export const deleteQuoteRequestById = async (itemId) => {
  const { error } = await supabase.from('quote_request').delete().eq('id', itemId);
  if (error) {
    throw error;
  }
  return itemId;
};

// PUT request to update a quote request
export const updateQuoteRequestById = async (updatedQRObject) => {
  const { error } = await supabase
    .from('quote_request')
    .update(updatedQRObject)
    .eq('id', updatedQRObject.id);

  if (error) {
    throw error;
  }
  return updatedQRObject.id;
};
