import React from 'react';
import supabase from '../../utils/supabaseClient';
import {
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button
} from '@chakra-ui/react';

const DeleteAlertDialog = (props) => {
  const {
    body,
    isOpen,
    onClose,
    itemNumber,
    tableName,
    tableFieldName,
    toast,
    updateParentState,
    loadingState
  } = props;

  // Logic that deletes item based on the tableName, itemNumber, fieldName props
  const deleteItem = async () => {
    // We delete associated items first to a main table first
    if (tableName === 'invoice') {
      await deletePaymentsByInvoiceNumber();
      await deleteInvoiceLineItems();
    }

    const { data, error } = await supabase.from(tableName).delete().eq(tableFieldName, itemNumber);

    if (error) {
      // console.log(error);
      toast({
        position: `top`,
        title: `Error deleting ${tableName} #${itemNumber} occured!`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    // Update the parent state data
    await updateParentState();

    // Success toast feedback is called when data is return from supabase client SDK
    if (data) {
      toast({
        position: `top`,
        title: `${tableName} #${itemNumber} deleted!`,
        description: `We've deleted ${tableName} #${itemNumber} for you 🚀`,
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
    const { data, error } = await supabase.from('payment').delete().eq('invoice_id', itemNumber);

    if (error) {
      console.log(error);
    }
  };

  // Handles the action to delete all invoice line services associated with the invoice number
  const deleteInvoiceLineItems = async () => {
    const { data, error } = await supabase
      .from('invoice_line_service')
      .delete()
      .eq('invoice_id', itemNumber);

    if (error) {
      console.log(error);
    }
  };

  return (
    // <AlertDialog isOpen={isOpen} onClose={onClose} motionPreset="scale">
    //   <AlertDialogOverlay>
    //     <AlertDialogContent>
    //       <AlertDialogHeader fontSize="lg" fontWeight="bold">
    //         {header}
    //       </AlertDialogHeader>

    //       <AlertDialogBody>{body}</AlertDialogBody>
    //       <AlertDialogFooter>
    //         <Button onClick={onClose}>Cancel</Button>
    //         <Button colorScheme={'red'} onClick={deleteItem} ml={3}>
    //           Delete
    //         </Button>
    //       </AlertDialogFooter>
    //     </AlertDialogContent>
    //   </AlertDialogOverlay>
    // </AlertDialog>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>Delete {tableName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight={'bold'} mb={'1rem'}>
            Are you sure you want to delete:{' '}
            <Text as="span" textColor={useColorModeValue('blue.400', 'blue.500')}>
              {tableName.toUpperCase()} #{itemNumber}
            </Text>
            ?{' '}
          </Text>
          {/* <Text>Once you confirm there will be no way to restore the information. 😢</Text> */}
          <Text>{body}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={'red'} onClick={deleteItem} isLoading={loadingState}>
            Delete
          </Button>
          <Button variant={'solid'} ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAlertDialog;
