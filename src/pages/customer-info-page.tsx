import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
} from '../hooks/useAPI/useCustomers';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  abbreviateName,
  formatDate,
  formatMoneyValue,
  formatNumber,
  formatPhoneNumber
} from '../lib/utils';
import GoogleMapsAddressPreviewPopover from '../components/google-maps-preview';
import {
  BoxIcon,
  CalendarIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  CircleDollarSignIcon,
  ClipboardSignatureIcon,
  FileIcon,
  HashIcon,
  MousePointerClickIcon,
  PaperclipIcon,
  PencilIcon,
  SendIcon,
  TrashIcon
} from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import DefaultStatusBadge from '../components/status-badges';
import EmptyStateCard, { EmptyStateItemsNotFound } from '../components/empty-state-card';

type Props = {};

export default function CustomerInfoPage({}: Props) {
  const { id } = useParams();
  const location = useLocation();
  const { customerById, isError, isLoading } = useFetchCustomerByID(id);
  const { customerInvoices, isLoading: isCustomerInvoicesLoading } = useFetchCustomerInvoices(id);
  const { customerQuotes } = useFetchCustomerQuotes(id);

  React.useEffect(() => {
    console.log(customerQuotes);
    console.log(customerById);
  }, []);

  if (isLoading === true || isCustomerInvoicesLoading === true) {
    return (
      <div className="flex flex-col w-full gap-4">
        <div className="flex w-full mt-2 gap-2">
          {/* <Link to={'/'}>Home</Link>
        <p>/</p> */}
          <Link to={'/customers'}>Customers</Link>
          <p>/</p>
          <Link to={location.pathname}>Customer-{id}</Link>
        </div>
        <Skeleton className="h-[161px] rounded-md" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[48px] rounded-md" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex w-full mt-2 gap-2">
        {/* <Link to={'/'}>Home</Link>
        <p>/</p> */}
        <Link to={'/customers'}>Customers</Link>
        <p>/</p>
        <Link to={location.pathname}>Customer-{id}</Link>
      </div>
      <div className="flex flex-col border py-4 px-4 rounded-md gap-8">
        <div className="flex flex-col md:flex-row w-full gap-4 justify-between">
          <div className="flex gap-4">
            <div>
              <Avatar className="w-[50px] h-[50px]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {abbreviateName(`${customerById?.first_name} ${customerById?.last_name}`)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="my-auto">
              <p className="font-bold text-[24px] my-auto">
                {customerById?.first_name} {customerById?.last_name}
              </p>
            </div>
            <div className="my-auto">
              {customerById?.customer_type.name === 'Residential' && (
                <>
                  <DefaultStatusBadge title={customerById?.customer_type.name} variant="blue" />
                </>
              )}
              {customerById?.customer_type.name === 'Commercial' && (
                <>
                  <DefaultStatusBadge title={customerById?.customer_type.name} variant="green" />
                </>
              )}
              {customerById?.customer_type.name !== 'Commercial' &&
                customerById?.customer_type.name !== 'Residential' && (
                  <>
                    <DefaultStatusBadge title={customerById?.customer_type.name} variant="gray" />
                  </>
                )}

              {/* <Badge variant={'gray'}>{customerById.customer_type.name}</Badge> */}
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant={'outline'}>
              <PencilIcon className="w-4 h-4 mr-4" />
              Edit Info
            </Button>
            <Button>
              <TrashIcon className="w-4 h-4 mr-4" />
              Delete
            </Button>
          </div>
        </div>
        <div className="grid grid-flow-col grid-rows-3 md:grid-rows-1 gap-6 px-1">
          <div>
            <p className="text-gray-500 font-semibold text-[14px]">Email</p>
            <p>{customerById?.email}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-[14px]">Phone Number</p>
            <p>{formatPhoneNumber(customerById?.phone_number)}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-[14px]">Main Address</p>
            <GoogleMapsAddressPreviewPopover
              streetAddress={customerById?.street_address}
              city={customerById?.city}
              state={customerById?.state}
              zipcode={customerById?.zipcode}
              addressQuery={`${customerById?.street_address} ${customerById?.city} ${customerById?.state} ${customerById?.zipcode}`}
              textSize={'md'}
            />
            {/* <p>
              {customerById?.street_address} {customerById?.city}, {customerById?.state}{' '}
              {customerById?.zipcode}
            </p> */}
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-[14px]">Market</p>
            <p>
              {customerById?.city}, {customerById?.state} 🇺🇸
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-[14px]">Registered</p>
            <p>Tuesday, Dec 19, 2023</p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full justify-start py-6 px-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials" disabled>
              Financials
            </TabsTrigger>
            <TabsTrigger value="payment-methods" disabled>
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="locations" disabled>
              Locations
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="border rounded-md p-4">
            {/* <p>This will display customers invoices and quotes...</p> */}
            <div className="flex flex-col gap-4 p-2">
              <div>
                <div className="flex gap-4 mb-2">
                  <SendIcon className="w-5 h-5 my-auto" />
                  <p className="text-[22px] font-semibold">Invoices</p>
                </div>
                {customerInvoices?.length === 0 && (
                  <>
                    {/* <p className="text-gray-500 dark:text-gray-300 text-center font-light mb-2">
                      No invoices found for this customer.
                    </p> */}
                    <EmptyStateItemsNotFound
                      title="No Invoices Found"
                      description="This customer currently does not have any invoices in our system saved."
                    />
                  </>
                )}
                {customerInvoices?.length > 0 && (
                  <>
                    <Table>
                      <TableCaption>
                        A list of {customerById?.first_name}'s recent invoices.
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="flex w-[100px]">
                            <HashIcon className="w-4 h-4 mr-2 my-auto" />
                            <p className="my-auto">Invoice</p>
                          </TableHead>
                          <TableHead>
                            <div className="flex">
                              <CircleDashedIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Status</p>
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex">
                              <CalendarIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Date</p>
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex">
                              <BoxIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Service</p>
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex w-full justify-end">
                              <CircleDollarSignIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Amount</p>
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex w-full justify-end">
                              <MousePointerClickIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Action</p>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerInvoices?.map((item: any, index: number) => {
                          return (
                            <>
                              <React.Fragment key={index}>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    INV-
                                    {formatNumber(item.invoice_number)}
                                  </TableCell>
                                  <TableCell>
                                    {item.invoice_status.name === 'Overdue' && (
                                      <>
                                        <DefaultStatusBadge
                                          title={item.invoice_status.name}
                                          variant="red"
                                        />
                                      </>
                                    )}
                                    {item.invoice_status.name === 'Pending' && (
                                      <>
                                        <DefaultStatusBadge
                                          title={item.invoice_status.name}
                                          variant="yellow"
                                        />
                                      </>
                                    )}
                                    {item.invoice_status.name === 'Paid' && (
                                      <>
                                        <DefaultStatusBadge
                                          title={item.invoice_status.name}
                                          variant="green"
                                        />
                                      </>
                                    )}
                                    {item.invoice_status.name === 'Draft' && (
                                      <>
                                        <DefaultStatusBadge
                                          title={item.invoice_status.name}
                                          variant="gray"
                                        />
                                      </>
                                    )}
                                  </TableCell>
                                  <TableCell>{formatDate(item.invoice_date)}</TableCell>
                                  <TableCell>{item.service_type.name}</TableCell>
                                  <TableCell className="text-right">
                                    ${formatMoneyValue(item.total)}
                                  </TableCell>
                                  <TableCell className="flex">
                                    <Button variant={'secondary'} className="ml-auto">
                                      <ChevronRightIcon className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            </>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </>
                )}
              </div>
              <div>
                <div className="flex gap-4 mb-2">
                  <ClipboardSignatureIcon className="w-5 h-5 my-auto" />
                  <p className="text-[22px] font-semibold">Quotes</p>
                </div>
                {customerQuotes?.length === 0 && (
                  <>
                    {/* <p className="text-gray-500 dark:text-gray-300 text-center font-light mb-2">
                      No quotes found for this customer.
                    </p> */}
                    <EmptyStateItemsNotFound
                      title="No Quotes Found"
                      description="This customer currently does not have any quotes in our system saved."
                    />
                  </>
                )}
                {customerQuotes?.length > 0 && (
                  <>
                    <Table>
                      <TableCaption>
                        A list of {customerById?.first_name}'s recent quotes.
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="flex w-[100px]">
                            <HashIcon className="w-4 h-4 mr-2 my-auto" />
                            <p className="my-auto">Quote</p>
                          </TableHead>
                          <TableHead>
                            <div className="flex">
                              <CircleDashedIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Status</p>
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex">
                              <CalendarIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Date</p>
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex">
                              <BoxIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Service</p>
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex w-full justify-end">
                              <CircleDollarSignIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Amount</p>
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex w-full justify-end">
                              <MousePointerClickIcon className="w-4 h-4 mr-2 my-auto" />
                              <p className="my-auto">Action</p>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerQuotes?.map((item: any, index: number) => {
                          return (
                            <React.Fragment key={index}>
                              <TableRow>
                                <TableCell className="font-medium">
                                  QT-
                                  {formatNumber(item.quote_number)}
                                </TableCell>
                                <TableCell>
                                  {item.quote_status.name === 'Rejected' && (
                                    <>
                                      <DefaultStatusBadge
                                        title={item.quote_status.name}
                                        variant="red"
                                      />
                                    </>
                                  )}
                                  {item.quote_status.name === 'Pending' && (
                                    <>
                                      <DefaultStatusBadge
                                        title={item.quote_status.name}
                                        variant="yellow"
                                      />
                                    </>
                                  )}
                                  {item.quote_status.name === 'Accepted' && (
                                    <>
                                      <DefaultStatusBadge
                                        title={item.quote_status.name}
                                        variant="green"
                                      />
                                    </>
                                  )}
                                  {item.quote_status.name === 'Draft' && (
                                    <>
                                      <DefaultStatusBadge
                                        title={item.quote_status.name}
                                        variant="gray"
                                      />
                                    </>
                                  )}
                                </TableCell>
                                <TableCell>{formatDate(item.quote_date)}</TableCell>
                                <TableCell>{item.services.name}</TableCell>
                                <TableCell className="text-right">
                                  ${formatMoneyValue(item.total)}
                                </TableCell>
                                <TableCell className="flex">
                                  <Button variant={'secondary'} className="ml-auto">
                                    <ChevronRightIcon className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="locations">
            This is a location where the customer can add multiple addresses to their account.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
