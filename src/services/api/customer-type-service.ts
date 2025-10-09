import { TABLES } from '../../lib/db-tables';
import supabase from '../../lib/supabase-client';
import { CustomerType } from '../../types/db_types';

export interface CreateCustomerTypePayload {
  name: string;
  description?: string;
}

export interface UpdateCustomerTypePayload extends CreateCustomerTypePayload {
  id: number;
}

export interface CustomerTypeUsage {
  customerCount: number;
  canDelete: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface ApiResponseSuccess {
  success: boolean;
  error?: string;
}

// GET request to get all customer types from DB
export const fetchAllCustomerTypes = async (): Promise<ApiResponse<CustomerType[]>> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.CUSTOMER_TYPE)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching customer types:', error);
      return { data: null, error: `Failed to fetch customer types: ${error.message}` };
    }

    return { data: data || [], error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in fetchAllCustomerTypes:', error);
    return { data: null, error: errorMessage };
  }
};

// Fetch single customer type by ID
export const fetchCustomerTypeById = async (id: number): Promise<ApiResponse<CustomerType>> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.CUSTOMER_TYPE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { data: null, error: 'Customer type not found' };
      }
      return { data: null, error: `Failed to fetch customer type: ${error.message}` };
    }

    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in fetchCustomerTypeById:', error);
    return { data: null, error: errorMessage };
  }
};

// Create new customer type
export const createCustomerType = async (
  payload: CreateCustomerTypePayload
): Promise<ApiResponse<CustomerType>> => {
  try {
    // Check for duplicate names
    const { data: existing } = await supabase
      .from(TABLES.CUSTOMER_TYPE)
      .select('id, name')
      .eq('name', payload.name.trim())
      .maybeSingle();

    if (existing) {
      return {
        data: null,
        error: `A customer type with the name "${payload.name}" already exists`
      };
    }

    const cleanData = {
      name: payload.name.trim(),
      description: payload.description?.trim() || null
    };

    const { data, error } = await supabase
      .from(TABLES.CUSTOMER_TYPE)
      .insert(cleanData)
      .select()
      .single();

    if (error) {
      console.error('Error creating customer type:', error);

      // Handle unique constraint violations with user-friendly messages
      if (error.code === '23505' && error.message.includes('pkey')) {
        return {
          data: null,
          error: `Database primary key error. Please refresh the page and try again.`
        };
      }

      if (error.code === '23505') {
        return {
          data: null,
          error: `A customer type with this name already exists. Please choose a different name.`
        };
      }

      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error creating customer type:', error);
    return { data: null, error: errorMessage };
  }
};

// Update existing customer type
export const updateCustomerType = async (
  payload: UpdateCustomerTypePayload
): Promise<ApiResponse<CustomerType>> => {
  try {
    // Check for duplicate names (excluding current record)
    const { data: existing } = await supabase
      .from(TABLES.CUSTOMER_TYPE)
      .select('id, name')
      .eq('name', payload.name.trim())
      .neq('id', payload.id)
      .maybeSingle();

    if (existing) {
      return {
        data: null,
        error: `A customer type with the name "${payload.name}" already exists`
      };
    }

    const cleanData = {
      name: payload.name.trim(),
      description: payload.description?.trim() || null
    };

    const { data, error } = await supabase
      .from(TABLES.CUSTOMER_TYPE)
      .update(cleanData)
      .eq('id', payload.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer type:', error);

      if (error.code === '23505') {
        return {
          data: null,
          error: `A customer type with this name already exists. Please choose a different name.`
        };
      }

      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating customer type:', error);
    return { data: null, error: errorMessage };
  }
};

// Delete customer type
export const deleteCustomerType = async (id: number): Promise<ApiResponseSuccess> => {
  try {
    // First check if customer type is being used
    const { count: customerCount } = await supabase
      .from(TABLES.CUSTOMER)
      .select('id', { count: 'exact', head: true })
      .eq('customer_type_id', id);

    if (customerCount && customerCount > 0) {
      return {
        success: false,
        error: `Cannot delete customer type. It is being used by ${customerCount} customer(s).`
      };
    }

    const { error } = await supabase.from(TABLES.CUSTOMER_TYPE).delete().eq('id', id);

    if (error) {
      console.error('Error deleting customer type:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error deleting customer type:', error);
    return { success: false, error: errorMessage };
  }
};

// Get customer type usage statistics
export const getCustomerTypeUsage = async (id: number): Promise<ApiResponse<CustomerTypeUsage>> => {
  try {
    const { count: customerCount } = await supabase
      .from(TABLES.CUSTOMER)
      .select('id', { count: 'exact', head: true })
      .eq('customer_type_id', id);

    const usage: CustomerTypeUsage = {
      customerCount: customerCount || 0,
      canDelete: !customerCount || customerCount === 0
    };

    return { data: usage, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error getting customer type usage:', error);
    return {
      data: { customerCount: 0, canDelete: true },
      error: errorMessage
    };
  }
};
