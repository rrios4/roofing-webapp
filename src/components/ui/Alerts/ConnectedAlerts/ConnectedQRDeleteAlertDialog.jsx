import React, { useState } from 'react';
import { DeleteAlertDialog } from '../../..';
import supabase from '../../../../utils/supabaseClient.js';
import { useQueryClient } from '@tanstack/react-query';

const ConnectedQRDeleteAlertDialog = (props) => {
  const { toast, itemNumber, isOpen, onClose, header, body, entityDescription } =
    props;
  const queryClient = useQueryClient();

  // Handles the loading state to complete process
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async () => {
    setLoadingState(true);
    const { data, error } = await supabase.from('quote_request').delete().eq('id', itemNumber);

    if (error) {
      toast({
        position: `top`,
        title: `Error occured deleting QR #${itemNumber}!`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
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
      loadingState={loadingState}
    />
  );
};

export default ConnectedQRDeleteAlertDialog;
