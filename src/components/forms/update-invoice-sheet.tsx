import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../ui/sheet';
import { Button } from '../ui/button';
import { PencilIcon } from 'lucide-react';
import UpdateInvoiceForm from './update-invoice-form';
import { useFetchInvoiceById } from '../../hooks/useAPI/use-invoice';
import { Invoice } from '../../types/db_types';

type Props = {
  invoice: Invoice;
  trigger?: React.ReactNode;
};

/**
 * UpdateInvoiceSheet Component
 *
 * A sheet component that wraps the UpdateInvoiceForm for editing an existing invoice.
 * This component handles loading the invoice data and line items before rendering the form.
 *
 * @param invoice - The invoice object to be updated
 * @param trigger - Optional custom trigger element, defaults to a pencil icon button
 */
export default function UpdateInvoiceSheet({ invoice, trigger }: Props) {
  // Fetch the full invoice data and line items
  const { data: invoiceById, isLoading, isError } = useFetchInvoiceById(invoice.invoice_number);

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <PencilIcon className="h-4 w-4" />
      Edit Invoice
    </Button>
  );

  if (isError) {
    return <div className="text-red-500 text-sm">Error loading invoice data</div>;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>

      <SheetContent className="w-full md:w-[600px] sm:max-w-none overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Update Invoice #{invoice.invoice_number}</SheetTitle>
          <SheetDescription>
            Make changes to the invoice details, line items, and notes.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : invoiceById ? (
          <UpdateInvoiceForm
            invoice={invoiceById}
            invoiceLineItems={(invoiceById as any).invoice_line_service || []}
          />
        ) : (
          <div className="text-gray-500 text-sm py-4">Invoice not found</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
