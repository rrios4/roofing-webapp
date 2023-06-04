import React from 'react';
import { DeleteAlertDialog } from '../../..';
import { useDeleteQRById } from '../../../../hooks/useAPI/useQuoteRequests';

const ConnectedQRDeleteAlertDialog = (props) => {
  const { toast, itemNumber, isOpen, onClose, header, body, entityDescription } = props;
  const { mutate, isLoading } = useDeleteQRById(toast);

  const handleSubmit = async () => {
    mutate(itemNumber);
    // Closes Drawer
    onClose();
  };

  return (
    <DeleteAlertDialog
      onSubmit={handleSubmit}
      header={header}
      entityDescription={entityDescription}
      body={body}
      onClose={onClose}
      isOpen={isOpen}
      loadingState={isLoading}
    />
  );
};

export default ConnectedQRDeleteAlertDialog;
