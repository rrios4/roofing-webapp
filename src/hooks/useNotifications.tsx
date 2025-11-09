import { useState, useEffect, useCallback } from 'react';
import { useFetchAllInvoices } from './useAPI/use-invoice';
import { useFetchQuotes } from './useAPI/use-quotes';
import { useFetchAllQuoteRequests } from './useAPI/use-qr';
import { useFetchCustomers } from './useAPI/use-customer';

interface NotificationCount {
  leads?: number;
  invoices?: number;
  quotes?: number;
  customers?: number;
}

/**
 * Hook to manage notification counts for mobile bottom navigation
 * Connected to actual backend data through existing API hooks
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationCount>({});

  // Fetch data from existing hooks
  const { data: invoicesData, isLoading: invoicesLoading } = useFetchAllInvoices();
  const { quotes: quotesData, isLoading: quotesLoading } = useFetchQuotes();
  const { data: leadsData, isLoading: leadsLoading } = useFetchAllQuoteRequests();
  const { customers: customersData, isLoading: customersLoading } = useFetchCustomers();

  // Calculate notification counts based on actual data
  const calculateNotifications = useCallback(() => {
    let newNotifications: NotificationCount = {};

    // Sales Leads notifications - count "New" and "Pending" statuses
    if (leadsData && Array.isArray(leadsData)) {
      const pendingLeads = leadsData.filter((lead: any) => {
        const statusName = lead.status?.name || lead.quote_request_status?.name;
        return statusName === 'New' || statusName === 'Pending';
      });
      newNotifications.leads = pendingLeads.length;
    }

    // Invoice notifications - count "Overdue" invoices
    if (invoicesData && Array.isArray(invoicesData)) {
      const overdueInvoices = invoicesData.filter((invoice: any) => {
        const statusName = invoice.invoice_status?.name;
        return statusName === 'Overdue';
      });
      newNotifications.invoices = overdueInvoices.length;
    }

    // Quotes notifications - count "Draft" and "Pending" quotes
    if (quotesData && Array.isArray(quotesData)) {
      const pendingQuotes = quotesData.filter((quote: any) => {
        const statusName = quote.status?.name || quote.quote_status?.name;
        return statusName === 'Draft' || statusName === 'Pending' || statusName === 'Sent';
      });
      newNotifications.quotes = pendingQuotes.length;
    }

    // Customer notifications - count customers created in the last 7 days
    if (customersData && Array.isArray(customersData)) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const recentCustomers = customersData.filter((customer: any) => {
        const createdDate = new Date(customer.created_at);
        return createdDate >= weekAgo;
      });
      newNotifications.customers = recentCustomers.length;
    }

    setNotifications(newNotifications);
  }, [leadsData, invoicesData, quotesData, customersData]);

  // Recalculate notifications when data changes
  useEffect(() => {
    calculateNotifications();
  }, [calculateNotifications]);

  const isLoading = invoicesLoading || quotesLoading || leadsLoading || customersLoading;

  // Manual refresh function
  const fetchNotifications = () => {
    calculateNotifications();
  };

  // Update specific notification count (for manual overrides)
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
    setNotifications({
      leads: 0,
      invoices: 0,
      quotes: 0,
      customers: 0
    });
  };

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
