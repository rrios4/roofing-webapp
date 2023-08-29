import React from 'react';
import DefaultDeleteAlertDialog from './alert-delete-dialog';
import { useDeleteQRById } from '../hooks/useAPI/useQuoteRequests';
import { toast } from './ui/use-toast';
import { useDeleteInvoiceById } from '../hooks/useAPI/useInvoices';
import { useDeleteAllInvoiceLineItemsByInvoiceNumber } from '../hooks/useAPI/useInvoiceLineItem';
import { useDeleteAllInvoicePaymentsByInvoiceNumber } from '../hooks/useAPI/useInvoicePayments';
import { useDeleteAllQuoteLineItemsWithQuote } from '../hooks/useAPI/useQuoteLineItem';

type Props = {
  title: string;
  description: string;
  itemId: any;
};

export default function ConnectedDeleteQRequestAlertDialog({ title, description, itemId }: Props) {
  const [open, setOpen] = React.useState(false);
  const { mutate: deleteQRByIdMutation, isLoading } = useDeleteQRById(toast, setOpen);
  const handeSubmit = async () => {
    deleteQRByIdMutation(itemId);
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
    />
  );
}

export function ConnectedDeleteInvoiceAlertDialog({ title, description, itemId }: Props) {
  const [open, setOpen] = React.useState(false);
  const { mutate: deleteInvoiceByIdMutation, isLoading } =
    useDeleteAllInvoicePaymentsByInvoiceNumber(toast, setOpen);
  const handleSubmit = async () => {
    deleteInvoiceByIdMutation(itemId);
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
    />
  );
}

export function ConnectedDeleteQuoteAlertDialog({ title, description, itemId }: Props) {
  const [open, setOpen] = React.useState(false);
  const { mutate, isLoading } = useDeleteAllQuoteLineItemsWithQuote(toast, itemId, setOpen);
  const handleSubmit = async () => {
    mutate(itemId);
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
    />
  );
}
