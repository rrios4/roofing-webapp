import React, { useState } from 'react';
import { DeleteAlertDialog } from '../..';
import supabase from '../../../utils/supabaseClient.js';

const ConnectedInvoiceDeleteAlertDialog = (props) => {
  const { toast, itemNumber, updateParentState, isOpen, onClose, header, body, entityDescription } =
    props;

  // Handles the loading state to complete process
  const [loadingState, setLoadingState] = useState(false);

  // Main function that sends request to delete associated items and invoice data for selected id
  const handleSubmit = async () => {
    setLoadingState(true);
    await deletePaymentsByInvoiceNumber();
    await deleteInvoiceLineItems();

    const { data, error } = await supabase
      .from('invoice')
      .delete()
      .eq('invoice_number', itemNumber);

    if (error) {
      // console.log(error);
      toast({
        position: `top`,
        title: `Error occured deleting Invoice #${itemNumber} !`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      await updateParentState();
      setLoadingState(false);

      toast({
        position: `top`,
        title: `Invoice #${itemNumber} deleted!`,
        description: `We've deleted all invoice's payments & line-items associated with invoice #${itemNumber} for you succesfully! 🚀`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }

    // Closes Drawer
    onClose();
  };

  // Handles the action to all delete payments assiated with the invoice number
  const deletePaymentsByInvoiceNumber = async () => {
    const { error } = await supabase.from('payment').delete().eq('invoice_id', itemNumber);

    if (error) {
      console.log(error);
      toast({
        position: `top`,
        title: `Error occured deleting Invoice's Payments #${itemNumber}!`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Handles the action to delete all invoice line services associated with the invoice number
  const deleteInvoiceLineItems = async () => {
    const { error } = await supabase
      .from('invoice_line_service')
      .delete()
      .eq('invoice_id', itemNumber);

    if (error) {
      console.log(error);
      toast({
        position: `top`,
        title: `Error occured deleting Invoice's' Line Items #${itemNumber}!`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
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
