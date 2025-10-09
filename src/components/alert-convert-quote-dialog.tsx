import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { CheckCircleIcon, RefreshCcwIcon } from 'lucide-react';

interface ConvertQuoteAlertDialogProps {
  trigger?: React.ReactNode;
  quoteNumber?: number;
  customerName?: string;
  total?: number;
  onConfirm: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ConvertQuoteAlertDialog({
  trigger,
  quoteNumber,
  customerName,
  total,
  onConfirm,
  isLoading = false,
  disabled = false
}: ConvertQuoteAlertDialogProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="default" disabled={disabled} className="w-full">
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Convert to Invoice
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RefreshCcwIcon className="w-5 h-5 text-blue-600" />
            Convert Quote to Invoice
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to convert <strong>Quote #{quoteNumber}</strong> to an invoice?
            </p>
            {customerName && (
              <p className="text-sm text-gray-600">
                <strong>Customer:</strong> {customerName}
              </p>
            )}
            {total !== undefined && (
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong> {formatMoney(total)}
              </p>
            )}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
              <p className="text-sm text-amber-800">
                <strong>⚠️ Important:</strong> This action cannot be undone. Once converted, this
                quote will become an invoice and cannot be edited as a quote.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <RefreshCcwIcon className="w-4 h-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Yes, Convert to Invoice
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConvertQuoteAlertDialog;
