import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { Service } from '../../types/db_types';

// Interface for creating/updating services
export interface CreateServicePayload {
  name: string;
  description?: string;
  default_price?: string;
}

export interface UpdateServicePayload extends CreateServicePayload {
  id: number;
}

// GET request that will give a list of all roofing services
export const fetchAllServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from(TABLES.SERVICE)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
    throw error;
  }
  return data as Service[];
};

// GET request to fetch a single service by ID
export const fetchServiceById = async (id: number): Promise<Service> => {
  const { data, error } = await supabase.from(TABLES.SERVICE).select('*').eq('id', id).single();

  if (error) {
    console.log('Error fetching service:', error);
    throw error;
  }
  return data as Service;
};

// POST request to create a new service
export const createService = async (serviceData: CreateServicePayload): Promise<Service> => {
  console.log('Creating service with data:', serviceData);
  const { data, error } = await supabase
    .from(TABLES.SERVICE)
    .insert([serviceData])
    .select()
    .single();

  if (error) {
    console.log('Error creating service:', error);
    throw error;
  }
  return data as Service;
};

// PUT request to update an existing service
export const updateService = async (serviceData: UpdateServicePayload): Promise<Service> => {
  const { id, ...updateData } = serviceData;

  const { data, error } = await supabase
    .from(TABLES.SERVICE)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.log('Error updating service:', error);
    throw error;
  }
  return data as Service;
};

// DELETE request to delete a service
export const deleteService = async (id: number): Promise<void> => {
  const { error } = await supabase.from(TABLES.SERVICE).delete().eq('id', id);

  if (error) {
    console.log('Error deleting service:', error);
    throw error;
  }
};
