import React, { useState } from 'react';
import { DeleteAlertDialog } from '../../';
import { supabase } from '../../../utils';

const ConnectedQuoteDeleteAlertDialog = (props) => {
  const { toast, itemNumber, updateParentState, isOpen, onClose, header, body, entityDescription } =
    props;

  // Handles the loading state to complete process
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async () => {
    setLoadingState(true);
    await deleteLineItems();
    const { data, error } = await supabase.from('quote').delete().eq('quote_number', itemNumber);

    if (error) {
      toast({
        position: `top`,
        title: `Error occured deleting Quote #${itemNumber}!`,
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
        title: `QR #${itemNumber} deleted!`,
        description: `We've deleted QR #${itemNumber} with line-items for you succesfully! 🚀`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
    // Closes the drawer
    onClose();
  };

  const deleteLineItems = async () => {
    const { data, error } = await supabase
      .from('quote_line_item')
      .delete()
      .eq('quote_id', itemNumber);

    if (error) {
      console.log(error.message);
      toast({
        position: `top`,
        title: `Error occured deleting line-item for Quote #${itemNumber}!`,
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

export default ConnectedQuoteDeleteAlertDialog;
