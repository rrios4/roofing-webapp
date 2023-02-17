import React, { useState } from 'react';
import { DeleteAlertDialog } from '../../';
import supabase from '../../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ConnectedCustomerDeleteAlertDialog = (props) => {
  const {
    toast,
    itemNumber,
    updateParentState,
    isOpen,
    onClose,
    header,
    body,
    entityDescription,
    onSubmit
  } = props;

  // Handles the loading state to complete process
  const [loadingState, setLoadingState] = useState(false);
  const navigate = useNavigate();

  // Function that does action to delete customer by id from DB
  const handleModalDeleteOnClick = async () => {
    setLoadingState(true);
    let { data, error } = await supabase.from('customer').delete().eq('id', `${itemNumber}`);

    if (error) {
      console.log(error);
      // handleCustomerErrorDeleteToast();
      toast({
        position: 'top',
        title: 'Error Occured Deleting Customer!',
        description: `Message: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      setLoadingState(false);
      navigate('/customers');
      toast({
        position: 'top',
        title: `Customer deleted!`,
        description: `We've deleted customer and associated data pertaining to that customer for you 🎉.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  };

  //   const handleSubmit = async () => {
  //     const { data, error } = await supabase.from('customer').delete().eq('id', itemNumber);

  //     if (error) {
  //       console.log(error);
  //       toast({
  //         position: `top`,
  //         title: `Error Deleting Customer #${itemNumber} occured!`,
  //         description: `Error: ${error.message}`,
  //         status: 'error',
  //         duration: 5000,
  //         isClosable: true
  //       });
  //     }

  //     if (data) {
  //       toast({
  //         position: `top`,
  //         title: `Customer #${itemNumber} deleted!`,
  //         description: `We've deleted all invoice's payments & line-items associated with invoice #${itemNumber} for you succesfully! 🚀`,
  //         status: 'success',
  //         duration: 5000,
  //         isClosable: true
  //       });
  //     }
  //   };

  return (
    <DeleteAlertDialog
      onSubmit={handleModalDeleteOnClick}
      header={header}
      entityDescription={entityDescription}
      body={body}
      onClose={onClose}
      isOpen={isOpen}
      loadingState={loadingState}
    />
  );
};

export default ConnectedCustomerDeleteAlertDialog;
