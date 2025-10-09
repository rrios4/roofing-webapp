import React from 'react';
import { Link } from 'react-router-dom';
import {
  SettingsIcon,
  HammerIcon,
  ChevronRightIcon,
  TagIcon,
  ListIcon,
  RefreshCwIcon,
  ServerIcon,
  DatabaseIcon,
  GlobeIcon,
  ZapIcon,
  ShieldIcon,
  UsersIcon,
  HardDriveIcon,
  ActivityIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import DefaultPageHeader, { PageHeader } from '../components/ui/page-header';
import { useDataManagementOverview } from '../hooks/useServerOverview';

interface ManagementSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const managementSections: ManagementSection[] = [
  {
    id: 'statuses',
    title: 'Statuses',
    description: 'Manage status options for invoices, quotes, and quote requests',
    icon: <TagIcon className="h-6 w-6" />,
    path: '/data-management/statuses'
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Manage service types and pricing used in quotes and invoices',
    icon: <HammerIcon className="h-6 w-6" />,
    path: '/data-management/services'
  },
  {
    id: 'customer-types',
    title: 'Customer Types',
    description: 'Manage customer categories and classification types for better organization',
    icon: <UsersIcon className="h-6 w-6" />,
    path: '/data-management/customer-types'
  }
];

export default function DataManagementPage() {
  const { stats, isLoadingStats, isErrorStats, isHealthy, refetchAll } =
    useDataManagementOverview();

  // Helper function to format dates
  const formatLastUpdated = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 space-y-4 mb-8">
      <PageHeader
        title="Data Management"
        subheading="Manage system data and configuration settings"
        showActionButton={false}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {managementSections.map((section) => (
          <Link key={section.id} to={section.path}>
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-border hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/100 text-white rounded-lg">{section.icon}</div>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {section.description}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Quick Overview</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchAll()}
            disabled={isLoadingStats}>
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoadingStats ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Statuses</CardTitle>
              <ListIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold">{stats?.totalStatuses.total || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {isLoadingStats ? (
                  <Skeleton className="h-3 w-20" />
                ) : (
                  `Quote: ${stats?.totalStatuses.quote || 0} • Invoice: ${stats?.totalStatuses.invoice || 0} • Request: ${stats?.totalStatuses.quoteRequest || 0}`
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <HammerIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold">{stats?.activeServices || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">Available service types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold">
                  {formatLastUpdated(stats?.lastUpdated.mostRecent || null)}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Most recent change</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <TagIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div
                  className={`text-2xl font-bold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                  {isHealthy ? 'Active' : 'Error'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {isHealthy ? 'All systems operational' : 'Connection issues detected'}
              </p>
            </CardContent>
          </Card>
        </div>

        {isErrorStats && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              Failed to load statistics. Please check your connection and try refreshing.
            </p>
          </div>
        )}
      </div>

      {/* Infrastructure Information Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Infrastructure & Server Info</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div
                  className={`text-2xl font-bold ${stats?.infrastructure.database.connectionStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.infrastructure.database.connectionStatus || 'Unknown'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {isLoadingStats ? (
                  <Skeleton className="h-3 w-24" />
                ) : (
                  `${stats?.infrastructure.database.latency ? `${Math.round(stats.infrastructure.database.latency)}ms` : '--'} • ${stats?.infrastructure.database.region || 'Unknown region'}`
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Supabase API</CardTitle>
              <ServerIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold text-green-600">
                  {stats?.infrastructure.supabase.apiVersion || 'v1'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {isLoadingStats ? (
                  <Skeleton className="h-3 w-20" />
                ) : (
                  `Auth: ${stats?.infrastructure.supabase.authEnabled ? 'Enabled' : 'Disabled'} • RT: ${stats?.infrastructure.supabase.realtime ? 'Yes' : 'No'}`
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <ZapIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.infrastructure.performance.responseTime
                    ? `${Math.round(stats.infrastructure.performance.responseTime)}ms`
                    : '--'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Response time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Project Info</CardTitle>
              <GlobeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold truncate">
                  {stats?.infrastructure.database.host.split('.')[0] || 'Unknown'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {isLoadingStats ? <Skeleton className="h-3 w-16" /> : `Project ID`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Database Usage & Performance Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Database Usage & Performance</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
              <HardDriveIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.infrastructure.usage.totalTables || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Application tables</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.infrastructure.usage.totalRows || '--'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {stats?.infrastructure.usage.dataSize || 'Size unknown'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Query Time</CardTitle>
              <ZapIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.infrastructure.performance.queryTime
                    ? `${Math.round(stats.infrastructure.performance.queryTime)}ms`
                    : '--'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Average query latency</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connection Pool</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold text-green-600">
                  {stats?.infrastructure.database.poolStats.usage || '--'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {stats?.infrastructure.database.poolStats.activeConnections || '--'} active
                connections
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security & Features Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Security & Features</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Row Level Security</CardTitle>
              <ShieldIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div
                  className={`text-2xl font-bold ${stats?.infrastructure.security.rls ? 'text-green-600' : 'text-yellow-600'}`}>
                  {stats?.infrastructure.security.rls ? 'Enabled' : 'Disabled'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                SSL: {stats?.infrastructure.security.ssl ? 'Yes' : 'No'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Edge Functions</CardTitle>
              <ServerIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div
                  className={`text-2xl font-bold ${stats?.infrastructure.supabase.edgeFunctions ? 'text-green-600' : 'text-gray-600'}`}>
                  {stats?.infrastructure.supabase.edgeFunctions ? 'Available' : 'Disabled'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Storage: {stats?.infrastructure.supabase.storage ? 'Yes' : 'No'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auth Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.infrastructure.security.authUsers !== null &&
                  stats?.infrastructure.security.authUsers !== undefined
                    ? stats.infrastructure.security.authUsers
                    : 'Private'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Session Uptime</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : isErrorStats ? (
                <div className="text-2xl font-bold text-destructive">--</div>
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.infrastructure.performance.uptime || '--'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Current session</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
