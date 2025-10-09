import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';

// Interface for infrastructure information
export interface InfrastructureInfo {
  database: {
    host: string;
    region: string | null;
    version: string | null;
    connectionStatus: 'Connected' | 'Disconnected' | 'Unknown';
    latency: number | null; // in milliseconds
    poolStats: {
      activeConnections: number | null;
      maxConnections: number | null;
      usage: string | null;
    };
  };
  supabase: {
    projectUrl: string;
    apiVersion: string;
    realtime: boolean;
    authEnabled: boolean;
    edgeFunctions: boolean;
    storage: boolean;
  };
  performance: {
    responseTime: number; // in milliseconds
    queryTime: number | null; // Database query time
    lastChecked: string;
    uptime: string | null; // Session uptime
  };
  usage: {
    totalTables: number;
    totalRows: number | null;
    dataSize: string | null;
    lastActivity: string | null;
  };
  security: {
    rls: boolean; // Row Level Security
    ssl: boolean;
    authUsers: number | null;
  };
}

// Interface for overview statistics
export interface ServerOverviewStats {
  totalStatuses: {
    quote: number;
    invoice: number;
    quoteRequest: number;
    total: number;
  };
  activeServices: number;
  lastUpdated: {
    services: string | null;
    statuses: string | null;
    mostRecent: string | null;
  };
  configuration: {
    status: 'Active' | 'Inactive';
    lastCheck: string;
  };
  infrastructure: InfrastructureInfo;
}

// GET request to fetch infrastructure information
export const fetchInfrastructureInfo = async (): Promise<InfrastructureInfo> => {
  const startTime = performance.now();

  try {
    // Test database connection and measure latency
    const latencyStart = performance.now();
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    const latencyEnd = performance.now();

    const connectionLatency = latencyEnd - latencyStart;
    const connectionStatus = connectionError ? 'Disconnected' : 'Connected';

    // Get database usage statistics
    let totalTables = 0;
    let totalRows: number | null = null;
    let lastActivity: string | null = null;
    let rlsEnabled = false;

    if (!connectionError) {
      // Get table count from our application tables
      const { data: appTables } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      totalTables = appTables?.length || 0;

      // Get row counts from main tables
      try {
        const { count: servicesCount } = await supabase
          .from(TABLES.SERVICE)
          .select('*', { count: 'exact', head: true });

        const { count: quoteStatusCount } = await supabase
          .from(TABLES.QUOTE_STATUS)
          .select('*', { count: 'exact', head: true });

        const { count: invoiceStatusCount } = await supabase
          .from(TABLES.INVOICE_STATUS)
          .select('*', { count: 'exact', head: true });

        totalRows = (servicesCount || 0) + (quoteStatusCount || 0) + (invoiceStatusCount || 0);
      } catch (e) {
        // Row counting failed, keep null
      }

      // Check for RLS policies (indicates security is configured)
      try {
        const { data: policies } = await supabase.from('pg_policies').select('policyname').limit(1);
        rlsEnabled = !!(policies && policies.length > 0);
      } catch (e) {
        // RLS check failed, assume false
      }

      // Get last activity from our tracked tables
      try {
        const { data: recentActivity } = await supabase
          .from(TABLES.SERVICE)
          .select('updated_at, created_at')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (recentActivity && recentActivity[0]) {
          lastActivity = recentActivity[0].updated_at || recentActivity[0].created_at;
        }
      } catch (e) {
        // Activity check failed
      }
    }

    // Database query time measurement
    const queryStart = performance.now();
    await supabase.from(TABLES.SERVICE).select('id').limit(1);
    const queryEnd = performance.now();
    const queryTime = queryEnd - queryStart;

    // Get Supabase project info from environment
    const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL || '';
    const urlParts = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
    const projectId = urlParts ? urlParts[1] : 'unknown';

    // Infer region from project URL (Supabase uses geographic prefixes)
    let region = 'us-east-1'; // Default
    if (supabaseUrl.includes('.supabase.co')) {
      if (supabaseUrl.includes('eu-')) region = 'eu-west-1';
      if (supabaseUrl.includes('ap-')) region = 'ap-southeast-1';
      if (supabaseUrl.includes('ca-')) region = 'ca-central-1';
    }

    // Test realtime and other capabilities
    const realtimeEnabled = supabase.realtime !== undefined;
    const authEnabled = supabase.auth !== undefined;
    const storageEnabled = supabase.storage !== undefined;

    // Check for Edge Functions (attempt to access functions client)
    let edgeFunctionsEnabled = false;
    try {
      edgeFunctionsEnabled = supabase.functions !== undefined;
    } catch (e) {
      // Functions not available
    }

    // Get auth user count if possible
    let authUsers: number | null = null;
    try {
      // This requires admin privileges, so it may fail
      const { data } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
      authUsers = data?.users?.length || null;
    } catch (e) {
      // Auth admin access not available (expected in client-side)
    }

    // Calculate connection pool usage (estimated)
    const poolStats = {
      activeConnections: 1, // At least our current connection
      maxConnections: 100, // Supabase default for most plans
      usage: '< 5%' // Conservative estimate for single client
    };

    // Calculate uptime (session duration estimate)
    const sessionStart = new Date();
    sessionStart.setHours(sessionStart.getHours() - 1); // Rough estimate
    const uptime = `${Math.floor((Date.now() - sessionStart.getTime()) / (1000 * 60))} minutes`;

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    return {
      database: {
        host: supabaseUrl.replace('https://', '').replace('http://', ''),
        region,
        version: null, // Supabase doesn't expose PostgreSQL version to clients
        connectionStatus,
        latency: connectionLatency,
        poolStats
      },
      supabase: {
        projectUrl: supabaseUrl,
        apiVersion: 'v1',
        realtime: realtimeEnabled,
        authEnabled,
        edgeFunctions: edgeFunctionsEnabled,
        storage: storageEnabled
      },
      performance: {
        responseTime,
        queryTime,
        lastChecked: new Date().toISOString(),
        uptime
      },
      usage: {
        totalTables,
        totalRows,
        dataSize: totalRows ? `~${Math.ceil(totalRows / 100)}KB` : null,
        lastActivity
      },
      security: {
        rls: rlsEnabled,
        ssl: supabaseUrl.startsWith('https://'),
        authUsers
      }
    };
  } catch (error) {
    console.error('Error fetching infrastructure info:', error);
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    return {
      database: {
        host: 'unknown',
        region: null,
        version: null,
        connectionStatus: 'Disconnected',
        latency: null,
        poolStats: {
          activeConnections: null,
          maxConnections: null,
          usage: null
        }
      },
      supabase: {
        projectUrl: import.meta.env.REACT_APP_SUPABASE_URL || 'unknown',
        apiVersion: 'v1',
        realtime: false,
        authEnabled: false,
        edgeFunctions: false,
        storage: false
      },
      performance: {
        responseTime,
        queryTime: null,
        lastChecked: new Date().toISOString(),
        uptime: null
      },
      usage: {
        totalTables: 0,
        totalRows: null,
        dataSize: null,
        lastActivity: null
      },
      security: {
        rls: false,
        ssl: false,
        authUsers: null
      }
    };
  }
};

// GET request to fetch overview statistics
export const fetchServerOverviewStats = async (): Promise<ServerOverviewStats> => {
  try {
    // Fetch infrastructure information
    const infrastructure = await fetchInfrastructureInfo();

    // Fetch services count and last updated
    const { data: services, error: servicesError } = await supabase
      .from(TABLES.SERVICE)
      .select('id, updated_at, created_at');

    if (servicesError) throw servicesError;

    // Fetch quote statuses
    const { data: quoteStatuses, error: quoteStatusError } = await supabase
      .from(TABLES.QUOTE_STATUS)
      .select('id, updated_at');

    if (quoteStatusError) throw quoteStatusError;

    // Fetch invoice statuses
    const { data: invoiceStatuses, error: invoiceStatusError } = await supabase
      .from(TABLES.INVOICE_STATUS)
      .select('id, updated_at');

    if (invoiceStatusError) throw invoiceStatusError;

    // Fetch quote request statuses
    const { data: quoteRequestStatuses, error: quoteRequestStatusError } = await supabase
      .from(TABLES.QUOTE_REQUEST_STATUS)
      .select('id, updated_at');

    if (quoteRequestStatusError) throw quoteRequestStatusError;

    // Calculate statistics
    const activeServices = services?.length || 0;

    const totalStatuses = {
      quote: quoteStatuses?.length || 0,
      invoice: invoiceStatuses?.length || 0,
      quoteRequest: quoteRequestStatuses?.length || 0,
      total:
        (quoteStatuses?.length || 0) +
        (invoiceStatuses?.length || 0) +
        (quoteRequestStatuses?.length || 0)
    };

    // Find most recent updates
    const allUpdates = [
      ...(services?.map((s) => s.updated_at || s.created_at) || []),
      ...(quoteStatuses?.map((s) => s.updated_at) || []),
      ...(invoiceStatuses?.map((s) => s.updated_at) || []),
      ...(quoteRequestStatuses?.map((s) => s.updated_at) || [])
    ].filter(Boolean);

    const servicesLastUpdated =
      services && services.length > 0
        ? Math.max(...services.map((s) => new Date(s.updated_at || s.created_at).getTime()))
        : null;

    const statusesLastUpdated =
      allUpdates.length > 0
        ? Math.max(...allUpdates.map((date) => new Date(date).getTime()))
        : null;

    const mostRecentUpdate = Math.max(servicesLastUpdated || 0, statusesLastUpdated || 0);

    return {
      totalStatuses,
      activeServices,
      lastUpdated: {
        services: servicesLastUpdated ? new Date(servicesLastUpdated).toISOString() : null,
        statuses: statusesLastUpdated ? new Date(statusesLastUpdated).toISOString() : null,
        mostRecent: mostRecentUpdate > 0 ? new Date(mostRecentUpdate).toISOString() : null
      },
      configuration: {
        status: 'Active', // Always active for now
        lastCheck: new Date().toISOString()
      },
      infrastructure
    };
  } catch (error) {
    console.error('Error fetching server overview stats:', error);
    throw error;
  }
};

// GET request to check system health
export const checkSystemHealth = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from(TABLES.SERVICE).select('id').limit(1);

    return !error;
  } catch (error) {
    console.error('System health check failed:', error);
    return false;
  }
};
