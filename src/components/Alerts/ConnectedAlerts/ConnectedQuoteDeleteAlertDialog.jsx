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
        description: `We've deleted QR #${itemNumber} for you succesfully! 🚀`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
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
      loadingState={loadingState}
    />
  );
};

export default ConnectedQuoteDeleteAlertDialog;
