import React from 'react';
import { useParams } from 'react-router-dom';
import { PageBreadcrumb } from '../components/ui/breadcrumb';
import { Card, CardContent, CardHeader } from '../components/ui/card';
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
  BanknoteIcon,
  CloudDownloadIcon,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
  SendHorizonalIcon,
  Share2Icon,
  Trash2Icon,
  EditIcon,
  UserIcon,
  PackageIcon
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';
import { useFetchInvoiceById, useUpdateInvoiceStatusById } from '../hooks/useAPI/use-invoice';
import { useFetchAllInvoiceStatuses } from '../hooks/useAPI/use-invoice-status';
import { formatDateWithAbbreviatedMonth, formatMoneyValue, formatNumber } from '../lib/utils';
import { useToast } from '../components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import UpdateInvoiceSheet from '../components/forms/update-invoice-sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import {
  useCreateInvoicePayment,
  useDeleteInvoicePayment
} from '../hooks/useAPI/use-invoice-payment';
import { EmailInvoiceDialog } from '../components/forms/send-email-invoice-form';
import { InvoicePDFPreviewDialog } from '../components/invoice-pdf-preview-dialog';
import { transformInvoiceForPDF } from '../lib/pdf-utils';

type Props = {};

export default function InvoiceInfoPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Payment dialogs state
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
  const [isEditPaymentDialogOpen, setIsEditPaymentDialogOpen] = React.useState(false);
  const [editingPaymentId, setEditingPaymentId] = React.useState<number | null>(null);
  const [paymentForm, setPaymentForm] = React.useState({
    amount: '',
    payment_method: '',
    date_received: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  });
  const [editPaymentForm, setEditPaymentForm] = React.useState({
    amount: '',
    payment_method: '',
    date_received: new Date().toISOString().split('T')[0]
  });

  // Validate and parse the invoice number
  const parsedInvoiceNumber = id ? parseInt(id, 10) : null;
  const isValidInvoiceNumber =
    parsedInvoiceNumber !== null && !isNaN(parsedInvoiceNumber) && parsedInvoiceNumber > 0;

  // API calls
  const {
    data: invoice,
    isLoading,
    isError
  } = useFetchInvoiceById(isValidInvoiceNumber ? parsedInvoiceNumber : null);
  const { data: invoiceStatuses, isLoading: isStatusesLoading } = useFetchAllInvoiceStatuses();
  const { mutate: updateInvoiceStatus, isLoading: isUpdatingStatus } =
    useUpdateInvoiceStatusById(toast);
  const { mutate: createPayment, isLoading: isCreatingPayment } = useCreateInvoicePayment(
    toast,
    setIsPaymentDialogOpen
  );
  const { mutate: deletePayment, isLoading: isDeletingPayment } = useDeleteInvoicePayment(toast);

  // Show error if invalid invoice number in URL
  if (!isValidInvoiceNumber) {
    return (
      <div className="w-full mx-auto py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Invalid invoice number in URL</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full mx-auto py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading invoice...</div>
        </div>
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="w-full mx-auto py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error loading invoice or invoice not found</div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal =
    invoice.invoice_line_service?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalPayments =
    invoice.invoice_payment?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  const amountDue = subtotal - totalPayments;

  // Helper function to get status variant
  const getStatusVariant = (statusName: string) => {
    switch (statusName?.toLowerCase()) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'overdue':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Handle status change
  const handleStatusChange = (newStatusId: string) => {
    if (!invoice?.invoice_number) return;

    updateInvoiceStatus(
      {
        status_id: parseInt(newStatusId, 10),
        invoice_number: invoice.invoice_number
      },
      {
        onSuccess: () => {
          // Invalidate and refetch the invoice data to reflect the status change
          queryClient.invalidateQueries({
            queryKey: ['invoiceById', parsedInvoiceNumber]
          });

          // Also invalidate the invoices list in case user navigates back
          queryClient.invalidateQueries({
            queryKey: ['invoices']
          });
        }
      }
    );
  };

  // Handle payment form changes
  const handlePaymentFormChange = (field: string, value: string) => {
    setPaymentForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit payment form changes
  const handleEditPaymentFormChange = (field: string, value: string) => {
    setEditPaymentForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle payment submission
  const handleSubmitPayment = () => {
    if (!invoice?.invoice_number) return;

    // Validate form
    if (!paymentForm.amount || !paymentForm.payment_method || !paymentForm.date_received) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid payment amount.',
        variant: 'destructive'
      });
      return;
    }

    // Create payment
    createPayment(
      {
        invoice_id: invoice.invoice_number,
        amount: amount,
        payment_method: paymentForm.payment_method,
        date_received: paymentForm.date_received
      },
      {
        onSuccess: () => {
          // Reset form
          setPaymentForm({
            amount: '',
            payment_method: '',
            date_received: new Date().toISOString().split('T')[0]
          });

          // Refresh invoice data
          queryClient.invalidateQueries({
            queryKey: ['invoiceById', parsedInvoiceNumber]
          });

          setIsPaymentDialogOpen(false);
        }
      }
    );
  };

  // Handle dialog close
  const handleClosePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
    // Reset form when closing
    setPaymentForm({
      amount: '',
      payment_method: '',
      date_received: new Date().toISOString().split('T')[0]
    });
  };

  // Handle edit dialog close
  const handleCloseEditPaymentDialog = () => {
    setIsEditPaymentDialogOpen(false);
    setEditingPaymentId(null);
    // Reset edit form when closing
    setEditPaymentForm({
      amount: '',
      payment_method: '',
      date_received: new Date().toISOString().split('T')[0]
    });
  };

  // Handle edit payment
  const handleEditPayment = (payment: any) => {
    setEditingPaymentId(payment.id);
    setEditPaymentForm({
      amount: payment.amount.toString(),
      payment_method: payment.payment_method || '',
      date_received: payment.date_received
        ? new Date(payment.date_received).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    });
    setIsEditPaymentDialogOpen(true);
  };

  // Handle delete payment
  const handleDeletePayment = (paymentId: number) => {
    if (
      window.confirm('Are you sure you want to delete this payment? This action cannot be undone.')
    ) {
      deletePayment(
        {
          item_id: paymentId
        },
        {
          onSuccess: () => {
            // Refresh invoice data
            queryClient.invalidateQueries({
              queryKey: ['invoiceById', parsedInvoiceNumber]
            });
          }
        }
      );
    }
  };

  // Handle update payment (currently we don't have an update hook, so we'll delete and recreate)
  const handleUpdatePayment = () => {
    if (!invoice?.invoice_number || !editingPaymentId) return;

    // Validate form
    if (
      !editPaymentForm.amount ||
      !editPaymentForm.payment_method ||
      !editPaymentForm.date_received
    ) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const amount = parseFloat(editPaymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid payment amount.',
        variant: 'destructive'
      });
      return;
    }

    // First delete the old payment, then create a new one
    deletePayment(
      {
        item_id: editingPaymentId
      },
      {
        onSuccess: () => {
          // Immediately refresh invoice data after delete to reflect the change
          queryClient.invalidateQueries({
            queryKey: ['invoiceById', parsedInvoiceNumber]
          });

          // Create new payment with updated data
          createPayment(
            {
              invoice_id: invoice.invoice_number,
              amount: amount,
              payment_method: editPaymentForm.payment_method,
              date_received: editPaymentForm.date_received
            },
            {
              onSuccess: () => {
                // Reset form
                setEditPaymentForm({
                  amount: '',
                  payment_method: '',
                  date_received: new Date().toISOString().split('T')[0]
                });
                setEditingPaymentId(null);

                // Refresh invoice data again after creating the new payment
                queryClient.invalidateQueries({
                  queryKey: ['invoiceById', parsedInvoiceNumber]
                });

                setIsEditPaymentDialogOpen(false);

                toast({
                  title: 'Payment Updated',
                  description: 'Payment has been successfully updated.',
                  variant: 'default'
                });
              },
              onError: (error: any) => {
                toast({
                  title: 'Error Creating Payment',
                  description: `Failed to create the updated payment: ${error.message}`,
                  variant: 'destructive'
                });
              }
            }
          );
        },
        onError: (error: any) => {
          toast({
            title: 'Error Deleting Payment',
            description: `Failed to delete the original payment: ${error.message}`,
            variant: 'destructive'
          });
        }
      }
    );
  };

  return (
    <div className="w-full mx-auto py-4">
      {/* Breadcrumb Navigation */}
      <div className="pt-1 pb-2">
        <PageBreadcrumb
          currentPage={`Invoice #${formatNumber(invoice.invoice_number || 0)}`}
          parentPages={[{ label: 'Invoices', href: '/invoices' }]}
          homeHref="/"
        />
      </div>

      {/* Menu Action Bar */}
      <div className="flex justify-between gap-4 mb-2 pb-2">
        <div className="w-full flex gap-2 mt-auto">
          <UpdateInvoiceSheet
            invoice={invoice}
            trigger={
              <Button size={'icon'} variant={'secondary'}>
                <PencilIcon className="w-[16px]" />
              </Button>
            }
          />
          <Button
            size={'icon'}
            variant={'secondary'}
            onClick={() => window.print()}
            title="Print invoice">
            <PrinterIcon className="w-[16px]" />
          </Button>
          <InvoicePDFPreviewDialog
            invoice={transformInvoiceForPDF(invoice)}
            trigger={
              <Button size={'icon'} variant={'secondary'} title="Download PDF">
                <CloudDownloadIcon className="w-[16px]" />
              </Button>
            }
          />
          {/* <Button size={'icon'} variant={'secondary'}>
            <EyeIcon className="w-[16px]" />
          </Button> */}
          {/* <Button size={'icon'} variant={'secondary'}>
            <Share2Icon className="w-[16px]" />
          </Button> */}
          <EmailInvoiceDialog
            invoice={invoice}
            trigger={
              <Button size={'icon'} variant={'secondary'} title="Email invoice">
                <SendHorizonalIcon className="w-[16px]" />
              </Button>
            }
          />
        </div>
        <div className="w-full flex justify-end gap-4">
          <div className="w-fit">
            <Label>Status</Label>
            <Select
              value={invoice?.invoice_status_id?.toString() || ''}
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus || isStatusesLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isUpdatingStatus ? 'Updating...' : 'Select a status'} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Invoice Status</SelectLabel>
                  {invoiceStatuses?.map((status) => (
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
                  variant={getStatusVariant(invoice.invoice_status?.name || '')}>
                  {invoice.invoice_status?.name || 'Unknown'}
                </Badge>
                <p className="text-lg font-medium">
                  INV-{formatNumber(invoice.invoice_number || 0)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Invoice Info */}
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
                      to={`/customers/${invoice.customer_id}`}
                      className="cursor-pointer hover:opacity-80 transition-opacity flex gap-4"
                      title="View customer details">
                      <Avatar>
                        <AvatarFallback>
                          {`${(invoice.customer?.first_name || '').substring(0, 1)}${(invoice.customer?.last_name || '').substring(0, 1)}`}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">
                          {invoice.customer?.first_name || ''} {invoice.customer?.last_name || ''}
                        </p>
                        <p className="font-light">{invoice.customer?.email || ''}</p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-right">
                  <div className="flex gap-2">
                    <PackageIcon className="w-4 h-4 my-auto" />
                    <p className="text-sm text-gray-500 mb-0">Service</p>
                  </div>

                  <p className="font-medium">{invoice.service?.name || 'Unknown Service'}</p>
                </div>
              </div>

              {/* Invoice From / To */}
              <div className="w-full flex flex-col sm:flex-row justify-between gap-4 py-2">
                <div className="w-full text-left">
                  <p className="text-sm text-gray-500 mb-1">Invoice From</p>
                  <p className="mb-1 font-medium">Rios Roofing</p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    150 Tallant St, Houston TX 77076
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    rrios.roofing@gmail.com
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">832-310-3593</p>

                  <div className="my-6 text-left">
                    <p className="text-sm text-gray-500">Date Create</p>
                    <p className="font-medium">
                      {invoice.invoice_date
                        ? formatDateWithAbbreviatedMonth(invoice.invoice_date)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="w-full text-left">
                  <p className="text-sm text-gray-500 mb-1">Invoice To</p>
                  <p className="mb-1 font-medium">
                    {invoice.customer?.first_name || ''} {invoice.customer?.last_name || ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {invoice.bill_to_street_address || invoice.customer?.street_address || ''}
                    {invoice.bill_to_city || invoice.customer?.city
                      ? `, ${invoice.bill_to_city || invoice.customer?.city}`
                      : ''}
                    {invoice.bill_to_state || invoice.customer?.state
                      ? `, ${invoice.bill_to_state || invoice.customer?.state}`
                      : ''}{' '}
                    {invoice.bill_to_zipcode || invoice.customer?.zipcode || ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {invoice.customer?.email || ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {invoice.customer?.phone_number || ''}
                  </p>

                  <div className="text-left my-6">
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">
                      {invoice.due_date ? formatDateWithAbbreviatedMonth(invoice.due_date) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Table */}
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
                    {invoice.invoice_line_service?.map((lineItem, index) => (
                      <TableRow key={lineItem.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <p className="font-medium">{lineItem.description || 'No description'}</p>
                          {/* {lineItem.sq_ft && (
                            <p className="text-sm text-gray-500">Square feet: {lineItem.sq_ft}</p>
                          )} */}
                        </TableCell>
                        <TableCell className="text-right">{lineItem.qty || 0}</TableCell>
                        <TableCell className="text-right">
                          {lineItem.rate ? `$${formatMoneyValue(lineItem.rate)}` : 'Fixed'}
                        </TableCell>
                        <TableCell className="text-right">
                          ${formatMoneyValue(lineItem.amount || 0)}
                        </TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No line items found
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
                      ${formatMoneyValue(invoice.total || subtotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-8">
                <p className="text-sm font-medium">NOTES</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {invoice.public_note || invoice.cust_note || 'No customer notes added'}
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
          {/* <CardHeader></CardHeader> */}
          <CardContent>
            <div className="flex flex-col sm:px-0 pb-6 w-full">
              {/* Payment Information */}
              <div className="mt-8">
                <p className="text-sm font-medium my-4">Payment Information</p>

                {/* Amount Due Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Amount Due
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        ${formatMoneyValue(amountDue)}
                      </p>
                    </div>
                    <Badge variant={amountDue <= 0 ? 'green' : 'yellow'} className="text-sm">
                      {amountDue <= 0 ? 'Fully Paid' : 'Payment Due'}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  {/* Record Payment Dialog */}
                  <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size={'sm'} variant={'secondary'}>
                        <BanknoteIcon className="w-[16px] mr-2" />
                        Record Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>
                          Record Payment for INV-{formatNumber(invoice.invoice_number || 0)}
                        </DialogTitle>
                        <DialogDescription>
                          Add a new payment for this invoice. Outstanding balance: $
                          {formatMoneyValue(amountDue)}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount *
                          </Label>
                          <div className="col-span-3 relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              $
                            </span>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              min="0"
                              max={amountDue > 0 ? amountDue : undefined}
                              placeholder="0.00"
                              value={paymentForm.amount}
                              onChange={(e) => handlePaymentFormChange('amount', e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="payment_method" className="text-right">
                            Payment Method *
                          </Label>
                          <Input
                            id="payment_method"
                            placeholder="e.g., Cash, Check, Credit Card, Bank Transfer"
                            value={paymentForm.payment_method}
                            onChange={(e) =>
                              handlePaymentFormChange('payment_method', e.target.value)
                            }
                            className="col-span-3"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date_received" className="text-right">
                            Date Received *
                          </Label>
                          <Input
                            id="date_received"
                            type="date"
                            value={paymentForm.date_received}
                            onChange={(e) =>
                              handlePaymentFormChange('date_received', e.target.value)
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={handleClosePaymentDialog}>
                          Cancel
                        </Button>
                        <Button onClick={handleSubmitPayment} disabled={isCreatingPayment}>
                          {isCreatingPayment ? 'Recording...' : 'Record Payment'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Payment Dialog */}
                  <Dialog open={isEditPaymentDialogOpen} onOpenChange={setIsEditPaymentDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>
                          Edit Payment for INV-{formatNumber(invoice.invoice_number || 0)}
                        </DialogTitle>
                        <DialogDescription>Update the payment details below.</DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit_amount" className="text-right">
                            Amount *
                          </Label>
                          <div className="col-span-3 relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              $
                            </span>
                            <Input
                              id="edit_amount"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={editPaymentForm.amount}
                              onChange={(e) =>
                                handleEditPaymentFormChange('amount', e.target.value)
                              }
                              className="pl-8"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit_payment_method" className="text-right">
                            Payment Method *
                          </Label>
                          <Input
                            id="edit_payment_method"
                            placeholder="e.g., Cash, Check, Credit Card, Bank Transfer"
                            value={editPaymentForm.payment_method}
                            onChange={(e) =>
                              handleEditPaymentFormChange('payment_method', e.target.value)
                            }
                            className="col-span-3"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit_date_received" className="text-right">
                            Date Received *
                          </Label>
                          <Input
                            id="edit_date_received"
                            type="date"
                            value={editPaymentForm.date_received}
                            onChange={(e) =>
                              handleEditPaymentFormChange('date_received', e.target.value)
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={handleCloseEditPaymentDialog}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdatePayment}
                          disabled={isCreatingPayment || isDeletingPayment}>
                          {isCreatingPayment || isDeletingPayment
                            ? 'Updating...'
                            : 'Update Payment'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Payment History */}
                <div className="space-y-3">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                    Payment History
                  </h4>

                  {invoice.invoice_payment && invoice.invoice_payment.length > 0 ? (
                    <>
                      {invoice.invoice_payment.map((payment, index) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div>
                              <p className="font-medium text-sm">Payment #{index + 1}</p>
                              <p className="text-xs text-gray-500">
                                {payment.payment_method || 'Payment'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                +${formatMoneyValue(payment.amount || 0)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {payment.date_received
                                  ? formatDateWithAbbreviatedMonth(payment.date_received)
                                  : 'N/A'}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleEditPayment(payment)}
                                disabled={isDeletingPayment}
                                title="Edit payment">
                                <EditIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                                onClick={() => handleDeletePayment(payment.id)}
                                disabled={isDeletingPayment}
                                title="Delete payment">
                                <Trash2Icon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Payment Summary */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Total Payments
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          ${formatMoneyValue(totalPayments)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">No payments recorded yet</div>
                  )}
                </div>
              </div>

              {/* Private Note */}
              <div className="mt-4">
                <p className="text-sm font-medium my-4">Private Note</p>
                <Textarea
                  value={invoice.private_note || ''}
                  placeholder="No private notes added"
                  readOnly
                />
              </div>

              {/* Measurement Note */}
              <div className="mt-4">
                <p className="text-sm font-medium my-4">Measurement Note</p>
                <Textarea
                  value={invoice.sqft_measurement || ''}
                  placeholder="No measurement notes added"
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
