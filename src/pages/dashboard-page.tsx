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
  Loader2,
  PlayIcon,
  PauseIcon,
  CheckIcon,
  CreditCardIcon,
  ClockIcon as Clock4Icon
} from 'lucide-react';
import {
  useFetchDashboardMetrics,
  useFetchMultiYearRevenueData,
  useFetchBusinessStatusOverview,
  useFetchInvoiceStatusTracking
} from '../hooks/useAPI/use-report';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { ScrollArea } from '../components/ui/scroll-area';
import AddCustomerForm from '../components/forms/add-customer-form';
import AddQuoteForm from '../components/forms/add-quote-form';
import AddInvoiceForm from '../components/forms/add-invoice-form';
import { count } from 'console';

type Props = {};

export default function DashboardPage() {
  // Fetch real dashboard metrics
  const { data: dashboardMetrics, isLoading, isError } = useFetchDashboardMetrics();

  // Fetch real multi-year revenue data
  const {
    data: multiYearRevenueData,
    isLoading: isRevenueLoading,
    isError: isRevenueError,
    years
  } = useFetchMultiYearRevenueData();

  // Fetch real business status overview data
  const {
    data: businessStatusData,
    isLoading: isBusinessStatusLoading,
    isError: isBusinessStatusError
  } = useFetchBusinessStatusOverview();

  // Fetch real invoice status tracking data
  const {
    data: invoiceStatusData,
    isLoading: isInvoiceStatusLoading,
    isError: isInvoiceStatusError
  } = useFetchInvoiceStatusTracking();

  // State management for form sheets
  const [customerSheetOpen, setCustomerSheetOpen] = React.useState(false);
  const [quoteSheetOpen, setQuoteSheetOpen] = React.useState(false);
  const [invoiceSheetOpen, setInvoiceSheetOpen] = React.useState(false);

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
      <div className="flex flex-col w-full gap-4 my-4">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Customers */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Active Quotes</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Pending Leads</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <Badge variant="blue">Fast Track</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setCustomerSheetOpen(true)}>
                  <UserPlusIcon className="h-4 w-4 mr-3" />
                  Add New Customer
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setQuoteSheetOpen(true)}>
                  <FileIcon className="h-4 w-4 mr-3" />
                  Create Quote
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setInvoiceSheetOpen(true)}>
                  <Receipt className="h-4 w-4 mr-3" />
                  Generate Invoice
                </Button>
                <Button disabled className="w-full justify-start" variant="outline">
                  <KanbanSquareIcon className="h-4 w-4 mr-3" />
                  Update Kanban{' '}
                  <span className="text-red-400 ml-2 font-extralight">Coming Soon!</span>
                </Button>
                <Button disabled className="w-full justify-start" variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-3" />
                  Schedule Visit{' '}
                  <span className="text-red-400 ml-2 font-extralight">Coming Soon!</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Business Status Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Business Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isBusinessStatusLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading business status...</span>
                </div>
              ) : isBusinessStatusError || !businessStatusData ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <AlertTriangleIcon className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 text-sm">Error loading business status</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Quote Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Accepted</span>
                        </div>
                        <Badge variant="green">{businessStatusData.quoteStatus.accepted}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ClockIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                        </div>
                        <Badge variant="yellow">{businessStatusData.quoteStatus.pending}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <XCircleIcon className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                        </div>
                        <Badge variant="red">{businessStatusData.quoteStatus.rejected}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Invoice Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Paid</span>
                        </div>
                        <Badge variant="green">{businessStatusData.invoiceStatus.paid}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock4Icon className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                        </div>
                        <Badge variant="yellow">{businessStatusData.invoiceStatus.pending}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangleIcon className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Overdue</span>
                        </div>
                        <Badge variant="red">{businessStatusData.invoiceStatus.overdue}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Project Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PlayIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                        </div>
                        <Badge variant="blue">{businessStatusData.projectStatus.active}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PauseIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">On Hold</span>
                        </div>
                        <Badge variant="yellow">{businessStatusData.projectStatus.onHold}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Completed
                          </span>
                        </div>
                        <Badge variant="green">{businessStatusData.projectStatus.completed}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Types - Horizontal Layout */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Customer Types
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <HomeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Residential
                        </p>
                        <p className="text-xs text-gray-500">Active customers</p>
                      </div>
                    </div>
                    <Badge variant="blue">189</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                        <BuildingIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Commercial
                        </p>
                        <p className="text-xs text-gray-500">Business clients</p>
                      </div>
                    </div>
                    <Badge variant="default">58</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <UsersIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Referrals
                        </p>
                        <p className="text-xs text-gray-500">Word of mouth</p>
                      </div>
                    </div>
                    <Badge variant="green">34</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                        <TrendingUpIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          New Leads
                        </p>
                        <p className="text-xs text-gray-500">This month</p>
                      </div>
                    </div>
                    <Badge variant="yellow">42</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends & Invoice Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly Revenue Trend */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Title className="text-gray-900 dark:text-white">
                {years.length}-Year Revenue Trend
              </Title>
              <Subtitle className="text-gray-600 dark:text-gray-400">
                Monthly revenue growth from {years[0]} to current ({years[years.length - 1]})
              </Subtitle>
              {isRevenueLoading ? (
                <div className="mt-6 h-96 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading revenue data...</span>
                </div>
              ) : isRevenueError || !multiYearRevenueData ? (
                <div className="mt-6 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600">Error loading revenue data</p>
                  </div>
                </div>
              ) : (
                <AreaChart
                  data={multiYearRevenueData}
                  index="month"
                  categories={years}
                  colors={['gray', 'red', 'yellow', 'blue', 'green'].slice(0, years.length)}
                  className="mt-6 h-96"
                  valueFormatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                  showAnimation={true}
                  showLegend={true}
                  showGridLines={true}
                  connectNulls={false}
                />
              )}
            </Card>
          </div>

          {/* Invoice Status */}
          <Card className="p-6">
            <Title className="text-gray-900 dark:text-white">Invoice Status</Title>
            <Subtitle className="text-gray-600 dark:text-gray-400">Payment tracking</Subtitle>
            {isInvoiceStatusLoading ? (
              <div className="mt-6 flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading invoice data...</span>
              </div>
            ) : isInvoiceStatusError || !invoiceStatusData ? (
              <div className="mt-6 flex items-center justify-center h-32">
                <div className="text-center">
                  <AlertTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">Error loading invoice data</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {Object.entries(invoiceStatusData).map(([key, item]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.status}</p>
                      <p className="text-sm text-gray-500">{item.count} invoices</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.amount >= 1000
                          ? `$${(item.amount / 1000).toFixed(0)}K`
                          : `$${item.amount}`}
                      </p>
                      <Badge
                        variant={
                          item.status === 'Paid'
                            ? 'green'
                            : item.status === 'Pending'
                              ? 'yellow'
                              : item.status === 'Draft'
                                ? 'gray'
                                : 'red'
                        }>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quote Status Distribution */}
          {/* <Card className="p-6">
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
          </Card> */}

          {/* Lead Pipeline */}
          {/* <Card className="p-6">
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
          </Card> */}
        </div>

        {/* Performance Metrics & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Key Performance Indicators */}
          {/* <Card className="p-6">
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
          </Card> */}

          {/* Recent Activity Feed */}
          {/* <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Recent Activity
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card> */}
        </div>
      </div>

      {/* Customer Form Sheet */}
      <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg px-2">
          <SheetHeader className="px-4 space-y-0 mb-4">
            <SheetTitle>Add New Customer</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <AddCustomerForm setOpen={setCustomerSheetOpen} />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Quote Form Sheet */}
      <Sheet open={quoteSheetOpen} onOpenChange={setQuoteSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg px-2">
          <SheetHeader className="px-4 space-y-0 mb-4">
            <SheetTitle>Create New Quote</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <AddQuoteForm />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Invoice Form Sheet */}
      <Sheet open={invoiceSheetOpen} onOpenChange={setInvoiceSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg px-2">
          <SheetHeader className="px-4 space-y-0 mb-4">
            <SheetTitle>Create New Invoice</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <AddInvoiceForm setOpen={setInvoiceSheetOpen} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
