import { useQuery } from '@tanstack/react-query';
import {
  fetchServerOverviewStats,
  checkSystemHealth,
  ServerOverviewStats
} from '../services/api/server-overview-service';

// Hook for fetching server overview statistics
export const useServerOverview = () => {
  return useQuery<ServerOverviewStats>({
    queryKey: ['server-overview'],
    queryFn: fetchServerOverviewStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook for checking system health
export const useSystemHealth = () => {
  return useQuery<boolean>({
    queryKey: ['system-health'],
    queryFn: checkSystemHealth,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2
  });
};

// Combined hook for data management page
export const useDataManagementOverview = () => {
  const overviewQuery = useServerOverview();
  const healthQuery = useSystemHealth();

  return {
    // Overview data
    stats: overviewQuery.data,
    isLoadingStats: overviewQuery.isLoading,
    isErrorStats: overviewQuery.isError,
    errorStats: overviewQuery.error,

    // Health data
    isHealthy: healthQuery.data,
    isLoadingHealth: healthQuery.isLoading,
    isErrorHealth: healthQuery.isError,

    // Combined states
    isLoading: overviewQuery.isLoading || healthQuery.isLoading,
    isError: overviewQuery.isError || healthQuery.isError,

    // Refetch functions
    refetchStats: overviewQuery.refetch,
    refetchHealth: healthQuery.refetch,
    refetchAll: () => {
      overviewQuery.refetch();
      healthQuery.refetch();
    }
  };
};
