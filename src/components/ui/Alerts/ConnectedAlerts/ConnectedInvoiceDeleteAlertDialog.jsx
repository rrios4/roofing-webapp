import React, { useState } from 'react';
import supabase from '../../../../utils/supabaseClient.js';
import { DeleteAlertDialog } from '../../..';
import { useDeleteAllInvoicePaymentsByInvoiceNumber } from '../../../../hooks/useAPI/useInvoicePayments';

const ConnectedInvoiceDeleteAlertDialog = (props) => {
  const { toast, itemNumber, isOpen, onClose, header, body, entityDescription } = props;

  // Handles the loading state to complete process
  const [loadingState, setLoadingState] = useState(false);
  const { mutate } = useDeleteAllInvoicePaymentsByInvoiceNumber(toast);

  // Main function that sends request to delete associated items and invoice data for selected id
  const handleSubmit = async () => {
    setLoadingState(true);
    // Muratuion that starts by deleting invoice payments, then to line items, then to invoice. All chain after onSuccess
    mutate(itemNumber);

    // Closes Drawer
    onClose();
    setLoadingState(false);
  };

  return (
    <DeleteAlertDialog
      onSubmit={handleSubmit}
      header={header}
      entityDescription={entityDescription}
      body={body}
      onClose={onClose}
      isOpen={isOpen}
      loadingState={loadingState}
    />
  );
};

export default ConnectedInvoiceDeleteAlertDialog;
