import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import {
  InvoiceStatus,
  InvoiceStatusInsert,
  QuoteStatus,
  QuoteStatusInsert,
  QuoteRequestStatus,
  QuoteRequestStatusInsert
} from '../../types/db_types';

// Status types for type safety
export type StatusType = 'invoice' | 'quote' | 'quote_request';

// Unified status interface for all status types
export interface UnifiedStatus {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  type: StatusType;
}

// Status insert type
export interface StatusInsert {
  name: string;
  description?: string;
}

// API response types
export interface StatusResponse {
  data: UnifiedStatus[] | null;
  error: string | null;
}

export interface SingleStatusResponse {
  data: UnifiedStatus | null;
  error: string | null;
}

// Helper function to get the correct table name
const getTableName = (type: StatusType): string => {
  switch (type) {
    case 'invoice':
      return TABLES.INVOICE_STATUS;
    case 'quote':
      return TABLES.QUOTE_STATUS;
    case 'quote_request':
      return TABLES.QUOTE_REQUEST_STATUS;
    default:
      throw new Error(`Invalid status type: ${type}`);
  }
};

// Helper function to convert database rows to unified status
const convertToUnifiedStatus = (
  row: InvoiceStatus | QuoteStatus | QuoteRequestStatus,
  type: StatusType
): UnifiedStatus => ({
  id: row.id,
  name: row.name,
  description: row.description,
  created_at: row.created_at,
  updated_at: row.updated_at,
  type
});

/**
 * Fetch all statuses for a specific type
 */
export const fetchStatusesByType = async (type: StatusType): Promise<StatusResponse> => {
  try {
    const tableName = getTableName(type);

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error(`Error fetching ${type} statuses:`, error);
      return { data: null, error: error.message };
    }

    const unifiedData = data?.map((row) => convertToUnifiedStatus(row, type)) || [];

    return { data: unifiedData, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error in fetchStatusesByType:`, error);
    return { data: null, error: errorMessage };
  }
};

/**
 * Fetch all statuses from all types
 */
export const fetchAllStatuses = async (): Promise<StatusResponse> => {
  try {
    const [invoiceResult, quoteResult, quoteRequestResult] = await Promise.all([
      fetchStatusesByType('invoice'),
      fetchStatusesByType('quote'),
      fetchStatusesByType('quote_request')
    ]);

    // Check for any errors
    if (invoiceResult.error || quoteResult.error || quoteRequestResult.error) {
      const errors = [invoiceResult.error, quoteResult.error, quoteRequestResult.error]
        .filter(Boolean)
        .join(', ');
      return { data: null, error: `Errors occurred: ${errors}` };
    }

    // Combine all results
    const allStatuses = [
      ...(invoiceResult.data || []),
      ...(quoteResult.data || []),
      ...(quoteRequestResult.data || [])
    ];

    return { data: allStatuses, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error in fetchAllStatuses:`, error);
    return { data: null, error: errorMessage };
  }
};

/**
 * Create a new status
 */
export const createStatus = async (
  type: StatusType,
  statusData: StatusInsert
): Promise<SingleStatusResponse> => {
  try {
    const tableName = getTableName(type);

    // Check for duplicate names within the same type
    const { data: existing } = await supabase
      .from(tableName)
      .select('id, name')
      .eq('name', statusData.name.trim())
      .maybeSingle();

    if (existing) {
      return {
        data: null,
        error: `A ${type} status with the name "${statusData.name}" already exists`
      };
    }

    const insertData = {
      name: statusData.name.trim(),
      description: statusData.description?.trim() || null
    };

    const { data, error } = await supabase
      .from(tableName)
      .insert([insertData])
      .select('*')
      .single();

    if (error) {
      console.error(`Error creating ${type} status:`, error);

      // Handle unique constraint violations with user-friendly messages
      if (error.code === '23505' && error.message.includes('pkey')) {
        return {
          data: null,
          error: `Database primary key error. This usually happens when the database sequence is out of sync. Please refresh the page and try again, or contact support if the issue persists.`
        };
      }

      if (error.code === '23505') {
        return {
          data: null,
          error: `A status with this name already exists. Please choose a different name.`
        };
      }

      return { data: null, error: error.message };
    }

    const unifiedStatus = convertToUnifiedStatus(data, type);
    return { data: unifiedStatus, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error in createStatus:`, error);
    return { data: null, error: errorMessage };
  }
};

/**
 * Update an existing status
 */
export const updateStatus = async (
  type: StatusType,
  id: number,
  statusData: StatusInsert
): Promise<SingleStatusResponse> => {
  try {
    const tableName = getTableName(type);

    // Check for duplicate names (excluding current record)
    const { data: existing } = await supabase
      .from(tableName)
      .select('id, name')
      .eq('name', statusData.name.trim())
      .neq('id', id)
      .maybeSingle();

    if (existing) {
      return {
        data: null,
        error: `A ${type} status with the name "${statusData.name}" already exists`
      };
    }

    const { data, error } = await supabase
      .from(tableName)
      .update({
        name: statusData.name.trim(),
        description: statusData.description?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating ${type} status:`, error);
      return { data: null, error: error.message };
    }

    const unifiedStatus = convertToUnifiedStatus(data, type);
    return { data: unifiedStatus, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error in updateStatus:`, error);
    return { data: null, error: errorMessage };
  }
};

/**
 * Delete a status
 */
export const deleteStatus = async (
  type: StatusType,
  id: number
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const tableName = getTableName(type);

    // Check if status is being used in related tables
    let isInUse = false;
    let usageDetails = '';

    if (type === 'invoice') {
      const { data: invoices } = await supabase
        .from(TABLES.INVOICE)
        .select('id')
        .eq('invoice_status_id', id)
        .limit(1);

      if (invoices && invoices.length > 0) {
        isInUse = true;
        usageDetails = 'invoices';
      }
    } else if (type === 'quote') {
      const { data: quotes } = await supabase
        .from(TABLES.QUOTE)
        .select('id')
        .eq('status_id', id)
        .limit(1);

      if (quotes && quotes.length > 0) {
        isInUse = true;
        usageDetails = 'quotes';
      }
    } else if (type === 'quote_request') {
      const { data: quoteRequests } = await supabase
        .from(TABLES.QUOTE_REQUEST)
        .select('id')
        .eq('est_request_status_id', id)
        .limit(1);

      if (quoteRequests && quoteRequests.length > 0) {
        isInUse = true;
        usageDetails = 'quote requests';
      }
    }

    if (isInUse) {
      return {
        success: false,
        error: `Cannot delete this status because it is currently being used by existing ${usageDetails}.`
      };
    }

    const { error } = await supabase.from(tableName).delete().eq('id', id);

    if (error) {
      console.error(`Error deleting ${type} status:`, error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error in deleteStatus:`, error);
    return { success: false, error: errorMessage };
  }
};

/**
 * Get a single status by ID and type
 */
export const getStatusById = async (
  type: StatusType,
  id: number
): Promise<SingleStatusResponse> => {
  try {
    const tableName = getTableName(type);

    const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();

    if (error) {
      console.error(`Error fetching ${type} status by ID:`, error);
      return { data: null, error: error.message };
    }

    const unifiedStatus = convertToUnifiedStatus(data, type);
    return { data: unifiedStatus, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error in getStatusById:`, error);
    return { data: null, error: errorMessage };
  }
};

/**
 * Get usage statistics for a status
 */
export const getStatusUsage = async (
  type: StatusType,
  id: number
): Promise<{ count: number; error: string | null }> => {
  try {
    let count = 0;

    if (type === 'invoice') {
      const { count: invoiceCount, error } = await supabase
        .from(TABLES.INVOICE)
        .select('*', { count: 'exact', head: true })
        .eq('invoice_status_id', id);

      if (error) throw error;
      count = invoiceCount || 0;
    } else if (type === 'quote') {
      const { count: quoteCount, error } = await supabase
        .from(TABLES.QUOTE)
        .select('*', { count: 'exact', head: true })
        .eq('status_id', id);

      if (error) throw error;
      count = quoteCount || 0;
    } else if (type === 'quote_request') {
      const { count: quoteRequestCount, error } = await supabase
        .from(TABLES.QUOTE_REQUEST)
        .select('*', { count: 'exact', head: true })
        .eq('est_request_status_id', id);

      if (error) throw error;
      count = quoteRequestCount || 0;
    }

    return { count, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error in getStatusUsage:`, error);
    return { count: 0, error: errorMessage };
  }
};
