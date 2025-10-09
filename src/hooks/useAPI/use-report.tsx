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
  fetchTotalScheduledLeads,
  fetchMultiYearRevenueData,
  fetchBusinessStatusOverview,
  fetchInvoiceStatusTracking,
  getRevenueYears,
  fetchDashboardMetrics,
  type DashboardMetrics,
  type MonthlyRevenueData,
  type BusinessStatusOverview,
  type InvoiceStatusTracking
} from '../../services/api/report-service';

// Custom hook that use react query to fetch total new leads count
export const useFetchTotalNewLeads = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalNewLeads'],
    queryFn: async () => await fetchTotalNewLeads()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalScheduledLeads = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalScheduledLeads'],
    queryFn: async () => await fetchTotalScheduledLeads()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalClosedLeads = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalClosedLeads'],
    queryFn: async () => await fetchTotalClosedLeads()
  });
  return { data, isLoading, isError };
};

// Custom hook that uses react-query to fetch customer counts
export const useFetchTotalCustomers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalCustomers'],
    queryFn: async () => await fetchTotalCustomers()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalResidentialCustomers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalResidentialCustomers'],
    queryFn: async () => await fetchTotalResidentialCustomers()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalCommercialCustomers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalCommercialCustomers'],
    queryFn: async () => await fetchTotalCommercialCustomers()
  });
  return { data, isLoading, isError };
};

// Custom hook using react-query to get count of invoices
export const useFetchTotalOverdueInvoices = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalOverdueInvoices'],
    queryFn: async () => await fetchTotalOverdueInvoices()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalPendingInvoices = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalPendingInvoices'],
    queryFn: async () => await fetchTotalPendingInvoices()
  });
  return { data, isLoading, isError };
};

export const useFetchTotalPaidInvoices = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalPaidInvoices'],
    queryFn: async () => await fetchTotalPaidInvoices()
  });
  return { data, isLoading, isError };
};

// Custom hook using react-query to get count of quotes
export const useFetchTotalPendingQuotes = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalPendingQuotes'],
    queryFn: async () => await fetchTotalPendingQuotes()
  });

  return { data, isLoading, isError };
};

export const useFetchTotalAcceptedQuotes = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalAcceptedQuotes'],
    queryFn: async () => await fetchTotalAcceptedQuotes()
  });

  return { data, isLoading, isError };
};

export const useFetchTotalRejectedQuotes = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalRejectedQuotes'],
    queryFn: async () => await fetchTotalRejectedQuotes()
  });

  return { data, isLoading, isError };
};

// Custom hook for dashboard metrics with monthly percentage changes
export const useFetchDashboardMetrics = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => await fetchDashboardMetrics(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000 // Keep in cache for 10 minutes
  });

  return { data, isLoading, isError };
};

// Custom hook for fetching multi-year revenue data for the area chart
export const useFetchMultiYearRevenueData = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['multiYearRevenueData'],
    queryFn: async () => await fetchMultiYearRevenueData(),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes (longer since historical data changes less frequently)
    cacheTime: 30 * 60 * 1000 // Keep in cache for 30 minutes
  });

  // Get the dynamic years array
  const years = getRevenueYears();

  return { data, isLoading, isError, years };
};

// Custom hook for fetching business status overview data
export const useFetchBusinessStatusOverview = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['businessStatusOverview'],
    queryFn: async () => await fetchBusinessStatusOverview(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000 // Keep in cache for 10 minutes
  });

  return { data, isLoading, isError };
};

// Custom hook for fetching invoice status tracking data
export const useFetchInvoiceStatusTracking = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoiceStatusTracking'],
    queryFn: async () => await fetchInvoiceStatusTracking(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000 // Keep in cache for 10 minutes
  });

  return { data, isLoading, isError };
};
