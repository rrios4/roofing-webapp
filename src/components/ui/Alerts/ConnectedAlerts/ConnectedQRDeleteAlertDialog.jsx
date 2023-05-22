import React from 'react';
import { DeleteAlertDialog } from '../../..';
import { useDeleteQRById } from '../../../../hooks/useAPI/useQuoteRequests';

const ConnectedQRDeleteAlertDialog = (props) => {
  const { toast, itemNumber, isOpen, onClose, header, body, entityDescription } = props;
  const { mutate, isLoading } = useDeleteQRById(toast);

  const handleSubmit = async () => {
    // const { data, error } = await supabase.from('quote_request').delete().eq('id', itemNumber);

    // if (error) {
    //   toast({
    //     position: `top`,
    //     title: `Error occured deleting QR #${itemNumber}!`,
    //     description: `Error: ${error.message}`,
    //     status: 'error',
    //     duration: 5000,
    //     isClosable: true
    //   });
    // }

    // if (data) {
    //   queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });

    //   toast({
    //     position: `top`,
    //     title: `QR #${itemNumber} deleted!`,
    //     description: `We've deleted QR #${itemNumber} for you succesfully! 🚀`,
    //     status: 'success',
    //     duration: 5000,
    //     isClosable: true
    //   });
    // }
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
