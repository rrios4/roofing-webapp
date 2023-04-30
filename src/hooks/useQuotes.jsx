import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';
import { useQuery } from '@tanstack/react-query';

// GET request to API for all quotes
const fetchQuotes = async () => {
  const { data, error } = await supabase
    .from('quote')
    .select(`*, customer:customer_id(*), quote_status:status_id(*), services:service_id(*)`)
    .order('status_id', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.log(error);
  }
  return data;
};

export const useQuotes = () => {
  // React-Query
  const {
    data: quotes,
    isLoading,
    isError
  } = useQuery({ queryKey: ['quotes'], queryFn: () => fetchQuotes() });

  return { quotes, isLoading, isError };
};
