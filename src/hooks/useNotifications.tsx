import { useState, useEffect } from 'react';

interface NotificationCount {
  leads?: number;
  invoices?: number;
  quotes?: number;
  customers?: number;
}

/**
 * Hook to manage notification counts for mobile bottom navigation
 * This is a simple implementation - you can enhance it to connect to your backend
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationCount>({});
  const [isLoading, setIsLoading] = useState(false);

  // Example function to fetch notification counts
  // You can replace this with actual API calls to your backend
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Example notification counts - replace with actual data
      const mockNotifications = {
        leads: 3, // 3 new leads
        invoices: 0, // No pending invoices
        quotes: 1, // 1 pending quote
        customers: 0 // No new customer updates
      };

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update specific notification count
  const updateNotificationCount = (key: keyof NotificationCount, count: number) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: count
    }));
  };

  // Clear specific notification
  const clearNotification = (key: keyof NotificationCount) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: 0
    }));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications({});
  };

  // Fetch notifications on hook initialization
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    isLoading,
    fetchNotifications,
    updateNotificationCount,
    clearNotification,
    clearAllNotifications
  };
};

export default useNotifications;
