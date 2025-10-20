import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { PageBreadcrumb } from '../components/ui/breadcrumb';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import {
  CloudDownloadIcon,
  PencilIcon,
  PrinterIcon,
  SendHorizonalIcon,
  UserIcon,
  PackageIcon,
  CalendarIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';
import {
  useFetchQuoteById,
  useUpdateQuoteStatusById,
  useConvertQuoteToInvoice
} from '../hooks/useAPI/use-quotes';
import { useQuoteStatuses } from '../hooks/useAPI/use-quote-status';
import { formatDateWithAbbreviatedMonth, formatMoneyValue, formatNumber } from '../lib/utils';
import { useToast } from '../components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import UpdateQuoteSheet from '../components/forms/update-quote-sheet';
import { QuotePDFPreviewDialog } from '../components/quote-pdf-preview-dialog';
import { EmailQuoteDialog } from '../components/forms/send-email-quote-form';
import { transformQuoteForPDF } from '../lib/pdf-utils';
import ConvertQuoteAlertDialog from '../components/alert-convert-quote-dialog';

type Props = {};

export default function QuoteInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Validate and parse the quote number
  const parsedQuoteNumber = id ? parseInt(id, 10) : null;
  const isValidQuoteNumber =
    parsedQuoteNumber !== null && !isNaN(parsedQuoteNumber) && parsedQuoteNumber > 0;

  // API calls
  const {
    quoteById: quote,
    isLoading,
    isError
  } = useFetchQuoteById(isValidQuoteNumber ? parsedQuoteNumber : null);
  const { quoteStatuses, isLoading: isStatusesLoading } = useQuoteStatuses();
  const { mutate: updateQuoteStatus, isLoading: isUpdatingStatus } = useUpdateQuoteStatusById(
    toast,
    parsedQuoteNumber
  );
  const { mutate: convertQuoteToInvoice, isLoading: isConverting } = useConvertQuoteToInvoice(
    toast,
    parsedQuoteNumber || 0
  );

  // Show error if invalid quote number in URL
  if (!isValidQuoteNumber) {
    return (
      <div className="w-full mx-auto py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Invalid quote number in URL</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full mx-auto py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading quote...</div>
        </div>
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <div className="w-full mx-auto py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error loading quote or quote not found</div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = quote.subtotal || 0;
  const total = quote.total || 0;

  // Helper function to get status variant
  const getStatusVariant = (statusName: string) => {
    switch (statusName?.toLowerCase()) {
      case 'accepted':
      case 'approved':
        return 'green';
      case 'pending':
      case 'draft':
        return 'yellow';
      case 'rejected':
      case 'expired':
        return 'red';
      case 'converted':
        return 'blue';
      default:
        return 'gray';
    }
  };

  // Helper function to check if quote is expired
  const isQuoteExpired = () => {
    if (!quote.expiration_date) return false;
    const expirationDate = new Date(quote.expiration_date);
    const today = new Date();
    return expirationDate < today;
  };

  // Handle status change
  const handleStatusChange = (newStatusId: string) => {
    if (!quote?.quote_number) return;

    updateQuoteStatus(parseInt(newStatusId, 10), {
      onSuccess: () => {
        // Invalidate and refetch the quote data to reflect the status change
        queryClient.invalidateQueries({
          queryKey: ['quoteById', parsedQuoteNumber]
        });

        // Also invalidate the quotes list in case user navigates back
        queryClient.invalidateQueries({
          queryKey: ['quotes']
        });
      }
    });
  };

  // Handle convert quote to invoice
  const handleConvertQuote = () => {
    convertQuoteToInvoice(undefined, {
      onSuccess: (result: any) => {
        // Optional: Navigate to the newly created invoice
        const invoiceNumber = result.invoice.invoice_number;

        // Show success message and ask if user wants to view the invoice
        setTimeout(() => {
          const shouldNavigate = window.confirm(
            `Quote converted successfully! Invoice #INV-${invoiceNumber} has been created. Would you like to view the new invoice now?`
          );
          if (shouldNavigate) {
            navigate(`/invoices/${invoiceNumber}`);
          }
        }, 1000); // Small delay to let the toast show first
      },
      onError: (error: any) => {
        // If the error mentions an existing invoice number, offer to navigate to it
        if (error.message.includes('Invoice #')) {
          const match = error.message.match(/Invoice #(\d+)/);
          if (match && match[1]) {
            const existingInvoiceNumber = match[1];
            setTimeout(() => {
              const shouldNavigate = window.confirm(
                `This quote has already been converted. Would you like to view the existing Invoice #INV-${existingInvoiceNumber}?`
              );
              if (shouldNavigate) {
                navigate(`/invoices/${existingInvoiceNumber}`);
              }
            }, 1000);
          }
        }
      }
    });
  };

  return (
    <div className="w-full mx-auto py-4">
      {/* Breadcrumb Navigation */}
      <div className="pt-1 pb-2">
        <PageBreadcrumb
          currentPage={`Quote #${formatNumber(quote.quote_number || 0)}`}
          parentPages={[{ label: 'Quotes', href: '/quotes' }]}
          homeHref="/"
        />
      </div>

      {/* Header */}
      {/* <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-xl font-semibold">QUOTE-{formatNumber(quote.quote_number || 0)}</h1>
        </div>
      </div> */}

      {/* Menu Action Bar */}
      <div className="flex justify-between gap-4 mb-2 pb-2">
        <div className="w-full flex gap-2 mt-auto">
          {/* Update Quote Button */}
          <UpdateQuoteSheet
            quote={quote}
            trigger={
              <Button size={'icon'} variant={'secondary'} title="Edit quote">
                <PencilIcon className="w-[16px]" />
              </Button>
            }
          />

          <Button
            size={'icon'}
            variant={'secondary'}
            onClick={() => window.print()}
            title="Print quote">
            <PrinterIcon className="w-[16px]" />
          </Button>

          <QuotePDFPreviewDialog
            quote={transformQuoteForPDF(quote)}
            trigger={
              <Button size={'icon'} variant={'secondary'} title="Download PDF">
                <CloudDownloadIcon className="w-[16px]" />
              </Button>
            }
          />

          <EmailQuoteDialog
            quote={quote}
            trigger={
              <Button size={'icon'} variant={'secondary'} title="Email quote">
                <SendHorizonalIcon className="w-[16px]" />
              </Button>
            }
          />

          {/* Convert to Invoice Button */}
          {/* {!quote.converted && !isQuoteExpired() && (
            <ConvertQuoteAlertDialog
              quoteNumber={quote.quote_number}
              customerName={`${quote.customer?.first_name} ${quote.customer?.last_name}`}
              total={quote.total}
              onConfirm={handleConvertQuote}
              isLoading={isConverting}
              trigger={
                <Button size={'sm'} variant={'default'} title="Convert to invoice">
                  <CheckCircleIcon className="w-[16px] mr-2" />
                  Convert to Invoice
                </Button>
              }
            />
          )} */}
        </div>

        <div className="w-full flex justify-end gap-4">
          <div className="w-fit">
            <Label>Status</Label>
            <Select
              value={quote?.status_id?.toString() || ''}
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus || isStatusesLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isUpdatingStatus ? 'Updating...' : 'Select a status'} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Quote Status</SelectLabel>
                  {quoteStatuses?.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="w-full flex lg:flex-row flex-col gap-4">
        <Card className="dark:bg-zinc-900 w-full">
          <CardHeader>
            <div className="w-full flex flex-col sm:flex-row sm:justify-between md:px-6 md:pt-5">
              <div className="flex gap-4">
                <div className="w-[50px] h-max bg-blue-600 rounded-2xl transition ease-in-out duration-300 hover:scale-105">
                  <Link to={'/'}>
                    <img src="/company-logo.png" className="shadow-xs p-[0px] rounded-2xl" />
                  </Link>
                </div>
                <div className="text-md sm:text-lg font-semibold text-gray-700 dark:text-zinc-100">
                  <p className="">Rios Roofing</p>
                  <p className="-mt-2">Services</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:text-right">
                <Badge
                  className="w-fit mt-6 sm:mt-0 sm:ml-auto"
                  variant={getStatusVariant((quote as any).quote_status?.name || '')}>
                  {(quote as any).quote_status?.name || 'Unknown'}
                </Badge>
                <p className="text-lg font-medium">QT-{formatNumber(quote.quote_number || 0)}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Quote Info */}
            <div className="flex flex-col sm:px-6 pb-6 w-full">
              <div className="flex w-full justify-between gap-4">
                <div>
                  {/* Customer Avatar */}
                  <div className="flex gap-2">
                    <UserIcon className="w-4 h-4 my-auto" />
                    <p className="text-sm text-gray-500 align-middle">Customer</p>
                  </div>

                  <div className="flex my-2 pt-1 pb-2 gap-4">
                    <Link
                      to={`/customers/${quote.customer_id}`}
                      className="cursor-pointer hover:opacity-80 transition-opacity flex gap-4"
                      title="View customer details">
                      <Avatar>
                        <AvatarFallback>
                          {`${(quote.customer?.first_name || '').substring(0, 1)}${(quote.customer?.last_name || '').substring(0, 1)}`}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">
                          {quote.customer?.first_name || ''} {quote.customer?.last_name || ''}
                        </p>
                        <p className="font-light">{quote.customer?.email || ''}</p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-right">
                  <div className="flex gap-2">
                    <PackageIcon className="w-4 h-4 my-auto" />
                    <p className="text-sm text-gray-500 mb-0">Service</p>
                  </div>

                  <p className="font-medium">{quote.service?.name || 'Unknown Service'}</p>
                </div>
              </div>

              {/* Quote From / To */}
              <div className="w-full flex flex-col sm:flex-row justify-between gap-4 py-2">
                <div className="w-full text-left">
                  <p className="text-sm text-gray-500 mb-1">Quote From</p>
                  <p className="mb-1 font-medium">Rios Roofing</p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    150 Tallant St, Houston TX 77076
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    rrios.roofing@gmail.com
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">832-310-3593</p>

                  <div className="my-6 text-left">
                    <p className="text-sm text-gray-500">Quote Date</p>
                    <p className="font-medium">
                      {quote.quote_date ? formatDateWithAbbreviatedMonth(quote.quote_date) : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="w-full text-left">
                  <p className="text-sm text-gray-500 mb-1">Quote To</p>
                  <p className="mb-1 font-medium">
                    {quote.customer?.first_name || ''} {quote.customer?.last_name || ''}
                  </p>
                  {/* Display custom address if available, otherwise fall back to customer address */}
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {[
                      quote.custom_street_address || quote.customer?.street_address,
                      [
                        quote.custom_city || quote.customer?.city,
                        quote.custom_state || quote.customer?.state,
                        quote.custom_zipcode || quote.customer?.zipcode
                      ]
                        .filter(Boolean)
                        .join(', ')
                    ]
                      .filter(Boolean)
                      .join(', ') || 'No address provided'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {quote.customer?.email || ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {quote.customer?.phone_number || ''}
                  </p>

                  <div className="text-left my-6">
                    <p className="text-sm text-gray-500">Expiration Date</p>
                    <p className={`font-medium ${isQuoteExpired() ? 'text-red-600' : ''}`}>
                      {quote.expiration_date
                        ? formatDateWithAbbreviatedMonth(quote.expiration_date)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-hidden border border-gray-200 dark:border-zinc-800 rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-zinc-800">
                    <TableRow>
                      <TableHead className="w-[100px]">#</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(quote as any).quote_line_item && (quote as any).quote_line_item.length > 0 ? (
                      (quote as any).quote_line_item.map((lineItem: any, index: number) => (
                        <TableRow key={lineItem.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <p className="font-medium">
                              {lineItem.description || 'No description'}
                            </p>
                            {/* {lineItem.sq_ft && (
                              <p className="text-sm text-gray-500">Square feet: {lineItem.sq_ft}</p>
                            )} */}
                          </TableCell>
                          <TableCell className="text-right">{lineItem.qty || 0}</TableCell>
                          <TableCell className="text-right">Fixed</TableCell>
                          <TableCell className="text-right">
                            ${formatMoneyValue(lineItem.amount || 0)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Fallback single row if no line items
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>
                          <p className="font-medium">{quote.service?.name || 'Roofing Service'}</p>
                          {quote.measurement_note && (
                            <p className="text-sm text-gray-500">{quote.measurement_note}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-right">1</TableCell>
                        <TableCell className="text-right">Fixed</TableCell>
                        <TableCell className="text-right">
                          ${formatMoneyValue(quote.total || 0)}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mt-6">
                <div className="w-72 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${formatMoneyValue(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-base border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ${formatMoneyValue(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-8">
                <p className="text-sm font-medium">NOTES</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {quote.public_note || quote.cust_note || 'No customer notes added'}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-10 text-sm text-gray-600">
                <div></div>
                <div>
                  <p>Have a Question?</p>
                  <a href="mailto:rrios.roofing@gmail.com" className="text-blue-600">
                    rrios.roofing@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-1/3 h-fit">
          <CardContent>
            <div className="flex flex-col sm:px-0 pb-6 w-full">
              {/* Quote Information */}
              <div className="mt-8">
                <p className="text-sm font-medium my-4">Quote Information</p>

                {/* Quote Total Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Quote Total
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        ${formatMoneyValue(total)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        quote.converted
                          ? 'green'
                          : (quote as any).quote_status?.name?.toLowerCase() === 'accepted'
                            ? 'green'
                            : isQuoteExpired()
                              ? 'red'
                              : 'blue'
                      }
                      className="text-sm">
                      {quote.converted
                        ? 'Converted'
                        : (quote as any).quote_status?.name?.toLowerCase() === 'accepted'
                          ? 'Accepted Quote'
                          : isQuoteExpired()
                            ? 'Expired Quote'
                            : 'Active Quote'}
                    </Badge>
                  </div>
                </div>

                {/* Quote Status & Dates */}
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                        <Badge variant={getStatusVariant((quote as any).quote_status?.name || '')}>
                          {(quote as any).quote_status?.name || 'Unknown'}
                        </Badge>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Issue Date:
                        </span>
                        <span className="text-sm font-medium">
                          {quote.issue_date
                            ? formatDateWithAbbreviatedMonth(quote.issue_date)
                            : 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Expires:</span>
                        <span
                          className={`text-sm font-medium ${isQuoteExpired() ? 'text-red-600' : ''}`}>
                          {quote.expiration_date
                            ? formatDateWithAbbreviatedMonth(quote.expiration_date)
                            : 'N/A'}
                        </span>
                      </div>

                      {quote.converted && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Converted:
                          </span>
                          <Badge variant="green" className="text-xs">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            To Invoice
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!quote.converted && !isQuoteExpired() && (
                    <div className="space-y-2">
                      <ConvertQuoteAlertDialog
                        quoteNumber={quote.quote_number}
                        customerName={`${quote.customer?.first_name} ${quote.customer?.last_name}`}
                        total={quote.total}
                        onConfirm={handleConvertQuote}
                        isLoading={isConverting}
                      />
                      <EmailQuoteDialog
                        quote={quote}
                        trigger={
                          <Button className="w-full" variant="outline">
                            <SendHorizonalIcon className="w-4 h-4 mr-2" />
                            Send Quote
                          </Button>
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Private Note */}
              <div className="mt-6">
                <p className="text-sm font-medium my-4">Private Note</p>
                <Textarea
                  className="min-h-[200px]"
                  value={quote.private_note || ''}
                  placeholder="No private notes added"
                  readOnly
                />
              </div>

              {/* Measurement Note */}
              <div className="mt-4">
                <p className="text-sm font-medium my-4">Measurement Note</p>
                <Textarea
                  className="min-h-[200px]"
                  value={quote.measurement_note || ''}
                  placeholder="No measurement notes added"
                  readOnly
                />
              </div>

              {/* Customer Note */}
              {/* <div className="mt-4">
                <p className="text-sm font-medium my-4">Customer Note</p>
                <Textarea
                  value={quote.cust_note || ''}
                  placeholder="No customer notes added"
                  readOnly
                />
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
