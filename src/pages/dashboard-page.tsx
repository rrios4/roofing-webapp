import React from 'react';
import { DashboardPageHeader } from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  AreaChart,
  DonutChart,
  BarChart,
  LineChart,
  Title,
  Subtitle,
  Text,
  Metric,
  Flex,
  CategoryBar,
  Grid,
  Col,
  Legend,
  ProgressBar
} from '@tremor/react';
import {
  PlusIcon,
  TrendingUpIcon,
  UsersIcon,
  FileTextIcon,
  DollarSignIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AlertTriangleIcon,
  BuildingIcon,
  HomeIcon,
  PhoneIcon,
  MailIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  KanbanSquareIcon,
  UserPlusIcon,
  FileIcon,
  Receipt,
  Loader2
} from 'lucide-react';
import { useFetchDashboardMetrics } from '../hooks/useAPI/use-report';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

type Props = {};

export default function DashboardPage({}: Props) {
  // Fetch real dashboard metrics
  const { data: dashboardMetrics, isLoading, isError } = useFetchDashboardMetrics();

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Helper function to get trend indicator
  const getTrendIndicator = (percentChange: number) => {
    const isPositive = percentChange >= 0;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

    return (
      <div className="flex items-center mt-1">
        <Icon className={`h-4 w-4 ${isPositive ? 'text-green-500' : 'text-red-500'} mr-1`} />
        <span className={`text-sm ${color}`}>
          {isPositive ? '+' : ''}
          {percentChange}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last month</span>
      </div>
    );
  };

  // Sample data for design purposes - replace with real data later
  const sampleQuoteData = [
    { name: 'Accepted', value: 45, color: '#10B981' },
    { name: 'Pending', value: 23, color: '#F59E0B' },
    { name: 'Rejected', value: 12, color: '#EF4444' }
  ];

  const sampleLeadData = [
    { name: 'New', value: 18 },
    { name: 'Contacted', value: 24 },
    { name: 'Qualified', value: 15 },
    { name: 'Converted', value: 8 }
  ];

  const sampleMonthlyRevenue = [
    { month: 'Jan', revenue: 45000, quotes: 12, customers: 8 },
    { month: 'Feb', revenue: 52000, quotes: 15, customers: 11 },
    { month: 'Mar', revenue: 48000, quotes: 14, customers: 9 },
    { month: 'Apr', revenue: 61000, quotes: 18, customers: 13 },
    { month: 'May', revenue: 55000, quotes: 16, customers: 10 },
    { month: 'Jun', revenue: 67000, quotes: 20, customers: 14 }
  ];

  const sampleInvoiceData = [
    { status: 'Paid', count: 45, amount: 180000 },
    { status: 'Pending', count: 12, amount: 48000 },
    { status: 'Overdue', count: 7, amount: 21000 }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <DashboardPageHeader />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !dashboardMetrics) {
    return (
      <div className="w-full">
        <DashboardPageHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Error loading dashboard data</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DashboardPageHeader />

      {/* Dashboard Content */}
      <div className="flex flex-col w-full gap-6 my-4">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Customers */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardMetrics.totalCustomers.toLocaleString()}
                  </p>
                  {getTrendIndicator(dashboardMetrics.customerPercentChange)}
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Quotes */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Quotes
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardMetrics.activeQuotes.toLocaleString()}
                  </p>
                  {getTrendIndicator(dashboardMetrics.quotePercentChange)}
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FileTextIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(dashboardMetrics.monthlyRevenue)}
                  </p>
                  {getTrendIndicator(dashboardMetrics.revenuePercentChange)}
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSignIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Leads */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Leads
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardMetrics.pendingLeads.toLocaleString()}
                  </p>
                  {getTrendIndicator(dashboardMetrics.leadPercentChange)}
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <PhoneIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Business Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              <Badge variant="blue">Fast Track</Badge>
            </div>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <UserPlusIcon className="h-4 w-4 mr-3" />
                Add New Customer
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileIcon className="h-4 w-4 mr-3" />
                Create Quote
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Receipt className="h-4 w-4 mr-3" />
                Generate Invoice
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <KanbanSquareIcon className="h-4 w-4 mr-3" />
                Update Kanban
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CalendarIcon className="h-4 w-4 mr-3" />
                Schedule Visit
              </Button>
            </div>
          </div>

          {/* Business Status Overview */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Business Status Overview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Quote Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Accepted</span>
                    </div>
                    <Badge variant="green">45</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                    </div>
                    <Badge variant="yellow">23</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                    </div>
                    <Badge variant="red">12</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Customer Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HomeIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Residential</span>
                    </div>
                    <Badge variant="blue">189</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BuildingIcon className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Commercial</span>
                    </div>
                    <Badge variant="gray">58</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangleIcon className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Overdue Invoices
                      </span>
                    </div>
                    <Badge variant="red">7</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quote Status Distribution */}
          <Card className="p-6">
            <Title className="text-gray-900 dark:text-white">Quote Status Distribution</Title>
            <Subtitle className="text-gray-600 dark:text-gray-400">
              Current month breakdown
            </Subtitle>
            <DonutChart
              data={sampleQuoteData}
              category="value"
              index="name"
              colors={['emerald', 'yellow', 'red']}
              className="mt-6 h-64"
              showLabel={true}
              showAnimation={true}
            />
            <Legend
              categories={['Accepted', 'Pending', 'Rejected']}
              colors={['emerald', 'yellow', 'red']}
              className="mt-4"
            />
          </Card>

          {/* Lead Pipeline */}
          <Card className="p-6">
            <Title className="text-gray-900 dark:text-white">Lead Pipeline</Title>
            <Subtitle className="text-gray-600 dark:text-gray-400">
              Current lead status breakdown
            </Subtitle>
            <BarChart
              data={sampleLeadData}
              index="name"
              categories={['value']}
              colors={['blue']}
              className="mt-6 h-64"
              showAnimation={true}
              showLegend={false}
            />
          </Card>
        </div>

        {/* Revenue Trends & Invoice Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Revenue Trend */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Title className="text-gray-900 dark:text-white">Monthly Revenue Trend</Title>
              <Subtitle className="text-gray-600 dark:text-gray-400">
                Revenue and customer acquisition over time
              </Subtitle>
              <AreaChart
                data={sampleMonthlyRevenue}
                index="month"
                categories={['revenue']}
                colors={['blue']}
                className="mt-6 h-72"
                valueFormatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                showAnimation={true}
              />
            </Card>
          </div>

          {/* Invoice Status */}
          <Card className="p-6">
            <Title className="text-gray-900 dark:text-white">Invoice Status</Title>
            <Subtitle className="text-gray-600 dark:text-gray-400">Payment tracking</Subtitle>
            <div className="mt-6 space-y-4">
              {sampleInvoiceData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.status}</p>
                    <p className="text-sm text-gray-500">{item.count} invoices</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${(item.amount / 1000).toFixed(0)}K
                    </p>
                    <Badge
                      variant={
                        item.status === 'Paid'
                          ? 'green'
                          : item.status === 'Pending'
                            ? 'yellow'
                            : 'red'
                      }>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Metrics & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Performance Indicators */}
          <Card className="p-6">
            <Title className="text-gray-900 dark:text-white">Key Performance Indicators</Title>
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Text className="text-gray-600 dark:text-gray-400">Quote Conversion Rate</Text>
                  <Text className="font-medium text-gray-900 dark:text-white">68.2%</Text>
                </div>
                <CategoryBar values={[68.2, 31.8]} colors={['emerald', 'gray']} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Text className="text-gray-600 dark:text-gray-400">Customer Satisfaction</Text>
                  <Text className="font-medium text-gray-900 dark:text-white">94.5%</Text>
                </div>
                <CategoryBar values={[94.5, 5.5]} colors={['green', 'gray']} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Text className="text-gray-600 dark:text-gray-400">On-Time Completion</Text>
                  <Text className="font-medium text-gray-900 dark:text-white">89.3%</Text>
                </div>
                <CategoryBar values={[89.3, 10.7]} colors={['blue', 'gray']} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Text className="text-gray-600 dark:text-gray-400">Revenue Target Progress</Text>
                  <Text className="font-medium text-gray-900 dark:text-white">78.4%</Text>
                </div>
                <CategoryBar values={[78.4, 21.6]} colors={['purple', 'gray']} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Quote #1234 Accepted
                  </p>
                  <p className="text-xs text-gray-500">John Smith - $15,500</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    New Customer Added
                  </p>
                  <p className="text-xs text-gray-500">Sarah Johnson - Commercial</p>
                  <p className="text-xs text-gray-400">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Payment Received
                  </p>
                  <p className="text-xs text-gray-500">Invoice #INV-456 - $8,200</p>
                  <p className="text-xs text-gray-400">6 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Kanban Updated
                  </p>
                  <p className="text-xs text-gray-500">Project moved to "In Progress"</p>
                  <p className="text-xs text-gray-400">8 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Lead Expired
                  </p>
                  <p className="text-xs text-gray-500">Mike Davis - Follow up needed</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
