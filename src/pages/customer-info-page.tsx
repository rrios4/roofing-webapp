import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';
import {
  useFetchCustomerByID,
  useFetchCustomerInvoices,
  useFetchCustomerQuotes
} from '../hooks/useAPI/use-customer';
import { useFetchProjects } from '../hooks/useAPI/use-projects';
import { Link, useParams } from 'react-router-dom';
import {
  abbreviateName,
  formatDate,
  formatMoneyValue,
  formatNumber,
  formatPhoneNumber
} from '../lib/utils';
import GoogleMapsAddressPreviewPopover from '../components/google-maps-preview';
import {
  ActivityIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClipboardSignatureIcon,
  FolderKanbanIcon,
  HashIcon,
  LayoutDashboardIcon,
  Loader2,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  SendIcon,
  TrendingUpIcon
} from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import DefaultStatusBadge from '../components/status-badges';
import { ConnectedDeleteCustomerAlertDialog } from '../components/connected-delete-dialogs';
import EditCustomerForm from '../components/forms/edit-customer-form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../components/ui/sheet';
import { ScrollArea } from '../components/ui/scroll-area';
import { PageBreadcrumb } from '../components/ui/breadcrumb';
import CustomerEmailsTab from '../components/customer-emails-tab';

function stringHue(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

function avatarBg(name: string): string {
  return `oklch(0.78 0.08 ${stringHue(name)})`;
}

function invoiceStatusVariant(name: string): 'red' | 'yellow' | 'green' | 'gray' {
  if (name === 'Overdue') return 'red';
  if (name === 'Pending') return 'yellow';
  if (name === 'Paid') return 'green';
  return 'gray';
}

function quoteStatusVariant(name: string): 'red' | 'yellow' | 'green' | 'gray' {
  if (name === 'Rejected') return 'red';
  if (name === 'Pending') return 'yellow';
  if (name === 'Accepted') return 'green';
  return 'gray';
}

const GLASS = 'bg-card border border-border rounded-2xl';

export default function CustomerInfoPage() {
  const { id } = useParams();
  const { customerById, isLoading } = useFetchCustomerByID(id);
  const { customerInvoices, isLoading: isCustomerInvoicesLoading } = useFetchCustomerInvoices(id);
  const { customerQuotes } = useFetchCustomerQuotes(id);
  const { data: allProjects, isLoading: projectsLoading } = useFetchProjects();

  const customerProjects = useMemo(
    () => allProjects?.filter((p) => p.customer === Number(id)) ?? [],
    [allProjects, id]
  );

  const lifetimeValue = useMemo(
    () => customerInvoices?.reduce((sum: number, inv: any) => sum + (inv.total ?? 0), 0) ?? 0,
    [customerInvoices]
  );

  const fullName = customerById ? `${customerById.first_name} ${customerById.last_name}` : '';

  if (isLoading || isCustomerInvoicesLoading) {
    return (
      <div className="flex flex-col w-full gap-4 pt-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[180px] rounded-2xl" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[80px] rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4 pb-10">
      {/* Breadcrumb */}
      <div className="pt-4 pb-1">
        <PageBreadcrumb
          currentPage={`Customer #${id}`}
          parentPages={[{ label: 'Customers', href: '/customers' }]}
          homeHref="/"
        />
      </div>

      {/* ── Hero Header ── */}
      <div className={`${GLASS} p-5 flex flex-col gap-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
              style={{ background: avatarBg(fullName), color: '#1a1a1d' }}>
              {abbreviateName(fullName)}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">{fullName}</h1>
              {customerById?.customer_type && (
                <div className="mt-1">
                  <DefaultStatusBadge
                    title={customerById.customer_type.name}
                    variant={
                      customerById.customer_type.name === 'Residential'
                        ? 'blue'
                        : customerById.customer_type.name === 'Commercial'
                          ? 'green'
                          : 'gray'
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <PencilIcon className="w-3.5 h-3.5" />
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-xl px-2">
                <SheetHeader className="px-4 space-y-0">
                  <SheetTitle>Edit Customer</SheetTitle>
                  <SheetDescription>
                    Make changes to your customer here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-full pb-8 pt-6">
                  <EditCustomerForm customerData={customerById} />
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <ConnectedDeleteCustomerAlertDialog
              title="Delete Customer"
              description="This action cannot be undone. This will permanently delete customer data from our server and cannot be retrieved back."
              itemId={id || ''}
            />
          </div>
        </div>

        {/* Contact strip */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm pt-3 border-t border-black/5 dark:border-white/5">
          {customerById?.email && (
            <a
              href={`mailto:${customerById.email}`}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <MailIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{customerById.email}</span>
            </a>
          )}
          {customerById?.phone_number && (
            <a
              href={`tel:${customerById.phone_number}`}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formatPhoneNumber(customerById.phone_number)}</span>
            </a>
          )}
          {customerById?.street_address && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <GoogleMapsAddressPreviewPopover
                streetAddress={customerById.street_address}
                city={customerById.city || ''}
                state={customerById.state || ''}
                zipcode={customerById.zipcode || ''}
                addressQuery={`${customerById.street_address} ${customerById.city} ${customerById.state} ${customerById.zipcode}`}
                textSize="sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          {
            label: 'Lifetime Value',
            value: `$${formatMoneyValue(lifetimeValue)}`,
            icon: <TrendingUpIcon className="w-4 h-4 text-emerald-500" />
          },
          {
            label: 'Projects',
            value: projectsLoading ? '—' : String(customerProjects.length),
            icon: <FolderKanbanIcon className="w-4 h-4 text-blue-500" />
          },
          {
            label: 'Invoices',
            value: String(customerInvoices?.length ?? 0),
            icon: <SendIcon className="w-4 h-4 text-violet-500" />
          },
          {
            label: 'Quotes',
            value: String(customerQuotes?.length ?? 0),
            icon: <ClipboardSignatureIcon className="w-4 h-4 text-orange-500" />
          },
          {
            label: 'Member Since',
            value: customerById?.created_at ? formatDate(customerById.created_at) : '—',
            icon: <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          },
          {
            label: 'Market',
            value:
              customerById?.city && customerById.state
                ? `${customerById.city}, ${customerById.state}`
                : '—',
            icon: <MapPinIcon className="w-4 h-4 text-muted-foreground" />
          }
        ].map((stat) => (
          <div key={stat.label} className={`${GLASS} px-3 py-3 flex flex-col gap-1.5`}>
            <div className="flex items-center gap-1.5">
              {stat.icon}
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground truncate">
                {stat.label}
              </span>
            </div>
            <span className="text-base font-bold leading-none truncate">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full justify-start overflow-x-auto py-6 px-2 gap-1">
          <TabsTrigger value="overview" className="flex items-center gap-1.5">
            <LayoutDashboardIcon className="w-3.5 h-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1.5">
            <FolderKanbanIcon className="w-3.5 h-3.5" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-1.5">
            <SendIcon className="w-3.5 h-3.5" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-1.5">
            <ClipboardSignatureIcon className="w-3.5 h-3.5" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-1.5">
            <MailIcon className="w-3.5 h-3.5" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="activity" disabled className="flex items-center gap-1.5">
            <ActivityIcon className="w-3.5 h-3.5" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              {/* Customer details */}
              <div className={`${GLASS} p-4 flex flex-col gap-3`}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Details
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  {customerById?.company_name && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Company</span>
                      <span className="font-medium text-right truncate">
                        {customerById.company_name}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{customerById?.customer_type?.name ?? '—'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium truncate">{customerById?.email ?? '—'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">
                      {formatPhoneNumber(customerById?.phone_number) || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-right">
                      {[
                        customerById?.street_address,
                        customerById?.city,
                        customerById?.state,
                        customerById?.zipcode
                      ]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Registered</span>
                    <span className="font-medium">
                      {customerById?.created_at ? formatDate(customerById.created_at) : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent invoices preview */}
              <div className={`${GLASS} p-4 flex flex-col gap-3`}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Recent Invoices
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {customerInvoices?.length ?? 0} total
                  </span>
                </div>
                {!customerInvoices || customerInvoices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-3">No invoices yet</p>
                ) : (
                  <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
                    {customerInvoices.slice(0, 3).map((inv: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2.5 gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <DefaultStatusBadge
                            title={inv.invoice_status?.name ?? ''}
                            variant={invoiceStatusVariant(inv.invoice_status?.name ?? '')}
                          />
                          <span className="text-xs text-muted-foreground truncate">
                            INV-{formatNumber(inv.invoice_number)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-semibold">
                            ${formatMoneyValue(inv.total)}
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <Link to={`/invoices/${inv.invoice_number}`}>
                              <ChevronRightIcon className="w-3.5 h-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* Recent quotes preview */}
              <div className={`${GLASS} p-4 flex flex-col gap-3`}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Recent Quotes
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {customerQuotes?.length ?? 0} total
                  </span>
                </div>
                {!customerQuotes || customerQuotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-3">No quotes yet</p>
                ) : (
                  <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
                    {customerQuotes.slice(0, 3).map((q: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2.5 gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <DefaultStatusBadge
                            title={q.quote_status?.name ?? ''}
                            variant={quoteStatusVariant(q.quote_status?.name ?? '')}
                          />
                          <span className="text-xs text-muted-foreground truncate">
                            QT-{formatNumber(q.quote_number)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-semibold">
                            ${formatMoneyValue(q.total)}
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <Link to={`/quotes/${q.quote_number}`}>
                              <ChevronRightIcon className="w-3.5 h-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent projects preview */}
              <div className={`${GLASS} p-4 flex flex-col gap-3`}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Recent Projects
                  </p>
                  {!projectsLoading && (
                    <span className="text-xs text-muted-foreground">
                      {customerProjects.length} total
                    </span>
                  )}
                </div>
                {projectsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : customerProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-3">No projects yet</p>
                ) : (
                  <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
                    {customerProjects.slice(0, 3).map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2.5 gap-3">
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">
                            {p.street_address || p.address || '—'}
                          </span>
                          {p.project_status?.name && (
                            <span className="text-xs text-muted-foreground">
                              {p.project_status.name}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          PRJ-{String(p.project_number ?? '').padStart(4, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Projects Tab ── */}
        <TabsContent value="projects">
          <div className={`${GLASS} p-4`}>
            {projectsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : customerProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No projects linked to this customer.
              </p>
            ) : (
              <Table>
                <TableCaption>All projects linked to {customerById?.first_name}.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        <HashIcon className="w-3.5 h-3.5" />
                        Project
                      </div>
                    </TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead className="text-right">Contract</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerProjects.map((p: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        PRJ-{String(p.project_number ?? '').padStart(4, '0')}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {p.street_address || p.address || '—'}
                      </TableCell>
                      <TableCell>
                        {p.project_status?.name ? (
                          <DefaultStatusBadge title={p.project_status.name} variant="blue" />
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>{p.start_date ? formatDate(p.start_date) : '—'}</TableCell>
                      <TableCell className="text-right">
                        {p.contract_amount != null
                          ? `$${formatMoneyValue(p.contract_amount)}`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7 ml-auto flex"
                          asChild>
                          <Link to="/projects">
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* ── Invoices Tab ── */}
        <TabsContent value="invoices">
          <div className={`${GLASS} p-4`}>
            {!customerInvoices || customerInvoices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No invoices found for this customer.
              </p>
            ) : (
              <Table>
                <TableCaption>A list of {customerById?.first_name}&apos;s invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">
                      <div className="flex items-center gap-1.5">
                        <HashIcon className="w-3.5 h-3.5" />
                        Invoice
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerInvoices.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        INV-{formatNumber(item.invoice_number)}
                      </TableCell>
                      <TableCell>
                        <DefaultStatusBadge
                          title={item.invoice_status?.name ?? ''}
                          variant={invoiceStatusVariant(item.invoice_status?.name ?? '')}
                        />
                      </TableCell>
                      <TableCell>{formatDate(item.invoice_date)}</TableCell>
                      <TableCell>{item.service?.name ?? '—'}</TableCell>
                      <TableCell className="text-right">${formatMoneyValue(item.total)}</TableCell>
                      <TableCell>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7 ml-auto flex"
                          asChild>
                          <Link to={`/invoices/${item.invoice_number}`}>
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* ── Quotes Tab ── */}
        <TabsContent value="quotes">
          <div className={`${GLASS} p-4`}>
            {!customerQuotes || customerQuotes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No quotes found for this customer.
              </p>
            ) : (
              <Table>
                <TableCaption>A list of {customerById?.first_name}&apos;s quotes.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">
                      <div className="flex items-center gap-1.5">
                        <HashIcon className="w-3.5 h-3.5" />
                        Quote
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerQuotes.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        QT-{formatNumber(item.quote_number)}
                      </TableCell>
                      <TableCell>
                        <DefaultStatusBadge
                          title={item.quote_status?.name ?? ''}
                          variant={quoteStatusVariant(item.quote_status?.name ?? '')}
                        />
                      </TableCell>
                      <TableCell>{formatDate(item.quote_date)}</TableCell>
                      <TableCell>{item.service?.name ?? '—'}</TableCell>
                      <TableCell className="text-right">${formatMoneyValue(item.total)}</TableCell>
                      <TableCell>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7 ml-auto flex"
                          asChild>
                          <Link to={`/quotes/${item.quote_number}`}>
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* ── Emails Tab ── */}
        <TabsContent value="emails" className="border rounded-2xl p-4">
          <CustomerEmailsTab customerEmail={customerById?.email} customerName={fullName} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
