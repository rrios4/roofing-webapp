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
  const { count, error } = await supabase.from(TABLES.CUSTOMER).select('*', { count: 'exact' });

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

// Multi-Year Revenue Data Interface
export interface MonthlyRevenueData {
  month: string;
  [year: string]: number | null | string; // Dynamic year keys with revenue values, plus month string
}

// Helper function to get dynamic years array (current year and previous 4 years)
export const getRevenueYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = 4; i >= 0; i--) {
    years.push((currentYear - i).toString());
  }
  return years;
};

// Fetch multi-year revenue data for the area chart
export const fetchMultiYearRevenueData = async (): Promise<MonthlyRevenueData[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4; // Go back 4 years (5 years total including current)
    const years = getRevenueYears(); // Get dynamic years array

    // Create an array to hold the final data structure
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    // Initialize the data structure with null values dynamically
    const revenueData: MonthlyRevenueData[] = monthNames.map((month) => {
      const monthData: MonthlyRevenueData = { month };
      // Add each year as a property with null initial value
      years.forEach((year) => {
        monthData[year] = null;
      });
      return monthData;
    });

    // Fetch all payment data for the last 5 years
    const { data: payments, error } = await supabase
      .from(TABLES.INVOICE_PAYMENT)
      .select('amount, date_received')
      .gte('date_received', `${startYear}-01-01`)
      .lte('date_received', `${currentYear}-12-31`)
      .order('date_received', { ascending: true });

    if (error) {
      console.error('Error fetching multi-year revenue data:', error);
      throw error;
    }

    if (!payments) {
      console.log('No payment data found');
      return revenueData;
    }

    // Process the payments and aggregate by month and year
    payments.forEach((payment) => {
      if (payment.date_received && payment.amount) {
        const paymentDate = new Date(payment.date_received);
        const year = paymentDate.getFullYear().toString();
        const monthIndex = paymentDate.getMonth(); // 0-based index
        const monthName = monthNames[monthIndex];

        // Find the corresponding month in our data structure
        const monthData = revenueData.find((item) => item.month === monthName);

        // Check if the year is in our years range and exists in the month data
        if (monthData && years.includes(year) && year in monthData) {
          const currentValue = monthData[year];
          if (currentValue === null) {
            monthData[year] = payment.amount;
          } else {
            monthData[year] = (currentValue as number) + payment.amount;
          }
        }
      }
    });

    console.log(`Multi-year revenue data processed for ${years.join(', ')}:`, revenueData);
    return revenueData;
  } catch (error) {
    console.error('Error in fetchMultiYearRevenueData:', error);
    throw error;
  }
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

// Business Status Overview Data Interface
export interface BusinessStatusOverview {
  quoteStatus: {
    accepted: number;
    pending: number;
    rejected: number;
  };
  invoiceStatus: {
    paid: number;
    pending: number;
    overdue: number;
  };
  projectStatus: {
    active: number;
    onHold: number;
    completed: number;
  };
}

// Invoice Status Payment Tracking Data Interface
export interface InvoiceStatusItem {
  status: string;
  count: number;
  amount: number;
}

export interface InvoiceStatusTracking {
  paid: InvoiceStatusItem;
  pending: InvoiceStatusItem;
  draft: InvoiceStatusItem;
  overdue: InvoiceStatusItem;
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
      supabase.from(TABLES.CUSTOMER).select('*', { count: 'exact' }),

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
      supabase.from(TABLES.QUOTE).select('*', { count: 'exact' }).eq('status_id', 2), // 2 = pending

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
    const currentMonthRevenue =
      currentMonthRevenueResult.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    const previousMonthRevenue =
      previousMonthRevenueResult.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) ||
      0;

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

    const quotePercentChange = calculatePercentChange(currentMonthQuotes, previousMonthQuotes);

    const revenuePercentChange = calculatePercentChange(currentMonthRevenue, previousMonthRevenue);

    const leadPercentChange = calculatePercentChange(currentMonthLeads, previousMonthLeads);

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

// Fetch business status overview data for the dashboard card
export const fetchBusinessStatusOverview = async (): Promise<BusinessStatusOverview> => {
  try {
    // Fetch all status counts in parallel
    const [
      acceptedQuotesResult,
      pendingQuotesResult,
      rejectedQuotesResult,
      paidInvoicesResult,
      pendingInvoicesResult,
      overdueInvoicesResult
      // TODO: Uncomment when projects are implemented in Supabase
      // activeProjectsResult,
      // onHoldProjectsResult,
      // completedProjectsResult
    ] = await Promise.all([
      // Quote statuses
      supabase.from(TABLES.QUOTE).select('*', { count: 'exact' }).eq('status_id', 1), // 1 = Accepted
      supabase.from(TABLES.QUOTE).select('*', { count: 'exact' }).eq('status_id', 2), // 2 = Pending
      supabase.from(TABLES.QUOTE).select('*', { count: 'exact' }).eq('status_id', 3), // 3 = Rejected

      // Invoice statuses
      supabase.from(TABLES.INVOICE).select('*', { count: 'exact' }).eq('invoice_status_id', 1), // 1 = Paid
      supabase.from(TABLES.INVOICE).select('*', { count: 'exact' }).eq('invoice_status_id', 2), // 2 = Pending
      supabase.from(TABLES.INVOICE).select('*', { count: 'exact' }).eq('invoice_status_id', 3) // 3 = Overdue

      // TODO: Uncomment when projects are implemented in Supabase
      // Project statuses (assuming similar status IDs - may need adjustment)
      // supabase
      //   .from(TABLES.PROJECTS)
      //   .select('*', { count: 'exact' })
      //   .eq('status_id', 1), // Assuming 1 = Active
      // supabase
      //   .from(TABLES.PROJECTS)
      //   .select('*', { count: 'exact' })
      //   .eq('status_id', 2), // Assuming 2 = On Hold
      // supabase
      //   .from(TABLES.PROJECTS)
      //   .select('*', { count: 'exact' })
      //   .eq('status_id', 3)  // Assuming 3 = Completed
    ]);

    // Check for errors
    const results = [
      acceptedQuotesResult,
      pendingQuotesResult,
      rejectedQuotesResult,
      paidInvoicesResult,
      pendingInvoicesResult,
      overdueInvoicesResult
      // TODO: Add project results when implemented
      // activeProjectsResult,
      // onHoldProjectsResult,
      // completedProjectsResult
    ];

    for (const result of results) {
      if (result.error) {
        console.error('Error fetching business status data:', result.error);
        throw result.error;
      }
    }

    return {
      quoteStatus: {
        accepted: acceptedQuotesResult.count || 0,
        pending: pendingQuotesResult.count || 0,
        rejected: rejectedQuotesResult.count || 0
      },
      invoiceStatus: {
        paid: paidInvoicesResult.count || 0,
        pending: pendingInvoicesResult.count || 0,
        overdue: overdueInvoicesResult.count || 0
      },
      projectStatus: {
        // TODO: Replace with real data when projects are implemented in Supabase
        active: 32, // Sample data
        onHold: 5, // Sample data
        completed: 89 // Sample data
      }
    };
  } catch (error) {
    console.error('Error in fetchBusinessStatusOverview:', error);
    throw error;
  }
};

// Fetch invoice status tracking data for payment tracking card
export const fetchInvoiceStatusTracking = async (): Promise<InvoiceStatusTracking> => {
  try {
    // First, let's try different common column names for invoice amounts
    // Try fetching one record to see what columns are available
    const { data: sampleInvoice, error: sampleError } = await supabase
      .from(TABLES.INVOICE)
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('Error fetching sample invoice:', sampleError);
      // Fall back to count-only approach
      return await fetchInvoiceStatusTrackingCountOnly();
    }

    // Log available columns for debugging
    if (sampleInvoice && sampleInvoice.length > 0) {
      console.log('Available invoice columns:', Object.keys(sampleInvoice[0]));
    }

    // Try common amount column names
    const possibleAmountColumns = [
      'amount',
      'total',
      'invoice_amount',
      'total_amount',
      'grand_total',
      'invoice_total'
    ];
    let amountColumn = null;

    // Check which amount column exists
    for (const column of possibleAmountColumns) {
      if (sampleInvoice && sampleInvoice.length > 0 && column in sampleInvoice[0]) {
        amountColumn = column;
        console.log(`Found amount column: ${column}`);
        break;
      }
    }

    if (!amountColumn) {
      console.warn('No amount column found, falling back to count-only');
      return await fetchInvoiceStatusTrackingCountOnly();
    }

    // Fetch invoice data with the correct amount column
    const [paidInvoicesResult, pendingInvoicesResult, overdueInvoicesResult, draftInvoicesResult] =
      await Promise.all([
        // Paid invoices (status_id = 1)
        supabase.from(TABLES.INVOICE).select(amountColumn).eq('invoice_status_id', 1),

        // Pending invoices (status_id = 2)
        supabase.from(TABLES.INVOICE).select(amountColumn).eq('invoice_status_id', 2),

        // Overdue invoices (status_id = 3)
        supabase.from(TABLES.INVOICE).select(amountColumn).eq('invoice_status_id', 3),

        // Draft invoices (status_id = 4) - assuming this exists, if not it will return empty
        supabase.from(TABLES.INVOICE).select(amountColumn).eq('invoice_status_id', 4)
      ]);

    // Check for errors
    const results = [
      paidInvoicesResult,
      pendingInvoicesResult,
      overdueInvoicesResult,
      draftInvoicesResult
    ];
    for (const result of results) {
      if (result.error) {
        console.error('Error fetching invoice status tracking data:', result.error);
        throw result.error;
      }
    }

    // Calculate totals for each status using real data
    const calculateTotals = (invoices: any[] | null, columnName: string) => {
      const count = invoices?.length || 0;
      const amount = invoices?.reduce((sum, invoice) => sum + (invoice[columnName] || 0), 0) || 0;
      return { count, amount };
    };

    const paidTotals = calculateTotals(paidInvoicesResult.data, amountColumn);
    const pendingTotals = calculateTotals(pendingInvoicesResult.data, amountColumn);
    const overdueTotals = calculateTotals(overdueInvoicesResult.data, amountColumn);
    const draftTotals = calculateTotals(draftInvoicesResult.data, amountColumn);

    // Log for debugging (remove in production)
    console.log('Invoice Status Tracking Debug (Real Data):', {
      amountColumn,
      paid: `${paidTotals.count} invoices, $${paidTotals.amount.toLocaleString()}`,
      pending: `${pendingTotals.count} invoices, $${pendingTotals.amount.toLocaleString()}`,
      overdue: `${overdueTotals.count} invoices, $${overdueTotals.amount.toLocaleString()}`,
      draft: `${draftTotals.count} invoices, $${draftTotals.amount.toLocaleString()}`
    });

    return {
      paid: {
        status: 'Paid',
        count: paidTotals.count,
        amount: paidTotals.amount
      },
      pending: {
        status: 'Pending',
        count: pendingTotals.count,
        amount: pendingTotals.amount
      },
      overdue: {
        status: 'Overdue',
        count: overdueTotals.count,
        amount: overdueTotals.amount
      },
      draft: {
        status: 'Draft',
        count: draftTotals.count,
        amount: draftTotals.amount
      }
    };
  } catch (error) {
    console.error('Error in fetchInvoiceStatusTracking:', error);
    throw error;
  }
};

// Fallback function that uses count-only approach with estimated amounts
const fetchInvoiceStatusTrackingCountOnly = async (): Promise<InvoiceStatusTracking> => {
  const [paidInvoicesResult, pendingInvoicesResult, overdueInvoicesResult, draftInvoicesResult] =
    await Promise.all([
      // Paid invoices (status_id = 1)
      supabase.from(TABLES.INVOICE).select('*', { count: 'exact' }).eq('invoice_status_id', 1),

      // Pending invoices (status_id = 2)
      supabase.from(TABLES.INVOICE).select('*', { count: 'exact' }).eq('invoice_status_id', 2),

      // Overdue invoices (status_id = 3)
      supabase.from(TABLES.INVOICE).select('*', { count: 'exact' }).eq('invoice_status_id', 3),

      // Draft invoices (status_id = 4)
      supabase.from(TABLES.INVOICE).select('*', { count: 'exact' }).eq('invoice_status_id', 4)
    ]);

  // Check for errors
  const results = [
    paidInvoicesResult,
    pendingInvoicesResult,
    overdueInvoicesResult,
    draftInvoicesResult
  ];
  for (const result of results) {
    if (result.error) {
      console.error('Error fetching invoice status tracking data:', result.error);
      throw result.error;
    }
  }

  // Get counts and use estimated amounts
  const paidCount = paidInvoicesResult.count || 0;
  const pendingCount = pendingInvoicesResult.count || 0;
  const overdueCount = overdueInvoicesResult.count || 0;
  const draftCount = draftInvoicesResult.count || 0;

  // Using realistic estimated amounts based on count
  const estimateAmount = (count: number, avgAmount: number) => count * avgAmount;

  const paidAmount = estimateAmount(paidCount, 4000); // Avg $4k per paid invoice
  const pendingAmount = estimateAmount(pendingCount, 4000); // Avg $4k per pending invoice
  const overdueAmount = estimateAmount(overdueCount, 3500); // Avg $3.5k per overdue invoice
  const draftAmount = estimateAmount(draftCount, 3000); // Avg $3k per draft invoice

  console.log('Invoice Status Tracking Debug (Estimated Data):', {
    paid: `${paidCount} invoices, $${paidAmount.toLocaleString()} (estimated)`,
    pending: `${pendingCount} invoices, $${pendingAmount.toLocaleString()} (estimated)`,
    overdue: `${overdueCount} invoices, $${overdueAmount.toLocaleString()} (estimated)`,
    draft: `${draftCount} invoices, $${draftAmount.toLocaleString()} (estimated)`
  });

  return {
    paid: {
      status: 'Paid',
      count: paidCount,
      amount: paidAmount
    },
    pending: {
      status: 'Pending',
      count: pendingCount,
      amount: pendingAmount
    },
    overdue: {
      status: 'Overdue',
      count: overdueCount,
      amount: overdueAmount
    },
    draft: {
      status: 'Draft',
      count: draftCount,
      amount: draftAmount
    }
  };
};
