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
    header,
    entityDescription,
    toast,
    updateParentState,
    loadingState,
    onSubmit
  } = props;

  // Handles the onClick when button is pressed and executes obSubmit from prop
  const handleOnClick = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>
          {header}
          {/* Delete {tableName} */}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight={'bold'} mb={'1rem'}>
            Are you sure you want to delete:{' '}
            <Text as="span" textColor={useColorModeValue('blue.400', 'blue.500')}>
              {/* {tableName.toUpperCase()} #{itemNumber} */}
              {entityDescription}
            </Text>
            ?{' '}
          </Text>
          {/* <Text>Once you confirm there will be no way to restore the information. 😢</Text> */}
          <Text>{body}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={'red'} onClick={handleOnClick} isLoading={loadingState}>
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
