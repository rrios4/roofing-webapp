import React from 'react';
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
  Button,
  Flex,
  Box
} from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';

const DeleteAlertDialog = (props) => {
  const { body, isOpen, onClose, header, entityDescription, loadingState, onSubmit } = props;

  // Handles the onClick when button is pressed and executes obSubmit from prop
  const handleOnClick = (e) => {
    e.preventDefault();
    onSubmit();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex gap={'2'}>
            <Box my={'auto'}>
              <Trash2 size={'20px'} />
            </Box>
            <Text>{header}</Text>
          </Flex>
          {/* Delete {tableName} */}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box fontWeight={'bold'} mb={'1rem'} textColor={useColorModeValue('red.500', 'red.400')}>
            Are you sure you want to delete:{' '}
            <Text as="span" textColor={useColorModeValue('gray.700', 'gray.300')}>
              {entityDescription}{' '}
            </Text>
            ?{' '}
          </Box>
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
