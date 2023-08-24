import { useQuery } from '@tanstack/react-query';
import {
  fetchTotalAcceptedQuotes,
  fetchTotalClosedLeads,
  fetchTotalCommercialCustomers,
  fetchTotalCustomers,
  fetchTotalNewLeads,
  fetchTotalOverdueInvoices,
  fetchTotalPaidInvoices,
  fetchTotalPendingInvoices,
  fetchTotalPendingQuotes,
  fetchTotalRejectedQuotes,
  fetchTotalResidentialCustomers,
  fetchTotalScheduledLeads
  // @ts-ignore
} from '../../services/api/report_services';

// Custom hook that use react query to fetch total new leads count
export const useFetchTotalNewLeads = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalNewLeads'],
    queryFn: () => fetchTotalNewLeads()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalScheduledLeads = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalScheduledLeads'],
    queryFn: () => fetchTotalScheduledLeads()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalClosedLeads = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalClosedLeads'],
    queryFn: () => fetchTotalClosedLeads()
  });
  return { data, isLoading, isError };
};

// Custom hook that uses react-query to fetch customer counts
export const useFetchTotalCustomers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalCustomers'],
    queryFn: () => fetchTotalCustomers()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalResidentialCustomers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalResidentialCustomers'],
    queryFn: () => fetchTotalResidentialCustomers()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalCommercialCustomers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalCommercialCustomers'],
    queryFn: () => fetchTotalCommercialCustomers()
  });
  return { data, isLoading, isError };
};

// Custom hook using react-query to get count of invoices
export const useFetchTotalOverdueInvoices = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalOverdueInvoices'],
    queryFn: () => fetchTotalOverdueInvoices()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalPendingInvoices = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalPendingInvoices'],
    queryFn: () => fetchTotalPendingInvoices()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalPaidInvoices = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalPaidInvoices'],
    queryFn: () => fetchTotalPaidInvoices()
  });
  return { data, isLoading, isError };
};

// Custom hook using react-query to get count of quotes
export const useFetchTotalPendingQuotes = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalPendingQuotes'],
    queryFn: () => fetchTotalPendingQuotes()
  });

  return { data, isLoading, isError };
};

export const useFetchTotalAcceptedQuotes = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalAcceptedQuotes'],
    queryFn: () => fetchTotalAcceptedQuotes()
  });

  return { data, isLoading, isError };
};

export const useFetchTotalRejectedQuotes = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalRejectedQuotes'],
    queryFn: () => fetchTotalRejectedQuotes()
  });

  return { data, isLoading, isError };
};
