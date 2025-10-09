import React from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BanknoteIcon } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateInvoicePayment } from '../hooks/useAPI/use-invoice-payment';
import { formatMoneyValue, formatNumber } from '../lib/utils';

interface RecordPaymentDialogProps {
  invoice: any;
  trigger?: React.ReactNode;
  onPaymentRecorded?: () => void;
}

export default function RecordPaymentDialog({
  invoice,
  trigger,
  onPaymentRecorded
}: RecordPaymentDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
  const [paymentForm, setPaymentForm] = React.useState({
    amount: '',
    payment_method: '',
    date_received: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  });

  const { mutate: createPayment, isLoading: isCreatingPayment } = useCreateInvoicePayment(
    toast,
    setIsPaymentDialogOpen
  );

  // Calculate amount due
  const subtotal =
    invoice.invoice_line_service?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) ||
    0;
  const totalPayments =
    invoice.invoice_payment?.reduce(
      (sum: number, payment: any) => sum + (payment.amount || 0),
      0
    ) || 0;
  const amountDue = subtotal - totalPayments;

  // Handle payment form changes
  const handlePaymentFormChange = (field: string, value: string) => {
    setPaymentForm((prev) => ({
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
            queryKey: ['invoiceById', invoice.invoice_number]
          });

          // Also invalidate the invoices list to update the table
          queryClient.invalidateQueries({
            queryKey: ['invoices']
          });

          setIsPaymentDialogOpen(false);

          // Call optional callback
          if (onPaymentRecorded) {
            onPaymentRecorded();
          }
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

  const defaultTrigger = (
    <Button size={'icon'} variant={'outline'} title="Record payment">
      <BanknoteIcon className="w-[16px]" />
    </Button>
  );

  return (
    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Record Payment for INV-{formatNumber(invoice.invoice_number || 0)}
          </DialogTitle>
          <DialogDescription>
            Add a new payment for this invoice. Outstanding balance: ${formatMoneyValue(amountDue)}
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
              onChange={(e) => handlePaymentFormChange('payment_method', e.target.value)}
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
              onChange={(e) => handlePaymentFormChange('date_received', e.target.value)}
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
  );
}
