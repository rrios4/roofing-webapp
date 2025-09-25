import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';

// GET request of a count of all leads with a Status
export const fetchTotalNewLeads = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE_REQUEST)
    .select('*', { count: 'exact' })
    .eq('est_request_status_id', 1);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalScheduledLeads = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE_REQUEST)
    .select('*', { count: 'exact' })
    .eq('est_request_status_id', 2);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalClosedLeads = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE_REQUEST)
    .select('*', { count: 'exact' })
    .eq('est_request_status_id', 4);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

// GET request of a count of all customer types
export const fetchTotalCustomers = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.CUSTOMER)
    .select('*', { count: 'exact' });
    
  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalResidentialCustomers = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.CUSTOMER)
    .select('*', { count: 'exact' })
    .eq('customer_type_id', 1);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalCommercialCustomers = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.CUSTOMER)
    .select('*', { count: 'exact' })
    .eq('customer_type_id', 2);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

// GET request of a count for invoice status counts
export const fetchTotalOverdueInvoices = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.INVOICE)
    .select('*', { count: 'exact' })
    .eq('invoice_status_id', 3);
    
  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalPendingInvoices = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.INVOICE)
    .select('*', { count: 'exact' })
    .eq('invoice_status_id', 2);
    
  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalPaidInvoices = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.INVOICE)
    .select('*', { count: 'exact' })
    .eq('invoice_status_id', 1);
    
  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

// GET request of a count for quote status counts
export const fetchTotalPendingQuotes = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE)
    .select('*', { count: 'exact' })
    .eq('status_id', 2);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalAcceptedQuotes = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE)
    .select('*', { count: 'exact' })
    .eq('status_id', 1);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

export const fetchTotalRejectedQuotes = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from(TABLES.QUOTE)
    .select('*', { count: 'exact' })
    .eq('status_id', 3);

  if (error) {
    console.log(error);
    throw error;
  }
  return count;
};

// Dashboard Key Metrics with Monthly Percentage Change
export interface DashboardMetrics {
  totalCustomers: number;
  customerPercentChange: number;
  activeQuotes: number;
  quotePercentChange: number;
  monthlyRevenue: number;
  revenuePercentChange: number;
  pendingLeads: number;
  leadPercentChange: number;
}

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    // Get current date boundaries
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based (0 = January, 11 = December)
    
    // Current month boundaries (from 1st to last day of current month)
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
    
    // Previous month boundaries (handle year rollover for January)
    let previousMonthYear = currentYear;
    let previousMonth = currentMonth - 1;
    
    if (previousMonth < 0) {
      previousMonth = 11; // December
      previousMonthYear = currentYear - 1;
    }
    
    const previousMonthStart = new Date(previousMonthYear, previousMonth, 1);
    const previousMonthEnd = new Date(previousMonthYear, previousMonth + 1, 0, 23, 59, 59, 999);

    // Fetch current month data
    const [
      totalCustomersResult,
      currentMonthCustomersResult,
      previousMonthCustomersResult,
      activeQuotesResult,
      currentMonthQuotesResult,
      previousMonthQuotesResult,
      currentMonthRevenueResult,
      previousMonthRevenueResult,
      pendingLeadsResult,
      currentMonthLeadsResult,
      previousMonthLeadsResult
    ] = await Promise.all([
      // Total customers
      supabase
        .from(TABLES.CUSTOMER)
        .select('*', { count: 'exact' }),
      
      // Current month new customers
      supabase
        .from(TABLES.CUSTOMER)
        .select('*', { count: 'exact' })
        .gte('created_at', currentMonthStart.toISOString())
        .lte('created_at', currentMonthEnd.toISOString()),
      
      // Previous month new customers
      supabase
        .from(TABLES.CUSTOMER)
        .select('*', { count: 'exact' })
        .gte('created_at', previousMonthStart.toISOString())
        .lte('created_at', previousMonthEnd.toISOString()),
      
      // Active quotes (pending only)
      supabase
        .from(TABLES.QUOTE)
        .select('*', { count: 'exact' })
        .eq('status_id', 2), // 2 = pending
      
      // Current month pending quotes
      supabase
        .from(TABLES.QUOTE)
        .select('*', { count: 'exact' })
        .eq('status_id', 2) // Only pending quotes
        .gte('created_at', currentMonthStart.toISOString())
        .lte('created_at', currentMonthEnd.toISOString()),
      
      // Previous month pending quotes
      supabase
        .from(TABLES.QUOTE)
        .select('*', { count: 'exact' })
        .eq('status_id', 2) // Only pending quotes
        .gte('created_at', previousMonthStart.toISOString())
        .lte('created_at', previousMonthEnd.toISOString()),
      
      // Current month revenue (actual payments received)
      supabase
        .from(TABLES.INVOICE_PAYMENT)
        .select('amount')
        .gte('date_received', currentMonthStart.toISOString().split('T')[0]) // date field, not timestamp
        .lte('date_received', currentMonthEnd.toISOString().split('T')[0]),
      
      // Previous month revenue (actual payments received)
      supabase
        .from(TABLES.INVOICE_PAYMENT)
        .select('amount')
        .gte('date_received', previousMonthStart.toISOString().split('T')[0]) // date field, not timestamp
        .lte('date_received', previousMonthEnd.toISOString().split('T')[0]),
      
      // Pending leads (new + scheduled)
      supabase
        .from(TABLES.QUOTE_REQUEST)
        .select('*', { count: 'exact' })
        .in('est_request_status_id', [1, 2]), // 1 = new, 2 = scheduled
      
      // Current month leads
      supabase
        .from(TABLES.QUOTE_REQUEST)
        .select('*', { count: 'exact' })
        .gte('created_at', currentMonthStart.toISOString())
        .lte('created_at', currentMonthEnd.toISOString()),
      
      // Previous month leads
      supabase
        .from(TABLES.QUOTE_REQUEST)
        .select('*', { count: 'exact' })
        .gte('created_at', previousMonthStart.toISOString())
        .lte('created_at', previousMonthEnd.toISOString())
    ]);

    // Check for errors
    const results = [
      totalCustomersResult,
      currentMonthCustomersResult,
      previousMonthCustomersResult,
      activeQuotesResult,
      currentMonthQuotesResult,
      previousMonthQuotesResult,
      currentMonthRevenueResult,
      previousMonthRevenueResult,
      pendingLeadsResult,
      currentMonthLeadsResult,
      previousMonthLeadsResult
    ];

    for (const result of results) {
      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }
    }

    // Calculate revenue totals from actual payments received
    const currentMonthRevenue = currentMonthRevenueResult.data?.reduce(
      (sum, payment) => sum + (payment.amount || 0), 
      0
    ) || 0;

    const previousMonthRevenue = previousMonthRevenueResult.data?.reduce(
      (sum, payment) => sum + (payment.amount || 0), 
      0
    ) || 0;

    // Calculate percentage changes
    const calculatePercentChange = (current: number, previous: number): number => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return ((current - previous) / previous) * 100;
    };

    // Get counts for percentage calculations
    const currentMonthCustomers = currentMonthCustomersResult.count || 0;
    const previousMonthCustomers = previousMonthCustomersResult.count || 0;
    const currentMonthQuotes = currentMonthQuotesResult.count || 0;
    const previousMonthQuotes = previousMonthQuotesResult.count || 0;
    const currentMonthLeads = currentMonthLeadsResult.count || 0;
    const previousMonthLeads = previousMonthLeadsResult.count || 0;

    // Log for debugging (remove in production)
    console.log('Dashboard Metrics Debug:', {
      currentMonthStart: currentMonthStart.toISOString().split('T')[0],
      currentMonthEnd: currentMonthEnd.toISOString().split('T')[0],
      previousMonthStart: previousMonthStart.toISOString().split('T')[0],
      previousMonthEnd: previousMonthEnd.toISOString().split('T')[0],
      currentMonthCustomers,
      previousMonthCustomers,
      currentMonthQuotes,
      previousMonthQuotes,
      currentMonthRevenue: `$${currentMonthRevenue.toLocaleString()}`,
      previousMonthRevenue: `$${previousMonthRevenue.toLocaleString()}`,
      currentMonthLeads,
      previousMonthLeads,
      paymentRecordsCurrentMonth: currentMonthRevenueResult.data?.length || 0,
      paymentRecordsPreviousMonth: previousMonthRevenueResult.data?.length || 0
    });

    const customerPercentChange = calculatePercentChange(
      currentMonthCustomers,
      previousMonthCustomers
    );

    const quotePercentChange = calculatePercentChange(
      currentMonthQuotes,
      previousMonthQuotes
    );

    const revenuePercentChange = calculatePercentChange(
      currentMonthRevenue,
      previousMonthRevenue
    );

    const leadPercentChange = calculatePercentChange(
      currentMonthLeads,
      previousMonthLeads
    );

    return {
      totalCustomers: totalCustomersResult.count || 0,
      customerPercentChange: Math.round(customerPercentChange * 10) / 10,
      activeQuotes: activeQuotesResult.count || 0,
      quotePercentChange: Math.round(quotePercentChange * 10) / 10,
      monthlyRevenue: currentMonthRevenue,
      revenuePercentChange: Math.round(revenuePercentChange * 10) / 10,
      pendingLeads: pendingLeadsResult.count || 0,
      leadPercentChange: Math.round(leadPercentChange * 10) / 10
    };

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};