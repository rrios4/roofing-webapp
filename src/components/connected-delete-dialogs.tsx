import * as React from 'react';
import DefaultDeleteAlertDialog from './alert-delete-dialog';
import { useDeleteQRById } from '../hooks/useAPI/use-qr';
import { toast } from './ui/use-toast';
import { useDeleteInvoiceById } from '../hooks/useAPI/use-invoice';
import { useDeleteAllInvoiceLineItemsByInvoiceNumber } from '../hooks/useAPI/use-invoice-lineItem';
import { useDeleteAllInvoicePaymentsByInvoiceNumber } from '../hooks/useAPI/use-invoice-payment';
import { useDeleteAllQuoteLineItemsWithQuote } from '../hooks/useAPI/use-quote-lineitems';
import { useDeleteCustomer } from '../hooks/useAPI/use-customer';

type Props = {
  title: string;
  description: string;
  itemId: string | number;
  buttonTextEnabled?: boolean;
};

export default function ConnectedDeleteQRequestAlertDialog({ title, description, itemId }: Props) {
  const [open, setOpen] = React.useState(false);
  const { mutate: deleteQRByIdMutation, isLoading } = useDeleteQRById(toast, setOpen);
  const handeSubmit = async () => {
    const qrId = typeof itemId === 'number' ? itemId : parseInt(itemId, 10);
    deleteQRByIdMutation(qrId);
    // console.log(`Delete button works and will delete item with id: ${itemId}`);
  };
  return (
    <DefaultDeleteAlertDialog
      isLoading={isLoading}
      title={title}
      description={description}
      itemId={itemId}
      onSubmit={handeSubmit}
      open={open}
      onOpenChange={setOpen}
      buttonTextEnabled={false}
      buttonVariant={'secondary'}
    />
  );
}

export function ConnectedDeleteInvoiceAlertDialog({ title, description, itemId }: Props) {
  const [open, setOpen] = React.useState(false);
  const { mutate: deleteInvoiceByIdMutation, isLoading } =
    useDeleteAllInvoicePaymentsByInvoiceNumber(toast, setOpen);
  const handleSubmit = async () => {
    // Convert itemId to number to ensure proper type for API calls
    const invoiceNumber = parseInt(itemId?.toString() || '0', 10);
    if (invoiceNumber && invoiceNumber > 0) {
      deleteInvoiceByIdMutation(invoiceNumber);
    } else {
      toast({
        title: 'Error',
        description: 'Invalid invoice number provided.',
        variant: 'destructive'
      });
    }
  };
  return (
    <DefaultDeleteAlertDialog
      isLoading={isLoading}
      title={title}
      description={description}
      itemId={itemId}
      open={open}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
      buttonTextEnabled={false}
      buttonVariant={'outline'}
    />
  );
}

export function ConnectedDeleteQuoteAlertDialog({ title, description, itemId }: Props) {
  const [open, setOpen] = React.useState(false);
  const { mutate, isLoading } = useDeleteAllQuoteLineItemsWithQuote(toast, itemId, setOpen);
  const handleSubmit = async () => {
    // Convert itemId to number to ensure proper type for API calls
    const quoteNumber = parseInt(itemId?.toString() || '0', 10);
    if (quoteNumber && quoteNumber > 0) {
      mutate(quoteNumber);
    } else {
      toast({
        title: 'Error',
        description: 'Invalid quote number provided.',
        variant: 'destructive'
      });
    }
  };
  return (
    <DefaultDeleteAlertDialog
      isLoading={isLoading}
      title={title}
      description={description}
      open={open}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
      itemId={itemId}
      buttonTextEnabled={false}
      buttonVariant={'outline'}
    />
  );
}

export function ConnectedDeleteCustomerAlertDialog({
  title,
  description,
  itemId,
  buttonTextEnabled
}: Props) {
  const [open, setOpen] = React.useState(false);
  const { mutate: deleteCustomer, isLoading } = useDeleteCustomer(toast);
  const handleSubmit = async () => {
    const customerId = typeof itemId === 'number' ? itemId : parseInt(itemId, 10);
    deleteCustomer(customerId);
  };
  return (
    <DefaultDeleteAlertDialog
      open={open}
      isLoading={isLoading}
      title={title}
      description={description}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
      itemId={itemId}
      buttonTextEnabled={buttonTextEnabled ? buttonTextEnabled : false}
      buttonVariant={'primary'}
    />
  );
}
