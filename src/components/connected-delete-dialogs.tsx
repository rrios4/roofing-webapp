import React from 'react';
import DefaultDeleteAlertDialog from './alert-delete-dialog';
import { useDeleteQRById } from '../hooks/useAPI/useQuoteRequests';
import { toast } from './ui/use-toast';

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
