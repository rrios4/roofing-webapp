import React, { useState } from 'react';
import { DeleteAlertDialog } from '../../..';
import { useDeleteAllQuoteLineItemsWithQuote } from '../../../../hooks/useQuoteLineItem';

const ConnectedQuoteDeleteAlertDialog = (props) => {
  const { toast, itemNumber, isOpen, onClose, header, body, entityDescription } = props;

  const { mutate, isLoading: deleteQuoteLineItemIsLoading } = useDeleteAllQuoteLineItemsWithQuote(
    toast,
    itemNumber
  );

  const handleSubmit = async () => {
    // Deletes all quote line items with the quote itself also on success of the first request.
    mutate(itemNumber);
    // Closes the drawer
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
      loadingState={deleteQuoteLineItemIsLoading}
    />
  );
};

export default ConnectedQuoteDeleteAlertDialog;
